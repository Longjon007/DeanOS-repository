import { render, screen } from '@testing-library/react'
import Page from '../page'
import '@testing-library/jest-dom'

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    getAll: jest.fn().mockReturnValue([]),
  }),
}))

// Define mocks before usage
const mockSelect = jest.fn().mockReturnValue({ data: [{ id: 1, title: 'Test Todo', is_complete: false }] })
const mockFrom = jest.fn().mockReturnValue({ select: mockSelect })

// Use mockImplementation to access the hoisted variables if needed,
// or simply define the mock factory cleanly.
jest.mock('../../utils/supabase/server', () => {
    return {
        createClient: jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    data: [{ id: 1, title: 'Test Todo', is_complete: false }]
                })
            })
        })
    }
})

describe('Page', () => {
  it('renders todos', async () => {
    const jsx = await Page()
    render(jsx)

    const listElement = screen.getByRole('list')
    expect(listElement).toBeInTheDocument()

    expect(screen.getByText(/Test Todo/)).toBeInTheDocument()
  })
})
