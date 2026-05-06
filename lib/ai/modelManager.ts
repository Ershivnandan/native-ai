import {
  initLlama,
  releaseAllLlama,
  type LlamaContext,
  type ContextParams,
} from "llama.rn";
import type { ModelStatus } from "@/types/ai";

type StatusListener = (status: ModelStatus, progress?: number) => void;

let currentContext: LlamaContext | null = null;
let currentModelPath: string | null = null;
let statusListeners: StatusListener[] = [];
let currentStatus: ModelStatus = "idle";

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

  if (currentContext) {
    await unloadModel();
  }

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

  const context = await initLlama(contextParams, (progress) => {
    notifyListeners("loading", progress);
  });

  currentContext = context;
  currentModelPath = modelPath;
  notifyListeners("ready");

  return context;
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
