import type { RNLlamaOAICompatibleMessage } from "llama.rn";
import type { Message } from "@/types/chat";
import { SYSTEM_PROMPT } from "@/constants/ai";

export const formatMessagesForLlama = (
  messages: Message[],
  systemPrompt?: string,
): RNLlamaOAICompatibleMessage[] => {
  const formatted: RNLlamaOAICompatibleMessage[] = [
    {
      role: "system",
      content: systemPrompt ?? SYSTEM_PROMPT,
    },
  ];

  for (const msg of messages) {
    formatted.push({
      role: msg.role,
      content: msg.content,
    });
  }

  return formatted;
};

export const estimateTokenCount = (text: string): number => {
  return Math.ceil(text.length / 4);
};

export const truncateContext = (
  messages: Message[],
  maxTokens: number,
): Message[] => {
  let totalTokens = 0;
  const result: Message[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!msg) break;
    const tokens = msg.tokenCount ?? estimateTokenCount(msg.content);
    if (totalTokens + tokens > maxTokens && result.length > 0) {
      break;
    }
    totalTokens += tokens;
    result.unshift(msg);
  }

  return result;
};
