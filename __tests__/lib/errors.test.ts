import { classifyError, getErrorMessage } from "@/lib/ai/errors";

describe("AI errors", () => {
  describe("classifyError", () => {
    it("classifies out of memory errors", () => {
      const error = new Error("Out of memory when allocating tensor");
      const result = classifyError(error);
      expect(result.type).toBe("out_of_memory");
      expect(result.recoverable).toBe(true);
    });

    it("classifies model load failures", () => {
      const error = new Error("Failed to load model from path");
      const result = classifyError(error);
      expect(result.type).toBe("model_load_failed");
      expect(result.recoverable).toBe(true);
    });

    it("classifies model not loaded", () => {
      const error = new Error("Model not loaded");
      const result = classifyError(error);
      expect(result.type).toBe("model_not_loaded");
      expect(result.recoverable).toBe(true);
    });

    it("classifies context overflow", () => {
      const error = new Error("Context window overflow detected");
      const result = classifyError(error);
      expect(result.type).toBe("context_overflow");
      expect(result.recoverable).toBe(true);
    });

    it("classifies unknown errors", () => {
      const error = new Error("Something completely unexpected");
      const result = classifyError(error);
      expect(result.type).toBe("unknown");
      expect(result.recoverable).toBe(false);
    });
  });

  describe("getErrorMessage", () => {
    it("returns user-friendly suggestion", () => {
      const error = new Error("Out of memory");
      const message = getErrorMessage(error);
      expect(message).toContain("reducing context");
    });

    it("returns generic message for unknown errors", () => {
      const error = new Error("xyz");
      const message = getErrorMessage(error);
      expect(message).toContain("unexpected error");
    });
  });
});
