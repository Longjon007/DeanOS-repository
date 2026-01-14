import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoPage from '@/app/page'; // Assuming a page component
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('Web: TodoPage', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ id: 1, title: 'Test Todo', is_complete: false }],
        error: null,
      })),
    })),
  };

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the list of todos', async () => {
    // Note: If TodoPage is a Server Component, this test approach might need adaptation (e.g., passing data as props or integration testing).
    // This example assumes a Client Component or a testable sub-component.

    // For the purpose of this reference, we assume we are testing a component that fetches data.
    render(<TodoPage />);

    expect(await screen.findByText('Test Todo')).toBeInTheDocument();
  });

  it('handles navigation', () => {
    render(<TodoPage />);
    // Example interaction
    // fireEvent.click(screen.getByText('Test Todo'));
    // expect(mockPush).toHaveBeenCalledWith('/todos/1');
  });
});
