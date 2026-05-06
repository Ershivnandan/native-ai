import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  setTheme,
  setModelId,
  setMaxContextLength,
  setStreamingEnabled,
  selectTheme,
  selectModelId,
  selectMaxContextLength,
  selectStreamingEnabled,
} from "@/store/settingsSlice";

const createTestStore = () =>
  configureStore({
    reducer: { settings: settingsReducer },
  });

type TestStore = ReturnType<typeof createTestStore>;

describe("settingsSlice", () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  describe("initial state", () => {
    it("has correct defaults", () => {
      const state = store.getState() as never;
      expect(selectTheme(state)).toBe("system");
      expect(selectModelId(state)).toBeNull();
      expect(selectMaxContextLength(state)).toBe(2048);
      expect(selectStreamingEnabled(state)).toBe(true);
    });
  });

  describe("setTheme", () => {
    it("sets theme to light", () => {
      store.dispatch(setTheme("light"));
      expect(selectTheme(store.getState() as never)).toBe("light");
    });

    it("sets theme to dark", () => {
      store.dispatch(setTheme("dark"));
      expect(selectTheme(store.getState() as never)).toBe("dark");
    });

    it("sets theme to system", () => {
      store.dispatch(setTheme("dark"));
      store.dispatch(setTheme("system"));
      expect(selectTheme(store.getState() as never)).toBe("system");
    });
  });

  describe("setModelId", () => {
    it("sets model id", () => {
      store.dispatch(setModelId("phi-3-mini"));
      expect(selectModelId(store.getState() as never)).toBe("phi-3-mini");
    });

    it("sets model id to null", () => {
      store.dispatch(setModelId("some-model"));
      store.dispatch(setModelId(null));
      expect(selectModelId(store.getState() as never)).toBeNull();
    });
  });

  describe("setMaxContextLength", () => {
    it("updates context length", () => {
      store.dispatch(setMaxContextLength(4096));
      expect(selectMaxContextLength(store.getState() as never)).toBe(4096);
    });
  });

  describe("setStreamingEnabled", () => {
    it("toggles streaming", () => {
      store.dispatch(setStreamingEnabled(false));
      expect(selectStreamingEnabled(store.getState() as never)).toBe(false);
      store.dispatch(setStreamingEnabled(true));
      expect(selectStreamingEnabled(store.getState() as never)).toBe(true);
    });
  });
});
