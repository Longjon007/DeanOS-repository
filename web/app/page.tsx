import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

type Todo = {
  id: string | number
  title?: string
  task?: string
  name?: string
  description?: string
}

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from<Todo>('todos').select()

  const getLabel = (todo: Todo) =>
    todo.title ??
    todo.task ??
    todo.name ??
    todo.description ??
    `Todo #${todo.id}`

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{getLabel(todo)}</li>
      ))}
    </ul>
  )
}
