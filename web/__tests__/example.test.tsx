import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Web Application', () => {
  it('renders a heading', () => {
    // This is a placeholder test.
    // Ideally, we would render the actual Page component, but we need to ensure it's exported and testable.
    // For now, we verify the test environment works.
    render(<h1>Hyperion AI</h1>)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Hyperion AI')
  })
})
