import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '../app/page'

// Mock the Next.js headers function
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({}),
}))

// Mock the Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockResolvedValue({
    data: [
      { id: 1, title: 'Test Todo 1', is_complete: false },
      { id: 2, title: 'Test Todo 2', is_complete: true },
    ],
  }),
}

jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}))

describe('Page', () => {
  it('renders todos', async () => {
    // Since Page is an async component, we need to await it.
    // However, React Testing Library render() doesn't support async components directly in the same way Next.js server components do.
    // For unit testing Server Components, we can await the component directly.

    const Component = await Page()
    render(Component)

    expect(screen.getByText(/Test Todo 1/)).toBeInTheDocument()
    expect(screen.getByText(/Test Todo 2/)).toBeInTheDocument()
  })
})
