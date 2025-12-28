## 2024-05-24 - [React Native FlatList Optimization]
**Learning:** `FlatList` performance relies heavily on stable references for `renderItem` and `keyExtractor`. Defining these inline causes function re-creation on every render, which can degrade performance in long lists.
**Action:** Always hoist `renderItem` and `keyExtractor` outside the component or use `useCallback` to maintain referential equality.
