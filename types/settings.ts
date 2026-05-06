export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeMode;
  modelId: string | null;
  maxContextLength: number;
  streamingEnabled: boolean;
}
