import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Mobile Example Test', () => {
  it('renders correctly', () => {
    // Dummy test to verify setup
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });
});
