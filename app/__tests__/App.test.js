import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../App';
import { supabase } from '../utils/supabase';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('<App />', () => {
  it('renders correctly', async () => {
    const mockSelect = jest.fn().mockResolvedValue({ data: [{id: 1, title: 'Test Todo'}], error: null });
    supabase.from.mockReturnValue({ select: mockSelect });

    let component;
    await act(async () => {
      component = renderer.create(<App />);
    });

    expect(component.toJSON()).toMatchSnapshot();
  });
});
