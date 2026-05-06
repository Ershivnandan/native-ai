Audit all components for NativeWind theming consistency and dark mode coverage.

## 1. Dark Mode Coverage

Search ALL `.tsx` files for color-related classes and verify each has a corresponding `dark:` variant:

- Background colors: `bg-*` must have `dark:bg-*`
- Text colors: `text-*` must have `dark:text-*`
- Border colors: `border-*` must have `dark:border-*`
- Ring/outline colors: `ring-*` must have `dark:ring-*`
- Placeholder colors: `placeholder-*` must have `dark:placeholder-*`
- Divide colors: `divide-*` must have `dark:divide-*`

**Exception**: Classes using semantic theme tokens defined in `tailwind.config.js` that automatically adapt (CSS variable-based colors) do not need explicit `dark:` variants.

## 2. StyleSheet Usage (Should Not Exist)

Search for:
- `StyleSheet.create(` — should be replaced with NativeWind className
- Inline `style={{ }}` with hardcoded colors
- `style={[styles.x, styles.y]}` patterns

**Exception**: Styles that genuinely cannot be expressed in Tailwind (e.g., animated transforms, complex shadow configs on Android).

## 3. Color Token Consistency

- Find hardcoded hex (`#xxx`), rgb (`rgb()`), or rgba values NOT defined in `tailwind.config.js` or `constants/theme.ts`
- Flag inconsistent usage (e.g., `gray-700` in one place, `gray-800` for same semantic purpose)
- Verify all colors trace back to the defined color token system

## 4. Spacing & Typography

- Flag inconsistent padding/margin for same-purpose elements (e.g., card padding varies between `p-3`, `p-4`, `px-3 py-2`)
- Verify font sizes follow the project's type scale
- Check border-radius consistency for similar elements (buttons all same radius, cards all same radius)

## 5. Interactive States

- Verify all `Pressable`/`TouchableOpacity` elements have visual feedback:
  - Active/pressed state (`active:` or opacity change)
  - Disabled state styling when `disabled` prop exists
- Check focus states for accessibility
- Verify buttons have consistent sizing (min 48x48 touch target)

## Report Format

For each issue:
```
[HIGH/MEDIUM/LOW] file/path.tsx:lineNumber
  Current: className="bg-white text-black"
  Should be: className="bg-white dark:bg-gray-900 text-black dark:text-white"
  Category: Missing dark mode / Hardcoded color / Inconsistent spacing
```

## Summary

End with:
- **Dark mode coverage**: X% of color classes have dark variants
- **StyleSheet violations**: N files still using StyleSheet
- **Hardcoded colors**: N instances of non-token colors
- **Top priority fixes**: List the 5 most visible/impactful issues
