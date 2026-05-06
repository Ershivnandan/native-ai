Create a new Expo Router screen based on the following:

Screen name/path: $ARGUMENTS

Follow these rules strictly:

## Placement
- Place in `app/` directory following Expo Router file-based routing conventions
- Dynamic routes: `[param].tsx`
- Grouped routes: `(groupName)/`
- Layout files: `_layout.tsx`

## Structure (in this exact order)
1. Imports (external → internal → types → constants)
2. Route params type (if dynamic route)
3. Screen component (DEFAULT export — required by Expo Router)

## Code Quality
- Wrap content in `SafeAreaView` from `react-native-safe-area-context`
- Add `KeyboardAvoidingView` if the screen has text inputs
- Use NativeWind `className` for all styling with `dark:` variants
- Use `useLocalSearchParams<ParamsType>()` for typed route params
- No `any` types
- No inline comments unless explaining a non-obvious *why*
- No fetch calls to external APIs — this is an offline-first app
- All data comes from Redux store or on-device AI

## Naming
- File: matches route path (lowercase for routes, PascalCase avoided for screen files)
- Params type: `ScreenNameParams`
- Screen component: PascalCase (e.g., `ChatScreen`)

## Template
```tsx
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/store';

interface ChatParams {
  id: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<ChatParams>();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1">
        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
}
```

## Loading/Error States
- Add a loading state if the screen depends on async data (model loading, hydration)
- Add an empty state for screens that display lists
- Handle missing route params gracefully (redirect or show error)

## Verification
After creating, confirm:
- Screen is accessible via navigation
- Renders correctly in both themes
- Route params are properly typed and handled
- No external network calls
- Keyboard doesn't overlap inputs (if applicable)
