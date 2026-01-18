import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('./utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [],
        error: null,
      })),
    })),
  },
}));

describe('<App />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    // App returns a View with two children: Text and FlatList
    expect(tree.children.length).toBe(2);
    expect(tree).toMatchSnapshot();
  });
});
