import { render, screen } from '@testing-library/react'
import PrivacyPolicy from '../app/privacy/page'
import TermsOfService from '../app/terms/page'
import LegalInformation from '../app/legal/page'

describe('Legal Pages', () => {
  it('renders Privacy Policy', () => {
    render(<PrivacyPolicy />)
    expect(screen.getByRole('heading', { name: /Privacy Policy/i })).toBeInTheDocument()
  })

  it('renders Terms of Service', () => {
    render(<TermsOfService />)
    expect(screen.getByRole('heading', { name: /Terms of Service/i })).toBeInTheDocument()
  })

  it('renders Legal Information', () => {
    render(<LegalInformation />)
    expect(screen.getByRole('heading', { name: /Legal Information/i })).toBeInTheDocument()
  })
})
