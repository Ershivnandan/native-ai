import type { NativeCompletionResult, TokenData } from "llama.rn";
import { getContext } from "./modelManager";
import { formatMessagesForLlama, truncateContext } from "./prompts";
import { createStreamState, processToken, completeStream } from "./streaming";
import type { StreamCallback } from "./streaming";
import type { Message } from "@/types/chat";
import type { GenerationParams } from "@/types/ai";
import { DEFAULT_GENERATION_PARAMS, MAX_CONTEXT_LENGTH } from "@/constants/ai";

interface GenerateOptions {
  messages: Message[];
  params?: Partial<GenerationParams>;
  maxContextTokens?: number;
  onToken: StreamCallback;
  onComplete?: (result: NativeCompletionResult) => void;
  onError?: (error: Error) => void;
}

interface GenerateResult {
  stop: () => Promise<void>;
  promise: Promise<NativeCompletionResult | null>;
}

export const generate = (options: GenerateOptions): GenerateResult => {
  const {
    messages,
    params,
    maxContextTokens = MAX_CONTEXT_LENGTH,
    onToken,
    onComplete,
    onError,
  } = options;

  const context = getContext();
  if (!context) {
    const error = new Error("Model not loaded");
    onError?.(error);
    return {
      stop: async () => {},
      promise: Promise.resolve(null),
    };
  }

  const mergedParams: GenerationParams = {
    ...DEFAULT_GENERATION_PARAMS,
    ...params,
  };

  const truncatedMessages = truncateContext(messages, maxContextTokens);
  const formattedMessages = formatMessagesForLlama(truncatedMessages);

  let streamState = createStreamState();

  const tokenCallback = (data: TokenData) => {
    streamState = processToken(streamState, data, onToken);
  };

  const promise = context
    .completion(
      {
        messages: formattedMessages,
        n_predict: mergedParams.maxTokens,
        temperature: mergedParams.temperature,
        top_p: mergedParams.topP,
        stop: mergedParams.stopSequences,
      },
      tokenCallback,
    )
    .then((result) => {
      streamState = completeStream(streamState);
      onComplete?.(result);
      return result;
    })
    .catch((error: unknown) => {
      streamState = completeStream(streamState);
      const err =
        error instanceof Error ? error : new Error("Generation failed");
      onError?.(err);
      return null;
    });

  const stop = async () => {
    streamState = completeStream(streamState);
    await context.stopCompletion();
  };

  return { stop, promise };
};

export const tokenize = async (text: string): Promise<number> => {
  const context = getContext();
  if (!context) return Math.ceil(text.length / 4);

  const result = await context.tokenize(text);
  return result.tokens.length;
};
