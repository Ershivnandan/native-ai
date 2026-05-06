Add render debugging instrumentation to the following component and analyze its render behavior:

Component: $ARGUMENTS

## Step 1: Add Debug Instrumentation

Add `__DEV__`-only render tracking code to the component:

```tsx
if (__DEV__) {
  const renderCount = useRef(0);
  const prevProps = useRef(props);

  useEffect(() => {
    renderCount.current += 1;
    const changedProps = Object.entries(props).filter(
      ([key, val]) => prevProps.current[key as keyof typeof props] !== val
    );
    if (changedProps.length > 0) {
      console.log(
        `[${ComponentName}] render #${renderCount.current}, changed props:`,
        changedProps.map(([k]) => k)
      );
    } else {
      console.log(
        `[${ComponentName}] render #${renderCount.current}, no prop changes (parent re-rendered)`
      );
    }
    prevProps.current = props;
  });
}
```

## Step 2: Analyze and Recommend

After adding instrumentation, analyze the component for render optimization opportunities:

### Check React.memo
- Is the component wrapped in `memo()`? Should it be?
- If it has a custom comparison function, is it correct?
- Would `memo()` actually help here (does the parent re-render frequently)?

### Check useCallback / useMemo
- Are functions defined inside the component that get passed as props to children?
- Are there expensive computations that could be memoized?
- Are there array/object literals in JSX that create new references?

### Check Redux Selectors
- Is `useAppSelector` selecting more state than needed?
- Could the selector be more granular to prevent re-renders?
- Should `createSelector` be used for derived state?

### Check Children
- Are child components properly memoized?
- Is the component passing unstable references to children?

## Step 3: Report

Provide:
1. **Current render triggers**: What causes this component to re-render
2. **Unnecessary renders**: Which re-renders could be prevented
3. **Recommended fixes**: Specific code changes with before/after
4. **Expected improvement**: How many re-renders the fixes would eliminate

## Important
- ALL debug code MUST be inside `if (__DEV__)` blocks
- Debug code is stripped from production builds automatically
- Do not leave `console.log` without `__DEV__` guard
- Remove instrumentation after debugging is complete (or keep gated behind `__DEV__`)
