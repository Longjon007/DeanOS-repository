import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Web App Environment', () => {
  it('renders without crashing', () => {
    render(<div data-testid="app-container">Hyperion AI</div>)
    const element = screen.getByTestId('app-container')
    expect(element).toBeInTheDocument()
    expect(element).toHaveTextContent('Hyperion AI')
  })
})
