import { render, screen } from '@testing-library/react'
import Dashboard from '../app/dashboard/page'

describe('Dashboard Page', () => {
  it('renders the dashboard header', async () => {
    render(<Dashboard />)
    expect(await screen.findByText('III Nexus')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Available Modules/i })).toBeInTheDocument()
  })

  it('renders all module cards', async () => {
    render(<Dashboard />)
    
    // Check for SkipTray
    expect(await screen.findByText('ST')).toBeInTheDocument()
    expect(screen.getByText('SkipTray')).toBeInTheDocument()
    expect(screen.getByText('In-House pre-ordering app for the ground floor canteen')).toBeInTheDocument()

    // Check for other placeholders
    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.getByText('Placeholder App 1')).toBeInTheDocument()
  })
})
