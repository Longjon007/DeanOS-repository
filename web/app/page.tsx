import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={String((todo as { id?: string | number })?.id ?? JSON.stringify(todo))}>
          {JSON.stringify(todo)}
        </li>
      ))}
    </ul>
  )
}
