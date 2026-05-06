Create a new custom React hook based on the following:

Hook name and purpose: $ARGUMENTS

Follow these rules strictly:

## Placement
- Place in `hooks/` directory
- File name matches hook name: `useChat` → `hooks/useChat.ts`

## Structure (in this exact order)
1. Imports
2. Params interface (if hook accepts arguments)
3. Return type interface
4. Hook implementation
5. Named export

## Code Quality
- Explicit return type annotation (define a `UseHookNameReturn` interface)
- Use granular Redux selectors — never select the entire store
- Wrap returned functions in `useCallback`
- Wrap derived/computed values in `useMemo`
- Clean up side effects in `useEffect` return (timers, listeners, subscriptions)
- Handle loading and error states for async operations
- No `any` types — use proper TypeScript
- No inline comments unless explaining a non-obvious *why*
- No external API calls — offline only

## Naming
- Hook: `use` + PascalCase noun (e.g., `useChat`, `useAI`, `useTheme`)
- Return interface: `Use` + HookName + `Return` (e.g., `UseChatReturn`)
- Params interface: `Use` + HookName + `Params` (e.g., `UseChatParams`)
- Internal state: descriptive camelCase
- Returned booleans: `is`/`has`/`should` prefix

## Template
```tsx
import { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectActiveChat } from '@/store/chatSlice';

interface UseChatParams {
  chatId: string;
}

interface UseChatReturn {
  messages: Message[];
  isGenerating: boolean;
  sendMessage: (content: string) => void;
  stopGeneration: () => void;
}

export const useChat = ({ chatId }: UseChatParams): UseChatReturn => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => selectMessagesByChatId(state, chatId));
  const isGenerating = useAppSelector(selectIsGenerating);

  const sendMessage = useCallback((content: string) => {
    // dispatch logic
  }, [dispatch, chatId]);

  const stopGeneration = useCallback(() => {
    // stop logic
  }, [dispatch]);

  return {
    messages,
    isGenerating,
    sendMessage,
    stopGeneration,
  };
};
```

## Verification
After creating, confirm:
- TypeScript has no errors, return type is explicit
- No unnecessary re-renders (test with React DevTools)
- Cleanup functions prevent memory leaks
- Works correctly when component unmounts/remounts
- No external network dependencies
