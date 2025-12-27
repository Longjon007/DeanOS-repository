import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

describe('Mobile App Environment', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Text>Hyperion AI Mobile</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
