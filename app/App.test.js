import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from './App';
import { supabase } from './utils/supabase';

// Mock the Supabase client
jest.mock('./utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('App', () => {
  it('renders correctly', async () => {
    // Mock the response from Supabase
    const mockTodos = [
      { id: 1, title: 'Test Todo 1' },
      { id: 2, title: 'Test Todo 2' },
    ];

    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: mockTodos, error: null }),
    }));

    const { getByText } = render(<App />);

    // Check if the title is rendered
    expect(getByText('Todo List')).toBeTruthy();

    // Wait for the todos to be fetched and rendered
    // Increase timeout for this test as it involves async operations
    await waitFor(() => {
      expect(getByText('Test Todo 1')).toBeTruthy();
      expect(getByText('Test Todo 2')).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('handles error fetching todos', async () => {
    // Mock an error response
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: null, error: { message: 'Fetch error' } }),
    }));

    // Spy on console.error to suppress the output in tests (optional)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByText } = render(<App />);

    expect(getByText('Todo List')).toBeTruthy();

    // Since we just log the error in the component, we can check if console.error was called
    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching todos:', 'Fetch error');
    });

    consoleSpy.mockRestore();
  });
});
