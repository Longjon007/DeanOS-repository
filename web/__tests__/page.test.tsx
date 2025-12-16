import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

// Mock the next/headers cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn(),
  }),
}));

// Mock the supabase client
jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Test Todo' }],
      }),
    }),
  }),
}));

describe('Page', () => {
  it('renders a list of todos', async () => {
    const resolvedPage = await Page();
    render(resolvedPage)

    expect(screen.getByText(/Test Todo/)).toBeInTheDocument()
  })
})
