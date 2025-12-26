# Bolt's Journal

## 2024-05-24 - [Mobile FlatList Optimization]
**Learning:** React Native's `FlatList` `renderItem` and `keyExtractor` props should be stable references to prevent unnecessary re-renders and logic execution on every parent render. Inline arrow functions defeat this optimization.
**Action:** Always hoist `renderItem` and `keyExtractor` outside the component or use `useCallback` if they depend on props/state.
