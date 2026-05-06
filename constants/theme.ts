export const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  background: {
    light: "#f8fafc",
    dark: "#0f0f1a",
  },
  surface: {
    light: "#ffffff",
    dark: "#1a1a2e",
  },
  text: {
    light: "#1e293b",
    dark: "#f1f5f9",
  },
  textSecondary: {
    light: "#64748b",
    dark: "#94a3b8",
  },
  border: {
    light: "#e2e8f0",
    dark: "#334155",
  },
  chat: {
    user: "#3b82f6",
    assistant: {
      light: "#f1f5f9",
      dark: "#1e293b",
    },
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
} as const;
