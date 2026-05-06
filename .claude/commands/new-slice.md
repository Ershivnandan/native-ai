Create a new Redux Toolkit slice based on the following:

Slice name and purpose: $ARGUMENTS

Follow these rules strictly:

## Placement
- Place in `store/` directory
- File name: camelCase with `Slice` suffix (e.g., `chatSlice.ts`)

## Structure (in this exact order)
1. Imports
2. State interface
3. Initial state constant
4. Async thunks (if needed)
5. Slice definition with `createSlice`
6. Exported actions
7. Exported selectors (memoized with `createSelector` for derived state)
8. Default export of reducer

## Code Quality
- Typed state interface — no `any`
- `initialState` as a typed constant (useful for testing/reset)
- Reducers use Immer (RTK default) — mutate state directly in reducers
- Async operations use `createAsyncThunk` with proper typing
- Selectors: simple selectors for direct state access, `createSelector` for computed/derived state
- No inline comments unless explaining a non-obvious *why*
- No external API calls in thunks — offline only (local storage, on-device AI)

## Naming
- Slice name: camelCase noun (e.g., `chat`, `settings`, `ai`)
- State interface: `PascalCase` + `State` (e.g., `ChatState`)
- Actions: camelCase verb + noun (e.g., `addMessage`, `deleteChat`)
- Selectors: `select` + what (e.g., `selectActiveChat`, `selectAllMessages`)
- Thunks: camelCase verb + noun (e.g., `loadChatHistory`, `generateResponse`)
- Boolean state: `is`/`has` prefix (e.g., `isGenerating`, `hasHydrated`)

## Persistence
- Use `redux-persist` with MMKV storage adapter
- Configure in `store/index.ts` persistConfig
- Use `blacklist` to exclude transient state (isGenerating, error, etc.) from persistence
- Only persist data that needs to survive app restart

## Template
```tsx
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

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
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
      }
    },
    setActiveChat(state, action: PayloadAction<string | null>) {
      state.activeChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // handle async thunks here
  },
});

export const { addMessage, setActiveChat } = chatSlice.actions;

export const selectActiveChat = (state: RootState) => 
  state.chat.chats.find(c => c.id === state.chat.activeChatId);

export const selectMessagesByChatId = createSelector(
  [(state: RootState) => state.chat.chats, (_state: RootState, chatId: string) => chatId],
  (chats, chatId) => chats.find(c => c.id === chatId)?.messages ?? []
);

export default chatSlice.reducer;
```

## Verification
After creating, confirm:
- TypeScript has no errors
- Initial state is properly typed
- Reducers handle all edge cases (missing chat, duplicate IDs, etc.)
- Selectors are memoized where computing derived state
- Persistence config excludes transient state
- No external network calls in thunks
