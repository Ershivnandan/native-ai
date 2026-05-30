import {
  initLlama,
  releaseAllLlama,
  type LlamaContext,
  type ContextParams,
} from "llama.rn";
import type { ModelStatus } from "@/types/ai";
import { ensureDefaultModel } from "@/lib/ai/defaultModel";

type StatusListener = (status: ModelStatus, progress?: number) => void;

let currentContext: LlamaContext | null = null;
let currentModelPath: string | null = null;
let statusListeners: StatusListener[] = [];
let currentStatus: ModelStatus = "idle";
let inFlightLoad: Promise<LlamaContext> | null = null;

const notifyListeners = (status: ModelStatus, progress?: number) => {
  currentStatus = status;
  statusListeners.forEach((listener) => listener(status, progress));
};

export const getModelStatus = (): ModelStatus => currentStatus;

export const getContext = (): LlamaContext | null => currentContext;

export const subscribeToStatus = (listener: StatusListener) => {
  statusListeners.push(listener);
  return () => {
    statusListeners = statusListeners.filter((l) => l !== listener);
  };
};

export const loadModel = async (modelPath: string): Promise<LlamaContext> => {
  if (currentContext && currentModelPath === modelPath) {
    return currentContext;
  }

  if (inFlightLoad && currentModelPath === modelPath) {
    return inFlightLoad;
  }

  if (currentContext) {
    await unloadModel();
  }

  currentModelPath = modelPath;
  notifyListeners("loading", 0);

  const contextParams: ContextParams = {
    model: modelPath,
    n_ctx: 2048,
    n_batch: 512,
    n_threads: 4,
    use_mlock: true,
    flash_attn_type: "auto",
    cache_type_k: "q4_0",
    cache_type_v: "q4_0",
  };

  inFlightLoad = (async () => {
    try {
      const context = await initLlama(contextParams, (progress) => {
        notifyListeners("loading", progress);
      });
      currentContext = context;
      notifyListeners("ready");
      return context;
    } catch (err) {
      currentModelPath = null;
      notifyListeners("error");
      throw err;
    } finally {
      inFlightLoad = null;
    }
  })();

  return inFlightLoad;
};

export const ensureModelLoaded = async (): Promise<{
  context: LlamaContext;
  path: string;
}> => {
  if (currentContext && currentModelPath) {
    return { context: currentContext, path: currentModelPath };
  }
  const path = currentModelPath ?? (await ensureDefaultModel());
  const context = inFlightLoad
    ? await inFlightLoad
    : await loadModel(path);
  return { context, path };
};

export const unloadModel = async (): Promise<void> => {
  if (currentContext) {
    await currentContext.release();
    currentContext = null;
    currentModelPath = null;
    notifyListeners("idle");
  }
};

export const releaseAll = async (): Promise<void> => {
  await releaseAllLlama();
  currentContext = null;
  currentModelPath = null;
  notifyListeners("idle");
};

export const isModelLoaded = (): boolean => currentContext !== null;

export const getLoadedModelPath = (): string | null => currentModelPath;
