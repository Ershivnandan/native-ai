import {
  formatMessagesForLlama,
  estimateTokenCount,
  truncateContext,
} from "@/lib/ai/prompts";
import type { Message } from "@/types/chat";

const createMessage = (
  content: string,
  role: Message["role"] = "user",
): Message => ({
  id: `msg-${Math.random()}`,
  chatId: "chat-1",
  role,
  content,
  createdAt: Date.now(),
});

describe("prompts", () => {
  describe("formatMessagesForLlama", () => {
    it("prepends system message", () => {
      const messages = [createMessage("Hello")];
      const formatted = formatMessagesForLlama(messages);
      expect(formatted[0]?.role).toBe("system");
      expect(formatted[0]?.content).toBeDefined();
    });

    it("preserves message order", () => {
      const messages = [
        createMessage("First", "user"),
        createMessage("Second", "assistant"),
        createMessage("Third", "user"),
      ];
      const formatted = formatMessagesForLlama(messages);
      expect(formatted[1]?.content).toBe("First");
      expect(formatted[2]?.content).toBe("Second");
      expect(formatted[3]?.content).toBe("Third");
    });

    it("uses custom system prompt when provided", () => {
      const messages = [createMessage("Hi")];
      const formatted = formatMessagesForLlama(messages, "Be helpful");
      expect(formatted[0]?.content).toBe("Be helpful");
    });

    it("maps roles correctly", () => {
      const messages = [
        createMessage("Q", "user"),
        createMessage("A", "assistant"),
      ];
      const formatted = formatMessagesForLlama(messages);
      expect(formatted[1]?.role).toBe("user");
      expect(formatted[2]?.role).toBe("assistant");
    });
  });

  describe("estimateTokenCount", () => {
    it("estimates ~4 chars per token", () => {
      expect(estimateTokenCount("hello world")).toBe(3);
    });

    it("handles empty string", () => {
      expect(estimateTokenCount("")).toBe(0);
    });

    it("rounds up", () => {
      expect(estimateTokenCount("hi")).toBe(1);
    });
  });

  describe("truncateContext", () => {
    it("returns all messages when within limit", () => {
      const messages = [
        createMessage("Short message"),
        createMessage("Another short one"),
      ];
      const result = truncateContext(messages, 1000);
      expect(result).toHaveLength(2);
    });

    it("truncates from the beginning when over limit", () => {
      const messages = [
        createMessage("A".repeat(100)),
        createMessage("B".repeat(100)),
        createMessage("C".repeat(100)),
      ];
      const result = truncateContext(messages, 60);
      expect(result.length).toBeLessThan(messages.length);
      expect(result[result.length - 1]?.content).toBe("C".repeat(100));
    });

    it("always includes at least one message", () => {
      const messages = [createMessage("A".repeat(1000))];
      const result = truncateContext(messages, 10);
      expect(result).toHaveLength(1);
    });

    it("handles empty array", () => {
      const result = truncateContext([], 1000);
      expect(result).toHaveLength(0);
    });

    it("respects tokenCount field if present", () => {
      const messages: Message[] = [
        { ...createMessage("msg1"), tokenCount: 500 },
        { ...createMessage("msg2"), tokenCount: 500 },
        { ...createMessage("msg3"), tokenCount: 500 },
      ];
      const result = truncateContext(messages, 1000);
      expect(result).toHaveLength(2);
    });
  });
});
