import type { GenerationParams } from "@/types/ai";

export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 1024,
  stopSequences: [],
};

export const MAX_CONTEXT_LENGTH = 2048;

export const SYSTEM_PROMPT =
  "You are a helpful AI assistant. Respond concisely and accurately. Use markdown formatting when appropriate.";
