import { configureStore } from "@reduxjs/toolkit";
import chatReducer, {
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
  selectAllChats,
  selectActiveChat,
  selectChatsMetadata,
  selectIsGenerating,
} from "@/store/chatSlice";

const createTestStore = () =>
  configureStore({
    reducer: { chat: chatReducer },
  });

type TestStore = ReturnType<typeof createTestStore>;

describe("chatSlice", () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  describe("createChat", () => {
    it("creates a new chat with default title", () => {
      store.dispatch(createChat({}));
      const chats = selectAllChats(store.getState() as never);
      expect(chats).toHaveLength(1);
      expect(chats[0]?.title).toBe("New Chat");
      expect(chats[0]?.messages).toEqual([]);
    });

    it("creates a chat with custom title", () => {
      store.dispatch(createChat({ title: "Test Chat" }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.title).toBe("Test Chat");
    });

    it("creates a chat with provided id", () => {
      store.dispatch(createChat({ id: "custom-id" }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.id).toBe("custom-id");
    });

    it("sets new chat as active", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      const state = store.getState() as never;
      const active = selectActiveChat(state);
      expect(active?.id).toBe("chat-1");
    });

    it("prepends new chats to list", () => {
      store.dispatch(createChat({ id: "first" }));
      store.dispatch(createChat({ id: "second" }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.id).toBe("second");
      expect(chats[1]?.id).toBe("first");
    });
  });

  describe("deleteChat", () => {
    it("removes a chat by id", () => {
      store.dispatch(createChat({ id: "to-delete" }));
      store.dispatch(createChat({ id: "to-keep" }));
      store.dispatch(deleteChat("to-delete"));
      const chats = selectAllChats(store.getState() as never);
      expect(chats).toHaveLength(1);
      expect(chats[0]?.id).toBe("to-keep");
    });

    it("sets next chat as active when active is deleted", () => {
      store.dispatch(createChat({ id: "first" }));
      store.dispatch(createChat({ id: "second" }));
      store.dispatch(setActiveChat("second"));
      store.dispatch(deleteChat("second"));
      const state = store.getState() as never;
      const active = selectActiveChat(state);
      expect(active?.id).toBe("first");
    });

    it("sets activeChatId to null when last chat deleted", () => {
      store.dispatch(createChat({ id: "only" }));
      store.dispatch(deleteChat("only"));
      const state = store.getState();
      expect(state.chat.activeChatId).toBeNull();
    });
  });

  describe("renameChat", () => {
    it("updates chat title", () => {
      store.dispatch(createChat({ id: "chat-1", title: "Old Title" }));
      store.dispatch(renameChat({ chatId: "chat-1", title: "New Title" }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.title).toBe("New Title");
    });

    it("updates updatedAt timestamp", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      const before = selectAllChats(store.getState() as never)[0]?.updatedAt;
      store.dispatch(renameChat({ chatId: "chat-1", title: "Renamed" }));
      const after = selectAllChats(store.getState() as never)[0]?.updatedAt;
      expect(after).toBeGreaterThanOrEqual(before ?? 0);
    });
  });

  describe("addMessage", () => {
    it("adds a message to the correct chat", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "user", content: "Hello" }),
      );
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.messages).toHaveLength(1);
      expect(chats[0]?.messages[0]?.content).toBe("Hello");
      expect(chats[0]?.messages[0]?.role).toBe("user");
    });

    it("auto-titles chat from first user message", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({
          chatId: "chat-1",
          role: "user",
          content: "What is the meaning of life?",
        }),
      );
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.title).toBe("What is the meaning of life?");
    });

    it("does nothing for non-existent chat", () => {
      store.dispatch(
        addMessage({ chatId: "nonexistent", role: "user", content: "Hello" }),
      );
      const chats = selectAllChats(store.getState() as never);
      expect(chats).toHaveLength(0);
    });
  });

  describe("updateLastMessage", () => {
    it("updates the content of the last message", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "assistant", content: "" }),
      );
      store.dispatch(
        updateLastMessage({ chatId: "chat-1", content: "Hello there!" }),
      );
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.messages[0]?.content).toBe("Hello there!");
    });
  });

  describe("appendToLastMessage", () => {
    it("appends token to last assistant message", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "assistant", content: "Hel" }),
      );
      store.dispatch(appendToLastMessage({ chatId: "chat-1", token: "lo" }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.messages[0]?.content).toBe("Hello");
    });

    it("does not append to user messages", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "user", content: "Hi" }),
      );
      store.dispatch(appendToLastMessage({ chatId: "chat-1", token: "!" }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.messages[0]?.content).toBe("Hi");
    });
  });

  describe("deleteMessage", () => {
    it("removes a specific message from chat", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "user", content: "msg1" }),
      );
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "assistant", content: "msg2" }),
      );
      const msgId =
        selectAllChats(store.getState() as never)[0]?.messages[0]?.id ?? "";
      store.dispatch(deleteMessage({ chatId: "chat-1", messageId: msgId }));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.messages).toHaveLength(1);
      expect(chats[0]?.messages[0]?.content).toBe("msg2");
    });
  });

  describe("clearChat", () => {
    it("removes all messages from a chat", () => {
      store.dispatch(createChat({ id: "chat-1" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "user", content: "msg1" }),
      );
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "assistant", content: "msg2" }),
      );
      store.dispatch(clearChat("chat-1"));
      const chats = selectAllChats(store.getState() as never);
      expect(chats[0]?.messages).toHaveLength(0);
    });
  });

  describe("setIsGenerating", () => {
    it("sets generating state", () => {
      store.dispatch(setIsGenerating(true));
      expect(selectIsGenerating(store.getState() as never)).toBe(true);
      store.dispatch(setIsGenerating(false));
      expect(selectIsGenerating(store.getState() as never)).toBe(false);
    });
  });

  describe("selectChatsMetadata", () => {
    it("returns metadata for all chats", () => {
      store.dispatch(createChat({ id: "chat-1", title: "First" }));
      store.dispatch(
        addMessage({ chatId: "chat-1", role: "user", content: "Hello world" }),
      );
      const metadata = selectChatsMetadata(store.getState() as never);
      expect(metadata).toHaveLength(1);
      expect(metadata[0]?.title).toBe("Hello world");
      expect(metadata[0]?.messageCount).toBe(1);
      expect(metadata[0]?.lastMessagePreview).toBe("Hello world");
    });
  });
});
