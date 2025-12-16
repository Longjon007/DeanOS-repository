# Bolt's Journal - Critical Learnings

## 2024-05-24 - React Native FlatList Optimization
**Learning:** Inline functions in `FlatList` `renderItem` can cause performance issues by breaking referential equality.
**Action:** Always wrap `renderItem` in `useCallback` or define it outside the component.
