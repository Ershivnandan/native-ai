import type { TokenData, NativeCompletionResult } from "llama.rn";

export type StreamCallback = (token: string, accumulated: string) => void;
export type StreamCompleteCallback = (result: NativeCompletionResult) => void;
export type StreamErrorCallback = (error: Error) => void;

interface StreamState {
  accumulated: string;
  isActive: boolean;
  tokenCount: number;
}

export const createStreamState = (): StreamState => ({
  accumulated: "",
  isActive: true,
  tokenCount: 0,
});

export const processToken = (
  state: StreamState,
  data: TokenData,
  onToken: StreamCallback,
): StreamState => {
  if (!state.isActive) return state;

  const token = data.token ?? "";
  const newAccumulated = state.accumulated + token;

  onToken(token, newAccumulated);

  return {
    ...state,
    accumulated: newAccumulated,
    tokenCount: state.tokenCount + 1,
  };
};

export const completeStream = (state: StreamState): StreamState => ({
  ...state,
  isActive: false,
});
