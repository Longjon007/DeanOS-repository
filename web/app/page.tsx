import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase
    .from('todos')
    .select('id, title')
    .limit(100)

  const todoItems = todos?.map((todo) => <li key={todo.id}>{todo.title ?? 'Untitled'}</li>)

  return (
    <ul>{todoItems}</ul>
  )
}
