import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Web App Environment', () => {
  it('runs a simple sanity check', () => {
    render(<div data-testid="test-div">Hello World</div>)
    expect(screen.getByTestId('test-div')).toHaveTextContent('Hello World')
  })
})
