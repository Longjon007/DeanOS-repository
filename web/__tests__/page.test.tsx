import { render, screen, waitFor } from '@testing-library/react'
import Page from '../app/page'

// Mock the Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(),
  })),
}));

// Mock the Supabase client creation
const mockSelect = jest.fn();
jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: mockSelect,
    })),
  })),
}));

describe('Page', () => {
  it('renders a list of todos', async () => {
    const mockTodos = [{ id: 1, title: 'Test Todo' }];
    mockSelect.mockResolvedValueOnce({ data: mockTodos, error: null });

    const jsx = await Page();
    render(jsx);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();

    // Check if the todo is rendered (JSON stringified in the component)
    expect(screen.getByText(/Test Todo/)).toBeInTheDocument();
  });

  it('renders empty list when no todos', async () => {
    mockSelect.mockResolvedValueOnce({ data: [], error: null });

    const jsx = await Page();
    render(jsx);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
  });
});
