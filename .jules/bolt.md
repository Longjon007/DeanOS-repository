## 2024-05-24 - FlatList Performance Anti-Pattern
**Learning:** `FlatList` in React Native requires stable references for `renderItem` and `keyExtractor` to avoid re-rendering all items on every parent update. Inline functions defeat this optimization.
**Action:** Always use `useCallback` or static functions defined outside the component for `FlatList` props like `renderItem` and `keyExtractor`.
