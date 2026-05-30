import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Chat, Message, ChatMetadata } from "@/types/chat";
import { generateId } from "@/lib/utils/id";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isGenerating: boolean;
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  isGenerating: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChat(
      state,
      action: PayloadAction<{ id?: string; title?: string }>,
    ) {
      const now = Date.now();
      const newChat: Chat = {
        id: action.payload.id ?? generateId(),
        title: action.payload.title ?? "New Chat",
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      state.chats.unshift(newChat);
      state.activeChatId = newChat.id;
    },

    deleteChat(state, action: PayloadAction<string>) {
      state.chats = state.chats.filter((c) => c.id !== action.payload);
      if (state.activeChatId === action.payload) {
        state.activeChatId = state.chats[0]?.id ?? null;
      }
    },

    renameChat(
      state,
      action: PayloadAction<{ chatId: string; title: string }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.title = action.payload.title;
        chat.updatedAt = Date.now();
      }
    },

    setActiveChat(state, action: PayloadAction<string | null>) {
      state.activeChatId = action.payload;
    },

    addMessage(
      state,
      action: PayloadAction<{
        chatId: string;
        role: Message["role"];
        content: string;
      }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (!chat) return;

      const message: Message = {
        id: generateId(),
        chatId: action.payload.chatId,
        role: action.payload.role,
        content: action.payload.content,
        createdAt: Date.now(),
      };

      chat.messages.push(message);
      chat.updatedAt = Date.now();

      if (chat.messages.length === 1 && action.payload.role === "user") {
        chat.title = action.payload.content.slice(0, 40);
      }
    },

    updateLastMessage(
      state,
      action: PayloadAction<{ chatId: string; content: string }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (!chat || chat.messages.length === 0) return;

      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage) {
        lastMessage.content = action.payload.content;
      }
    },

    appendToLastMessage(
      state,
      action: PayloadAction<{ chatId: string; token: string }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (!chat || chat.messages.length === 0) return;

      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.content += action.payload.token;
      }
    },

    deleteMessage(
      state,
      action: PayloadAction<{ chatId: string; messageId: string }>,
    ) {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (!chat) return;

      chat.messages = chat.messages.filter(
        (m) => m.id !== action.payload.messageId,
      );
      chat.updatedAt = Date.now();
    },

    setIsGenerating(state, action: PayloadAction<boolean>) {
      state.isGenerating = action.payload;
    },

    clearChat(state, action: PayloadAction<string>) {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.messages = [];
        chat.updatedAt = Date.now();
      }
    },
  },
});

export const {
  createChat,
  deleteChat,
  renameChat,
  setActiveChat,
  addMessage,
  updateLastMessage,
  appendToLastMessage,
  deleteMessage,
  setIsGenerating,
  clearChat,
} = chatSlice.actions;

const EMPTY_MESSAGES: readonly Message[] = Object.freeze([]);

export const selectAllChats = (state: RootState) => state.chat.chats;
export const selectActiveChatId = (state: RootState) => state.chat.activeChatId;
export const selectIsGenerating = (state: RootState) => state.chat.isGenerating;

export const selectActiveChat = createSelector(
  [selectAllChats, selectActiveChatId],
  (chats, activeChatId) => chats.find((c) => c.id === activeChatId) ?? null,
);

export const selectChatById = createSelector(
  [selectAllChats, (_state: RootState, chatId: string | null) => chatId],
  (chats, chatId) => (chatId ? chats.find((c) => c.id === chatId) ?? null : null),
);

export const selectMessagesByChatId = createSelector(
  [selectAllChats, (_state: RootState, chatId: string | null) => chatId],
  (chats, chatId) =>
    (chatId ? chats.find((c) => c.id === chatId)?.messages : undefined) ??
    (EMPTY_MESSAGES as Message[]),
);

export const selectChatsMetadata = createSelector(
  [selectAllChats],
  (chats): ChatMetadata[] =>
    chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: chat.messages.length,
        lastMessagePreview: lastMessage?.content.slice(0, 50) ?? "",
      };
    }),
);

export default chatSlice.reducer;
