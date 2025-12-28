/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import Page from '../app/page'

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn().mockReturnValue([]),
  }),
}))

// Mock supabase
const mockSelect = jest.fn().mockResolvedValue({
  data: [
    { id: 1, title: 'Test Todo 1', user_id: '123', is_complete: false },
    { id: 2, title: 'Test Todo 2', user_id: '123', is_complete: true }
  ]
})

const mockFrom = jest.fn().mockReturnValue({
  select: mockSelect
})

const mockSupabase = {
  from: mockFrom
}

jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn().mockReturnValue(mockSupabase)
}))

describe('Page', () => {
  it('renders todos', async () => {
    // Page is async, so we need to await it or handle it appropriately.
    // In Next.js App Router, testing async components directly with Jest + RTL is tricky.
    // We might need to wrap it or mock the async nature if possible.
    // However, for this environment, let's try calling it.

    const jsx = await Page()
    render(jsx)

    expect(screen.getByText(/Test Todo 1/)).toBeInTheDocument()
    expect(screen.getByText(/Test Todo 2/)).toBeInTheDocument()
  })
})
