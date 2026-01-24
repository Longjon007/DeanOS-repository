import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('Infrastructure Test', () => {
  it('renders a dummy component correctly', () => {
    const Dummy = () => <h1>Hello Hyperion</h1>
    render(<Dummy />)
    expect(screen.getByRole('heading', { name: 'Hello Hyperion' })).toBeInTheDocument()
  })
})
