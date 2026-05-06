Generate or update TypeScript type definitions for the following domain:

Domain/area: $ARGUMENTS

Follow these rules strictly:

## Placement
- Place in `types/` directory in the appropriate domain file
- `types/chat.ts` — Chat, Message, ChatMetadata
- `types/ai.ts` — ModelConfig, ModelStatus, GenerationParams
- `types/settings.ts` — AppSettings, ThemeMode
- Create a new file if the domain doesn't fit existing ones

## Conventions

### Interfaces over Type Aliases
- Use `interface` for object shapes (extensible, better error messages)
- Use `type` only for unions, intersections, or mapped types

### Field Types
| Field Kind | Type | Example |
|-----------|------|---------|
| IDs | `string` (nanoid format) | `id: string` |
| Timestamps | `number` (Unix ms) | `createdAt: number` |
| Enums | String literal unions | `role: 'user' \| 'assistant' \| 'system'` |
| Optional | `?` modifier (truly optional only) | `title?: string` |
| Nullable | Explicit union | `error: string \| null` |

### Naming
- Interfaces: PascalCase noun (`Message`, `ChatMetadata`)
- Type aliases: PascalCase (`MessageRole`, `ThemeMode`)
- No `I` prefix on interfaces
- No `T` prefix on types
- Suffix with purpose when ambiguous (`ModelConfigCreate` vs `ModelConfig`)

### Documentation
- Add JSDoc on the interface itself (one line, what it represents)
- Add JSDoc on non-obvious properties only
- Do NOT document self-explanatory fields (`id`, `name`, `createdAt`)

### Utility Types
Create reusable utility types for repeated patterns:
```tsx
interface WithId {
  id: string;
}

interface WithTimestamps {
  createdAt: number;
  updatedAt: number;
}

type WithOptionalId<T> = Omit<T, 'id'> & { id?: string };
```

## Template
```tsx
/** A single message in a chat conversation */
interface Message {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  /** Tokens used by this message (for context window tracking) */
  tokenCount?: number;
}

type MessageRole = 'user' | 'assistant' | 'system';

/** Metadata for a chat shown in the sidebar list */
interface ChatMetadata {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  /** First line of the last message for preview */
  lastMessagePreview: string;
}
```

## Rules
- No `any` — use `unknown` and narrow if type is truly unknown
- No external API response types — all data originates locally (user input or on-device AI)
- Export all types as named exports
- Group related types in the same file
- Keep types minimal — don't add fields "just in case"

## Verification
After generating, confirm:
- All types are properly exported
- No circular imports between type files
- Types align with Redux slice state shapes
- No `any` anywhere
- Types are used consistently across components, hooks, and stores
