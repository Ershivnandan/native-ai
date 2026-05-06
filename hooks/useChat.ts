import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { generateId } from "@/lib/utils/id";
import {
  createChat,
  deleteChat,
  renameChat,
  setActiveChat,
  addMessage,
  setIsGenerating,
  clearChat,
  selectActiveChat,
  selectActiveChatId,
  selectChatById,
  selectMessagesByChatId,
  selectChatsMetadata,
  selectIsGenerating,
} from "@/store/chatSlice";
import { selectMaxContextLength } from "@/store/settingsSlice";
import type { Message } from "@/types/chat";

interface UseChatParams {
  chatId?: string;
}

interface UseChatReturn {
  chat: ReturnType<typeof selectActiveChat>;
  chatId: string | null;
  messages: Message[];
  contextMessages: Message[];
  chatsMetadata: ReturnType<typeof selectChatsMetadata>;
  isGenerating: boolean;
  sendMessage: (content: string) => string;
  createNewChat: (title?: string) => void;
  removeChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  switchToChat: (chatId: string) => void;
  clearMessages: () => void;
  startGenerating: () => void;
  stopGenerating: () => void;
}

export const useChat = (params?: UseChatParams): UseChatReturn => {
  const dispatch = useAppDispatch();
  const activeChatId = useAppSelector(selectActiveChatId);
  const maxContextLength = useAppSelector(selectMaxContextLength);
  const isGenerating = useAppSelector(selectIsGenerating);
  const chatsMetadata = useAppSelector(selectChatsMetadata);

  const targetChatId = params?.chatId ?? activeChatId;

  const chat = useAppSelector((state) =>
    targetChatId ? selectChatById(state, targetChatId) : selectActiveChat(state),
  );

  const messages = useAppSelector((state) =>
    targetChatId ? selectMessagesByChatId(state, targetChatId) : [],
  );

  const contextMessages = useMemo(() => {
    if (messages.length === 0) return [];
    let tokenEstimate = 0;
    const result: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (!msg) break;
      const msgTokens = msg.tokenCount ?? Math.ceil(msg.content.length / 4);
      if (tokenEstimate + msgTokens > maxContextLength && result.length > 0) {
        break;
      }
      tokenEstimate += msgTokens;
      result.unshift(msg);
    }

    return result;
  }, [messages, maxContextLength]);

  const sendMessage = useCallback(
    (content: string): string => {
      let chatId = targetChatId;

      if (!chatId) {
        chatId = generateId();
        dispatch(createChat({ id: chatId }));
      }

      dispatch(addMessage({ chatId, role: "user", content }));
      return chatId;
    },
    [dispatch, targetChatId],
  );

  const createNewChat = useCallback(
    (title?: string) => {
      dispatch(createChat({ title }));
    },
    [dispatch],
  );

  const removeChat = useCallback(
    (id: string) => {
      dispatch(deleteChat(id));
    },
    [dispatch],
  );

  const updateChatTitle = useCallback(
    (id: string, title: string) => {
      dispatch(renameChat({ chatId: id, title }));
    },
    [dispatch],
  );

  const switchToChat = useCallback(
    (id: string) => {
      dispatch(setActiveChat(id));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    if (targetChatId) {
      dispatch(clearChat(targetChatId));
    }
  }, [dispatch, targetChatId]);

  const startGenerating = useCallback(() => {
    dispatch(setIsGenerating(true));
  }, [dispatch]);

  const stopGenerating = useCallback(() => {
    dispatch(setIsGenerating(false));
  }, [dispatch]);

  return {
    chat,
    chatId: targetChatId,
    messages,
    contextMessages,
    chatsMetadata,
    isGenerating,
    sendMessage,
    createNewChat,
    removeChat,
    updateChatTitle,
    switchToChat,
    clearMessages,
    startGenerating,
    stopGenerating,
  };
};
