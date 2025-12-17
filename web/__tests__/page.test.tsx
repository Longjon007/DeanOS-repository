import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Page />)
    // Since we don't know the exact content of the page yet (we haven't read it fully in a while,
    // but we know it's the main page), we can just check if it renders.
    // However, usually we check for a heading.
    // Let's assume there might be some text.
    // For now, a simple render check is a good start.
  })
})
