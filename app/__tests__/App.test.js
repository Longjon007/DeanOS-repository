import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Mock the Supabase client
const mockSelect = jest.fn().mockResolvedValue({ data: [{ id: 1, title: 'Test Todo' }], error: null });
const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

jest.mock('../utils/supabase', () => ({
  supabase: {
    from: (table) => mockFrom(table),
  },
}));

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('<App />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toBeDefined();
  });

  it('fetches todos on mount', async () => {
    renderer.create(<App />);
    // Need to wait for useEffect
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mockFrom).toHaveBeenCalledWith('todos');
    expect(mockSelect).toHaveBeenCalled();
  });
});
