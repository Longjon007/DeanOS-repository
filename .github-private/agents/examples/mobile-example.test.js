import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../app/index'; // Hypothetical screen
import { supabase } from '../../app/utils/supabase';

// Mock Supabase client
jest.mock('../../app/utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('HomeScreen', () => {
  it('renders correctly and fetches data', async () => {
    const mockTodos = [
      { id: 1, title: 'Test App', is_complete: false },
    ];

    const mockSelect = jest.fn().mockResolvedValue({ data: mockTodos, error: null });
    const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    supabase.from.mockReturnValue({ select: mockSelect }); // Simplified mock

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Test App')).toBeTruthy();
    });
  });

  it('allows adding a new item', async () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen />);

    const input = getByPlaceholderText('Add a new todo');
    fireEvent.changeText(input, 'New Task');
    fireEvent.press(getByText('Add'));

    // Verify logic to add item (mocking the insert call would be needed here)
    // expect(supabase.from).toHaveBeenCalledWith('todos');
    // ... verification logic
  });
});
