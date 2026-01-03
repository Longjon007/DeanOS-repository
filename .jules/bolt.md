# Bolt's Journal

## 2024-05-27 - Mobile Performance Optimization & Environment Constraints
**Learning:** The `app/` directory (React Native) lacks `lint` and `test` scripts and standard dev dependencies (like Jest or ESLint) in `package.json`. This makes automated verification of changes impossible without modifying the environment, which is restricted.
**Action:** When working on `app/`, rely on careful manual code inspection and adhere strictly to known React Native best practices. For `FlatList`, hoisting `renderItem` is a safe, high-value optimization that doesn't require complex runtime verification to prove correctness.

## 2024-05-27 - FlatList Optimization Pattern
**Learning:** Inline functions for `renderItem` and `keyExtractor` in `FlatList` cause unnecessary re-renders or allocations. Hoisting them is a standard optimization.
**Action:** Apply this pattern by moving functions outside the component or using `useCallback`. Hoisting is preferred if they don't depend on closure scope.
