## 2024-05-23 - Over-fetching in React Native Lists
**Learning:** React Native lists often only display a subset of data (e.g., title), but queries often fetch `*`. Explicitly selecting fields (`.select('id, title')`) significantly reduces payload size for mobile clients on potentially slow networks.
**Action:** Always audit `supabase.from().select()` calls in mobile views to ensure only rendered fields are fetched.
