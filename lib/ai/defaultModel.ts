import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";

const DEFAULT_MODEL_FILENAME = "qwen2.5-0.5b-instruct-q4_0.gguf";
const DEFAULT_MODEL_ASSET = require("../../assets/qwen2.5-0.5b-instruct-q4_0.gguf");

export const DEFAULT_MODEL_NAME = "Qwen2.5 0.5B Instruct (Q4_0)";

const stripFileScheme = (uri: string): string =>
  uri.startsWith("file://") ? uri.replace("file://", "") : uri;

export const ensureDefaultModel = async (
  onProgress?: (progress: number) => void,
): Promise<string> => {
  const targetDir = `${FileSystem.documentDirectory}models/`;
  const targetPath = `${targetDir}${DEFAULT_MODEL_FILENAME}`;

  const dirInfo = await FileSystem.getInfoAsync(targetDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
  }

  const fileInfo = await FileSystem.getInfoAsync(targetPath);
  if (fileInfo.exists && fileInfo.size && fileInfo.size > 0) {
    return stripFileScheme(targetPath);
  }

  onProgress?.(0);

  const asset = Asset.fromModule(DEFAULT_MODEL_ASSET);
  await asset.downloadAsync();

  const sourceUri = asset.localUri ?? asset.uri;
  if (!sourceUri) {
    throw new Error("Default model asset is unavailable");
  }

  await FileSystem.copyAsync({ from: sourceUri, to: targetPath });
  onProgress?.(1);

  return stripFileScheme(targetPath);
};
