Create a new React Native component based on the following:

Component name: $ARGUMENTS

Follow these rules strictly:

## Placement
- Chat-related → `components/chat/`
- Generic UI elements (buttons, inputs, cards) → `components/ui/`
- Shared/common (layouts, providers) → `components/common/`

## Structure (in this exact order)
1. Imports (external → internal → types → constants)
2. Props interface (PascalCase, suffixed with `Props`)
3. Component function wrapped in `memo()` if it receives props that may change
4. Named export (NO default export)

## Code Quality
- Use NativeWind `className` for ALL styling — never `StyleSheet.create()`
- Include `dark:` variants for every color class
- Destructure props in the function signature
- No `any` types — use proper TypeScript interfaces
- No inline comments unless explaining a non-obvious *why*
- Add `accessibilityLabel` on all interactive elements (Pressable, TouchableOpacity)
- Keep under 150 lines — extract sub-components if needed
- No magic strings — use constants from `@/constants/`

## Naming
- File: PascalCase matching component name (e.g., `ChatBubble.tsx`)
- Props interface: `ComponentNameProps`
- Event handlers: `handle` + event (e.g., `handlePress`)
- Callback props: `on` + event (e.g., `onPress`)
- Booleans: `is`/`has`/`should` prefix

## Template
```tsx
import { View, Text, Pressable } from 'react-native';
import { memo } from 'react';

interface ComponentNameProps {
  // typed props here
}

export const ComponentName = memo(({ ...props }: ComponentNameProps) => {
  // hooks first
  // derived state
  // handlers (wrapped in useCallback if passed to children)
  // render
  return (
    <View className="... dark:...">
    </View>
  );
});
```

## Verification
After creating, confirm:
- TypeScript has no errors
- Component renders correctly in both light and dark mode
- No StyleSheet usage
- Follows the import order convention
