import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../page'
import { createClient } from '../../utils/supabase/server'

// Mock the modules
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    getAll: jest.fn(),
    set: jest.fn(),
  }),
}))

jest.mock('../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('Page', () => {
  it('renders a list of todos', async () => {
    const mockFrom = jest.fn().mockReturnThis()
    const mockSelect = jest.fn()

    ;(createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      select: mockSelect,
    })

    const mockTodos = [
        { id: 1, title: 'Test Todo 1', is_complete: false },
        { id: 2, title: 'Test Todo 2', is_complete: true }
    ]

    mockSelect.mockResolvedValue({
        data: mockTodos,
        error: null
    })

    // Page is async component
    const jsx = await Page()
    render(jsx)

    expect(screen.getByText(JSON.stringify(mockTodos[0]))).toBeInTheDocument()
    expect(screen.getByText(JSON.stringify(mockTodos[1]))).toBeInTheDocument()
  })
})
