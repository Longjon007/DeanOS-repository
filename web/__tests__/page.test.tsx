import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import { createClient } from '../utils/supabase/server'

jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn()
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
      getAll: jest.fn(),
      set: jest.fn(),
  })),
}))

const mockCreateClient = createClient as jest.Mock

describe('Page', () => {
  it('renders a list of todos', async () => {
    const todos = [{ id: 1, title: 'Test Todo' }]
    const mockSelect = jest.fn().mockResolvedValue({ data: todos })
    const mockFrom = jest.fn(() => ({ select: mockSelect }))

    mockCreateClient.mockReturnValue({ from: mockFrom })

    const jsx = await Page()
    render(jsx)

    expect(screen.getByText(JSON.stringify(todos[0]))).toBeInTheDocument()
  })

  it('renders empty list if no todos', async () => {
     const mockSelect = jest.fn().mockResolvedValue({ data: [] })
     const mockFrom = jest.fn(() => ({ select: mockSelect }))
     mockCreateClient.mockReturnValue({ from: mockFrom })

     const jsx = await Page()
     render(jsx)
     expect(screen.getByRole('list')).toBeInTheDocument()
     expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})
