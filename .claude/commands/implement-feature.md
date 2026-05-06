Implement the following feature end-to-end across all layers:

Feature: $ARGUMENTS

Follow this implementation order — each layer builds on the previous:

## 1. Types (`types/`)
- Define or update interfaces for the feature's data
- Ensure type safety will flow through all subsequent layers
- Follow conventions: interfaces for objects, string literal unions for enums, explicit optionals

## 2. Storage (`lib/storage/`)
- Add any new MMKV storage keys or serialization logic
- Update storage schemas if the feature persists new data
- Handle migration if modifying existing persisted structures

## 3. Redux Slice (`store/`)
- Add new state properties to the appropriate slice
- Create reducers for all state transitions
- Add async thunks if the feature has async operations (local only — no network)
- Create memoized selectors for derived state
- Update `persistConfig` if new state should survive restart
- Blacklist transient state (loading flags, errors)

## 4. Hook (`hooks/`)
- Create or update the hook that exposes feature logic to components
- Wrap Redux dispatches with business logic and validation
- Include loading/error states
- Memoize returned functions with `useCallback`
- Memoize derived data with `useMemo`
- Add cleanup in useEffect return if needed

## 5. Components (`components/`)
- Create or update UI components for the feature
- Follow project conventions:
  - NativeWind `className` only (no StyleSheet)
  - `dark:` variants on all color classes
  - `React.memo()` on components that receive changing props
  - `accessibilityLabel` on interactive elements
  - Max 150 lines per file — extract sub-components
  - Props interface with descriptive types
  - Named exports (no default)

## 6. Screen Integration (`app/`)
- Wire components into the appropriate screen
- Handle navigation if needed (new routes, params)
- Add loading/error/empty states
- Ensure keyboard handling if inputs are involved

## Code Quality Checklist
Apply at every layer:
- [ ] No `any` types
- [ ] No inline comments (unless non-obvious *why*)
- [ ] No magic numbers/strings — use constants
- [ ] No default exports (except screens)
- [ ] Consistent naming (see conventions in CLAUDE.md workflow)
- [ ] No unused imports or variables
- [ ] Explicit return types on hooks and utilities

## Verification
After implementation, verify ALL of these:
1. `npx tsc --noEmit` — no TypeScript errors
2. Component renders in both light and dark mode
3. State persists correctly across app restart (if applicable)
4. No external network calls introduced (`/project:check-offline`)
5. No unnecessary re-renders (check with React DevTools or `/project:debug-render`)
6. Interactive elements have accessibility labels
7. Feature works in airplane mode
8. Edge cases handled (empty input, rapid actions, missing data)
