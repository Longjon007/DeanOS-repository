import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [{ id: 1, title: 'Mobile Todo' }], error: null }),
    }),
  }),
}));

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Mobile Todo')).toBeTruthy();
    });
  });
});
