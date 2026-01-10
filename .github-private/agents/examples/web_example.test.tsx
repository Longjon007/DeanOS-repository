import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/page';

// Mock Supabase client
jest.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        data: [{ id: 1, title: 'Test Todo' }],
        error: null,
      }),
    }),
  }),
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => [],
  }),
}));

describe('Home Page', () => {
  it('renders the todo list', async () => {
    const page = await Page();
    render(page);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });
});
