import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../App';

// Mock Supabase
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({
      data: [{ id: 1, title: 'Test Todo' }],
      error: null,
    }),
  },
}));

describe('App', () => {
  it('renders correctly', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<App />);
    });

    expect(tree.toJSON()).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
