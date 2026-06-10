import * as FileSystem from "expo-file-system/legacy";

const DEFAULT_MODEL_FILENAME = "qwen2.5-0.5b-instruct-q4_0.gguf";
const DEFAULT_MODEL_URL =
  "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_0.gguf?download=true";

export const DEFAULT_MODEL_NAME = "Qwen2.5 0.5B Instruct (Q4_0)";

const stripFileScheme = (uri: string): string =>
  uri.startsWith("file://") ? uri.replace("file://", "") : uri;

export const ensureDefaultModel = async (
  onProgress?: (progress: number) => void,
): Promise<string> => {
  const targetDir = `${FileSystem.documentDirectory}models/`;
  const targetPath = `${targetDir}${DEFAULT_MODEL_FILENAME}`;
  const tempPath = `${targetPath}.download`;

  const dirInfo = await FileSystem.getInfoAsync(targetDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
  }

  const fileInfo = await FileSystem.getInfoAsync(targetPath);
  if (fileInfo.exists && fileInfo.size && fileInfo.size > 0) {
    return stripFileScheme(targetPath);
  }

  // Clean up any partial download left over from a previous failed attempt.
  const tempInfo = await FileSystem.getInfoAsync(tempPath);
  if (tempInfo.exists) {
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
  }

  onProgress?.(0);

  const downloader = FileSystem.createDownloadResumable(
    DEFAULT_MODEL_URL,
    tempPath,
    {},
    (progress) => {
      const { totalBytesWritten, totalBytesExpectedToWrite } = progress;
      if (totalBytesExpectedToWrite > 0) {
        onProgress?.(totalBytesWritten / totalBytesExpectedToWrite);
      }
    },
  );

  let result;
  try {
    result = await downloader.downloadAsync();
  } catch (err) {
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
    throw err;
  }

  if (!result || result.status !== 200) {
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
    throw new Error(
      `Failed to download model (status ${result?.status ?? "unknown"})`,
    );
  }

  // Move into place only once the download fully succeeds, so an
  // interrupted download never looks like a valid cached model.
  await FileSystem.moveAsync({ from: tempPath, to: targetPath });
  onProgress?.(1);

  return stripFileScheme(targetPath);
};
