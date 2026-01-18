import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Sample Test', () => {
  it('renders correctly', () => {
    render(<div>Test</div>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
