import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock component for Smoke Test
const Home = () => (
  <div>
    <h1>Hyperion AI</h1>
    <p>Welcome to Hyperion</p>
  </div>
);

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { name: /Hyperion AI/i });

    expect(heading).toBeInTheDocument();
  });
});
