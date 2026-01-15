import { render, screen } from '@testing-library/react';
import Page from '@/app/page';
import { createClient } from '@/utils/supabase/server';

// Mock the Supabase client
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('Web Page', () => {
  it('renders todos correctly', async () => {
    // Setup mock return values
    const mockSelect = jest.fn().mockResolvedValue({
      data: [
        { id: 1, title: 'Test Todo 1', is_complete: false },
        { id: 2, title: 'Test Todo 2', is_complete: true },
      ],
      error: null,
    });

    const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });
    (createClient as jest.Mock).mockReturnValue({ from: mockFrom });

    // Render the async component
    const Component = await Page();
    render(Component);

    // Assertions
    expect(screen.getByText(/Test Todo 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Todo 2/i)).toBeInTheDocument();
  });
});
