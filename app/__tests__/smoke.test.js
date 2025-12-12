import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock component for Smoke Test
const App = () => (
  <View>
    <Text>Hyperion AI Mobile</Text>
  </View>
);

describe('Mobile App', () => {
  it('renders the text', () => {
    render(<App />);

    const text = screen.getByText('Hyperion AI Mobile');

    expect(text).toBeTruthy();
  });
});
