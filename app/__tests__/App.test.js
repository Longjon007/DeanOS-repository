import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';
import { supabase } from '../utils/supabase';

// Mock Supabase
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
  },
}));

describe('App', () => {
  it('renders correctly', async () => {
    // Setup mocks
    const mockTodos = [
      { id: 1, title: 'Test Todo 1' },
      { id: 2, title: 'Test Todo 2' },
    ];

    const mockSelect = jest.fn().mockResolvedValue({
      data: mockTodos,
      error: null,
    });

    supabase.from.mockReturnValue({
        select: mockSelect
    });

    let tree;
    await renderer.act(async () => {
        tree = renderer.create(<App />);
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
