import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

type RawTodo = {
  id: string | number
  title?: string
  task?: string
  name?: string
  description?: string
}

type Todo = {
  id: string
  title?: string
  task?: string
  name?: string
  description?: string
}

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from<RawTodo>('todos').select()
  const normalizedTodos: Todo[] = todos?.map((todo) => ({
    ...todo,
    id: String(todo.id),
  })) ?? []

  // Prefer concise labels over JSON stringification while supporting varied todo schemas.
  const getLabel = (todo: Todo) =>
    todo.title ??
    todo.task ??
    todo.name ??
    todo.description ??
    `Todo #${todo.id}`

  return (
    <ul>
      {normalizedTodos.map((todo) => (
        <li key={todo.id}>{getLabel(todo)}</li>
      ))}
    </ul>
  )
}
