import { createClient } from '../../utils/supabase/server'
import { cookies } from 'next/headers'

// Mock the modules
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    getAll: jest.fn(),
    set: jest.fn(),
  }),
}))

jest.mock('../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('Reference Web Test', () => {
  it('mocks headers and supabase correctly', async () => {
    const mockFrom = jest.fn().mockReturnThis()
    const mockSelect = jest.fn()

    ;(createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      select: mockSelect,
    })

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.from('todos').select()

    expect(mockSelect).toHaveBeenCalled()
    expect(createClient).toHaveBeenCalled()
  })
})
