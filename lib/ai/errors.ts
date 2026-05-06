export type AIErrorType =
  | "model_not_loaded"
  | "model_load_failed"
  | "generation_failed"
  | "out_of_memory"
  | "context_overflow"
  | "unknown";

export interface AIError {
  type: AIErrorType;
  message: string;
  recoverable: boolean;
  suggestion: string;
}

export const classifyError = (error: Error): AIError => {
  const msg = error.message.toLowerCase();

  if (msg.includes("out of memory") || msg.includes("oom")) {
    return {
      type: "out_of_memory",
      message: "Device ran out of memory",
      recoverable: true,
      suggestion: "Try reducing context length or using a smaller model",
    };
  }

  if (msg.includes("context") && msg.includes("overflow")) {
    return {
      type: "context_overflow",
      message: "Context window exceeded",
      recoverable: true,
      suggestion: "Conversation is too long. Start a new chat or clear history",
    };
  }

  if (msg.includes("not loaded") || msg.includes("no context")) {
    return {
      type: "model_not_loaded",
      message: "No model is loaded",
      recoverable: true,
      suggestion: "Load a model from Settings before chatting",
    };
  }

  if (msg.includes("load") || msg.includes("init")) {
    return {
      type: "model_load_failed",
      message: "Failed to load the model",
      recoverable: true,
      suggestion: "Check if the model file exists and is not corrupted",
    };
  }

  return {
    type: "unknown",
    message: error.message,
    recoverable: false,
    suggestion: "An unexpected error occurred. Try restarting the app",
  };
};

export const getErrorMessage = (error: Error): string => {
  const classified = classifyError(error);
  return classified.suggestion;
};
