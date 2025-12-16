BEGIN;
SELECT plan(1);

SELECT has_table('todos');

SELECT * FROM finish();
ROLLBACK;
