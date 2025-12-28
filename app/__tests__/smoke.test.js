import renderer from 'react-test-renderer';
import React from 'react';
import { Text } from 'react-native';

describe('Mobile Smoke Test', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Text>Snapshot test!</Text>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
