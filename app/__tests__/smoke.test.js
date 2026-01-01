import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

describe('Smoke Test', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Text>Hello World</Text>).toJSON();
    expect(tree).toBeTruthy();
    expect(tree.children[0]).toBe('Hello World');
  });
});
