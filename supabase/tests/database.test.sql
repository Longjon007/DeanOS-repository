BEGIN;
SELECT plan(3);

-- Check if the table exists
SELECT has_table('todos');

-- Check columns
SELECT has_column('todos', 'id');
SELECT has_column('todos', 'title');

SELECT * FROM finish();
ROLLBACK;
