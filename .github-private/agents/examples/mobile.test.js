import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../../app/App';
import { supabase } from '../../../app/utils/supabase';

// Mock Supabase
jest.mock('../../../app/utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('App', () => {
  it('renders correctly and fetches todos', async () => {
    const mockSelect = jest.fn().mockResolvedValue({
      data: [{ id: 1, title: 'Mobile Todo' }],
      error: null,
    });

    supabase.from.mockReturnValue({
      select: mockSelect,
    });

    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    // Check if the todo text is present in the tree
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // Verify Supabase call
    expect(supabase.from).toHaveBeenCalledWith('todos');
    expect(mockSelect).toHaveBeenCalled();
  });
});
