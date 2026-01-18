import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

describe('Mobile Component Test', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Text>Hello Mobile</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
