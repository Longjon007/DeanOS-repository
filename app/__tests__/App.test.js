import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import { supabase } from '../utils/supabase';

// Mock the Supabase client
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
    })),
  },
}));

describe('<App />', () => {
  it('renders correctly and fetches todos', async () => {
    // Mock return value for select
    const mockTodos = [{ id: 1, title: 'Test Todo' }];
    supabase.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValue({ data: mockTodos, error: null }),
    }));

    const { getByText, findByText } = render(<App />);

    // Check if title is rendered
    expect(getByText('Todo List')).toBeTruthy();

    // Check if todo items are rendered after fetch
    const todoItem = await findByText('Test Todo');
    expect(todoItem).toBeTruthy();
  });

  it('handles fetch error gracefully', async () => {
    // Mock error
    supabase.from.mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValue({ data: null, error: { message: 'Network error' } }),
    }));

    // We mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(<App />);
    expect(getByText('Todo List')).toBeTruthy();

    // Wait for the effect to run
    await waitFor(() => expect(supabase.from).toHaveBeenCalled());

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching todos:', 'Network error');

    consoleSpy.mockRestore();
  });
});
