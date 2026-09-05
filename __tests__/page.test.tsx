import { render, screen, fireEvent } from '@testing-library/react'
import Page from '../app/page'

describe('Login Page', () => {
  it('renders the login form', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { name: /III Nexus/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Member Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('allows entering email and password', () => {
    render(<Page />)
    const emailInput = screen.getByLabelText(/Member Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@iiinexus.org' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(emailInput).toHaveValue('test@iiinexus.org')
    expect(passwordInput).toHaveValue('password123')
  })
})
