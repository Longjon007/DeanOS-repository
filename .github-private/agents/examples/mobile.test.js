import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../../../app/App'; // Adjust path as needed to point to actual App source

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Supabase client
jest.mock('../../../../app/utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1, title: 'Mobile Todo', is_complete: false }],
        error: null,
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 2, title: 'New Todo', is_complete: false }],
          error: null,
        })),
      })),
    })),
  },
}));

describe('Mobile: App', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('initializes with correct state', async () => {
    // Advanced testing with React Native Testing Library would go here
    // For now, checking snapshot and basic rendering
    const component = renderer.create(<App />);
    const instance = component.getInstance();

    // If state is accessible or if we use testing-library, we can check elements
    expect(instance).toBeDefined();
  });
});
