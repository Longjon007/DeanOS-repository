import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';
import { supabase } from '../utils/supabase';

// Mock Supabase client
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
  },
}));

describe('App', () => {
  it('renders todos fetched from supabase', async () => {
    // Setup mock return value
    const mockTodos = [
      { id: 1, title: 'Mobile Todo 1', is_complete: false },
      { id: 2, title: 'Mobile Todo 2', is_complete: true },
    ];
    // Need to make sure select returns a promise that resolves
    supabase.from().select.mockResolvedValue({ data: mockTodos, error: null });

    render(<App />);

    expect(screen.getByText('Todo List')).toBeTruthy();

    await waitFor(() => {
        expect(screen.getByText('Mobile Todo 1')).toBeTruthy();
        expect(screen.getByText('Mobile Todo 2')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('handles empty todo list', async () => {
     supabase.from().select.mockResolvedValue({ data: [], error: null });
     render(<App />);
     expect(screen.getByText('Todo List')).toBeTruthy();
     // Should not find any todos
     const todo = screen.queryByText('Mobile Todo 1');
     expect(todo).toBeNull();
  });
});
