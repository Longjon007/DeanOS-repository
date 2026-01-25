import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn().mockReturnValue([]),
  }),
}))

// Mock supabase server client
jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: 1, title: 'Test Todo' }],
        error: null
      })
    })
  })
}))

test('renders todos', async () => {
  const result = await Page()
  render(result)

  expect(screen.getByText('{"id":1,"title":"Test Todo"}')).toBeInTheDocument()
})
