import React from 'react';
import renderer from 'react-test-renderer';
import { View, Text } from 'react-native';

const ExampleComponent = ({ title }) => (
  <View>
    <Text>{title}</Text>
  </View>
);

describe('Reference Mobile Test', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ExampleComponent title="Test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
