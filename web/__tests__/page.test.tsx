import { render, screen, waitFor } from '@testing-library/react';
import Page from '../app/page';

// Mock the Supabase client
jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1, title: 'Test Todo' }],
        error: null,
      })),
    })),
  })),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
  })),
}));

describe('Page', () => {
  it('renders a heading', async () => {
    // Page is an async component, so we need to await it
    const resolvedPage = await Page();
    render(resolvedPage);

    // This is a very basic test just to ensure the testing infrastructure works.
    // The actual component renders raw JSON, so we expect to see the JSON string.
    expect(screen.getByText(/Test Todo/)).toBeInTheDocument();
  });
});
