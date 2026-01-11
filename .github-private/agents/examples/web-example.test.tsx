import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '@/components/TodoList'; // Hypothetical component
import { createClient } from '@/utils/supabase/client';

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('TodoList Component', () => {
  it('renders a list of todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Buy milk', is_complete: false },
      { id: 2, title: 'Walk dog', is_complete: true },
    ];

    // Mock the Supabase select response
    const mockSelect = jest.fn().mockResolvedValue({ data: mockTodos, error: null });
    const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    (createClient as jest.Mock).mockReturnValue({ from: mockFrom });

    render(<TodoList />);

    // Wait for items to load
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
    expect(await screen.findByText('Walk dog')).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    const mockSelect = jest.fn().mockResolvedValue({ data: null, error: { message: 'Fetch error' } });
    const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    (createClient as jest.Mock).mockReturnValue({ from: mockFrom });

    render(<TodoList />);

    expect(await screen.findByText('Error loading todos')).toBeInTheDocument();
  });
});
