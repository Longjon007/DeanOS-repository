import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Example', () => {
  it('renders correctly', () => {
    render(<Text>Hello Mobile</Text>);
    expect(screen.getByText('Hello Mobile')).toBeTruthy();
  });
});
