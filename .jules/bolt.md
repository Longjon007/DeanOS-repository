
## 2024-05-24 - Over-fetching in Mobile App
**Learning:** The mobile app was selecting all columns from `todos` but only displaying `title`. This is a common anti-pattern that wastes bandwidth and memory.
**Action:** Always verify `select()` calls match the consumed data, especially in mobile/constrained environments.
