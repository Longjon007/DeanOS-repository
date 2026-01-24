import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../App';

// Mock the Supabase client
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [{ id: 1, title: 'Test Todo' }], error: null })),
    })),
  },
}));

describe('<App />', () => {
  it('renders correctly', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<App />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
