import { render, screen } from '@testing-library/react'
import Page from '../../../web/app/page'
import { createClient } from '../../../web/utils/supabase/server'

// Mock Next.js headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: () => [],
  })),
}))

// Mock Supabase client
jest.mock('../../../web/utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('Page', () => {
  it('renders a list of todos', async () => {
    // Setup Supabase mock
    const mockSelect = jest.fn().mockResolvedValue({
      data: [{ id: 1, title: 'Test Todo', is_complete: false }],
      error: null,
    })

    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect
    })

    ;(createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    })

    // Render the async Server Component
    const jsx = await Page()
    render(jsx)

    // Verify output
    expect(screen.getByText(/Test Todo/)).toBeInTheDocument()
  })
})
