import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { ThemeMode } from "@/types/settings";

interface SettingsState {
  theme: ThemeMode;
  modelId: string | null;
  maxContextLength: number;
  streamingEnabled: boolean;
}

const initialState: SettingsState = {
  theme: "system",
  modelId: null,
  maxContextLength: 2048,
  streamingEnabled: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setModelId(state, action: PayloadAction<string | null>) {
      state.modelId = action.payload;
    },
    setMaxContextLength(state, action: PayloadAction<number>) {
      state.maxContextLength = action.payload;
    },
    setStreamingEnabled(state, action: PayloadAction<boolean>) {
      state.streamingEnabled = action.payload;
    },
  },
});

export const { setTheme, setModelId, setMaxContextLength, setStreamingEnabled } =
  settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;
export const selectModelId = (state: RootState) => state.settings.modelId;
export const selectMaxContextLength = (state: RootState) =>
  state.settings.maxContextLength;
export const selectStreamingEnabled = (state: RootState) =>
  state.settings.streamingEnabled;

export default settingsSlice.reducer;
