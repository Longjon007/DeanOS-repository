import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

type TodoRecord = {
  id?: string | number
  title?: string
  name?: string
  description?: string
}

const TEMPLATE_OPTIONS = [
  {
    title: 'Product Brief',
    description: 'Shape a one-page overview with problem, audience, and promise.'
  },
  {
    title: 'Launch Checklist',
    description: 'Generate the first 10 steps to ship something users can try this week.'
  },
  {
    title: 'Persona Snapshot',
    description: 'Describe a target customer, their pains, and what a win looks like.'
  }
]

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from<TodoRecord>('todos').select()
  const todoItems = todos ?? []

  return (
    <main
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '48px 24px',
        fontFamily: 'Inter, system-ui, sans-serif',
        lineHeight: 1.6
      }}
    >
      <section style={{ marginBottom: 32 }} aria-labelledby="template-section-title">
        <h1 id="template-section-title" style={{ fontSize: 28, marginBottom: 8 }}>
          Jump in with a template
        </h1>
        <p style={{ color: '#475467', marginBottom: 16 }}>
          Pick a starting point to spark ideas and see what Hyperien can build for you.
        </p>
        <ul
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}
        >
          {TEMPLATE_OPTIONS.map((template) => (
            <li
              key={template.title}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                background: '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>{template.title}</h3>
              <p style={{ color: '#4b5563', fontSize: 14, margin: 0 }}>{template.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Your todos</h2>
        {todoItems.length ? (
          <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
            {todoItems.map((todo, index) => (
              <li
                key={todo.id ?? `${todo.title ?? todo.name ?? 'todo'}-${index}`}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: 12,
                  background: '#f9fafb'
                }}
              >
                {todo.title ?? todo.name ?? todo.description ?? JSON.stringify(todo)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#6b7280' }}>No todos yet. Add one to see it here.</p>
        )}
      </section>
    </main>
  )
}
