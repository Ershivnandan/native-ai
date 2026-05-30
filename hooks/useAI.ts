import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addMessage,
  updateLastMessage,
  setIsGenerating,
  selectIsGenerating,
} from "@/store/chatSlice";
import {
  selectMaxContextLength,
  selectModelId,
  setModelId,
} from "@/store/settingsSlice";
import {
  loadModel,
  unloadModel,
  getModelStatus,
  subscribeToStatus,
  ensureModelLoaded,
} from "@/lib/ai/modelManager";
import { generate } from "@/lib/ai/inference";
import type { ModelStatus } from "@/types/ai";
import type { Message } from "@/types/chat";

interface UseAIReturn {
  modelStatus: ModelStatus;
  loadProgress: number;
  isGenerating: boolean;
  loadModelFromPath: (path: string) => Promise<void>;
  unload: () => Promise<void>;
  generateResponse: (chatId: string, messages: Message[]) => Promise<void>;
  stopGeneration: () => void;
  error: string | null;
}

export const useAI = (): UseAIReturn => {
  const dispatch = useAppDispatch();
  const isGenerating = useAppSelector(selectIsGenerating);
  const maxContextLength = useAppSelector(selectMaxContextLength);
  const modelPath = useAppSelector(selectModelId);

  const [modelStatus, setModelStatus] = useState<ModelStatus>(getModelStatus);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stopRef = useRef<(() => Promise<void>) | null>(null);
  const autoLoadStartedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToStatus((status, progress) => {
      setModelStatus(status);
      if (progress !== undefined) {
        setLoadProgress(progress);
      }
      if (status === "error") {
        setError("Model encountered an error");
      }
    });
    return unsubscribe;
  }, []);

  const loadModelFromPath = useCallback(
    async (path: string) => {
      setError(null);
      try {
        await loadModel(path);
        dispatch(setModelId(path));
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load model";
        setError(message);
        setModelStatus("error");
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (autoLoadStartedRef.current) return;
    autoLoadStartedRef.current = true;

    (async () => {
      try {
        if (modelPath) {
          await loadModel(modelPath);
        } else {
          const { path } = await ensureModelLoaded();
          dispatch(setModelId(path));
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load model";
        setError(message);
        setModelStatus("error");
      }
    })();
  }, [dispatch, modelPath]);

  const unload = useCallback(async () => {
    if (isGenerating) {
      await stopRef.current?.();
      dispatch(setIsGenerating(false));
    }
    await unloadModel();
    dispatch(setModelId(null));
    setError(null);
  }, [dispatch, isGenerating]);

  const generateResponse = useCallback(
    async (chatId: string, messages: Message[]) => {
      if (isGenerating) return;

      setError(null);
      try {
        await ensureModelLoaded();
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load model";
        setError(message);
        return;
      }

      dispatch(setIsGenerating(true));
      dispatch(addMessage({ chatId, role: "assistant", content: "" }));

      const { stop } = generate({
        messages,
        maxContextTokens: maxContextLength,
        onToken: (_token, accumulated) => {
          dispatch(updateLastMessage({ chatId, content: accumulated }));
        },
        onComplete: () => {
          dispatch(setIsGenerating(false));
          stopRef.current = null;
        },
        onError: (err) => {
          dispatch(setIsGenerating(false));
          setError(err.message);
          stopRef.current = null;
        },
      });

      stopRef.current = stop;
    },
    [dispatch, isGenerating, maxContextLength],
  );

  const stopGeneration = useCallback(async () => {
    if (stopRef.current) {
      await stopRef.current();
      stopRef.current = null;
    }
    dispatch(setIsGenerating(false));
  }, [dispatch]);

  return {
    modelStatus,
    loadProgress,
    isGenerating,
    loadModelFromPath,
    unload,
    generateResponse,
    stopGeneration,
    error,
  };
};
