export type ModelStatus =
  | "idle"
  | "downloading"
  | "loading"
  | "ready"
  | "generating"
  | "error";

export interface ModelConfig {
  id: string;
  name: string;
  fileName: string;
  size: number;
  description: string;
}

export interface GenerationParams {
  temperature: number;
  topP: number;
  maxTokens: number;
  stopSequences: string[];
}
