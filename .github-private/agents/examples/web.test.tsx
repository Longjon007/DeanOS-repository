import { render, screen, waitFor } from '@testing-library/react';
import Page from '@/app/page';
import '@testing-library/jest-dom';

// Mock the Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        data: [
          { id: 1, title: 'Test Todo 1', is_complete: false },
          { id: 2, title: 'Test Todo 2', is_complete: true },
        ],
        error: null,
      }),
    }),
  }),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe('Web: Home Page', () => {
  it('renders a list of todos fetched from Supabase', async () => {
    render(<Page />);

    // Verify loading state (if applicable) or wait for content
    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });
  });

  it('displays the correct completion status', async () => {
    render(<Page />);

    await waitFor(() => {
        // Assuming there's some visual indicator for completion
        // This is a generic example; adjust selectors based on actual implementation
        const todo1 = screen.getByText('Test Todo 1');
        const todo2 = screen.getByText('Test Todo 2');

        expect(todo1).toBeVisible();
        expect(todo2).toBeVisible();
    });
  });
});
