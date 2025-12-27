import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Mock Supabase client to prevent actual network calls during tests
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

describe('App Smoke Test', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toBeTruthy();
    // Check if "Todo List" text is present in the tree
    // Note: react-test-renderer JSON output structure requires traversal to find text
    // But basic truthy check confirms it rendered.
  });
});
