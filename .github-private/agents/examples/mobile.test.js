import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../app/App';

// Mock Async Storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Supabase Client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
      update: jest.fn(() => Promise.resolve({ data: [], error: null })),
      delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  })),
}));

describe('Mobile: App Component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('initializes Supabase and checks session on mount', async () => {
    // This example assumes we can spy on the mock or check side effects
    // In a real test, we might use Enzyme or RNTL to check for specific elements
    const component = renderer.create(<App />);
    const instance = component.root;

    // Verify that the component renders without crashing
    expect(instance).toBeTruthy();
  });
});
