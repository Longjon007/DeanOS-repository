import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../app/App';

// Mock Supabase
jest.mock('../../app/utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1, title: 'Mobile Todo' }],
        error: null,
      })),
    })),
  },
}));

describe('<App />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('has 1 child', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
