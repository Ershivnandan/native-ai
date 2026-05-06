Perform a performance audit of this React Native codebase targeting mid-range Android devices (4GB RAM, Snapdragon 600-series equivalent).

## 1. Rendering Performance

Check for:
- Components receiving changing props but missing `React.memo()`
- Inline function definitions in JSX props (`onPress={() => ...}` instead of `useCallback`)
- Inline object/array literals in props (creates new reference each render)
- Missing `useCallback`/`useMemo` for expensive computations or functions passed to children
- Large component trees (150+ lines) that should be split
- Components importing and re-exporting too much

## 2. FlatList / List Optimization

Check for:
- Missing `keyExtractor` prop
- Missing `getItemLayout` (if item heights are deterministic)
- Poorly configured or missing: `windowSize`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod`, `initialNumToRender`
- Missing `removeClippedSubviews={true}` for long lists
- Heavy `renderItem` without memoized item components
- Not using inverted FlatList for chat (renders from bottom)
- Missing `onEndReachedThreshold` for lazy loading

## 3. State Management

Check for:
- Redux `useAppSelector` selecting large objects when only a property is needed
- State updates that trigger cascading re-renders across unrelated components
- Derived state stored in Redux that could be computed with `createSelector`
- Unnecessary state (could be derived from existing state)
- Components subscribing to state they don't render

## 4. Memory Issues

Check for:
- Images not resized or lacking caching configuration
- Event listeners added in `useEffect` without cleanup in return
- `setInterval`/`setTimeout` not cleared on unmount
- Large arrays growing unbounded in state (chat history without windowing)
- Closures capturing stale large objects

## 5. AI/Model Specific

Check for:
- Conversation context growing without a maximum token limit
- Message history not being windowed (sending all messages to LLM)
- Streaming tokens updating state on every single token (should batch UI updates)
- Model not being unloaded when switching chats or backgrounding
- No memory pressure handling (should reduce context or warn user)

## 6. Bundle & Startup

Check for:
- Large imports that could be tree-shaken (`import { x } from 'lib'` vs `import x from 'lib/x'`)
- Assets that could be compressed (images, fonts)
- Unnecessary dependencies that add to bundle size
- Heavy initialization on app startup (should defer non-critical work)
- Synchronous storage reads blocking the UI thread

## Report Format

For each issue found:
```
[HIGH/MEDIUM/LOW] file/path.ts:lineNumber
  Problem: Clear description of the performance issue
  Impact: What the user experiences (jank, slow scroll, memory growth, etc.)
  Fix: Specific code change to resolve it
```

## Summary
End with an overall score:
- **GOOD**: Minor issues only, app should perform well on target devices
- **NEEDS WORK**: Several medium issues that will cause noticeable jank
- **CRITICAL**: Major issues that will make the app unusable on mid-range devices

Also provide the top 3 highest-impact fixes to prioritize.
