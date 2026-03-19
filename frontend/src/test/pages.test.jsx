import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock API
vi.mock('../services/api.js', () => ({
  getStats: vi.fn(),
  getRules: vi.fn(),
  getExtractions: vi.fn(),
  extractRules: vi.fn(),
  testRules: vi.fn(),
  updateRule: vi.fn(),
}))

import * as api from '../services/api'

function renderWithRouter(component, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>
  )
}

describe('Dashboard', () => {
  it('shows empty state when no rules populated', async () => {
    api.getStats.mockResolvedValue({
      populated: false,
      total_rules: 0,
      by_priority: {},
      by_category: {},
      meta: {},
      total_extractions: 0,
      last_extraction: null,
    })

    const { default: Dashboard } = await import('../pages/Dashboard')
    renderWithRouter(<Dashboard />)

    expect(
      await screen.findByText('Nenhum contrato carregado')
    ).toBeInTheDocument()
  })

  it('shows stats when rules are populated', async () => {
    api.getStats.mockResolvedValue({
      populated: true,
      total_rules: 10,
      by_priority: { alta: 3, media: 5, baixa: 2 },
      by_category: { refund: 4, sla: 6 },
      meta: { company: 'Test Corp', summary: 'Test rules' },
      total_extractions: 1,
      last_extraction: null,
    })

    const { default: Dashboard } = await import('../pages/Dashboard')
    renderWithRouter(<Dashboard />)

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    expect(await screen.findByText('10')).toBeInTheDocument()
  })
})

describe('ExtractRules', () => {
  it('renders upload form', async () => {
    const { default: ExtractRules } = await import('../pages/ExtractRules')
    renderWithRouter(<ExtractRules />)

    expect(screen.getByRole('heading', { name: 'Extrair Regras' })).toBeInTheDocument()
    expect(
      screen.getByText(/Arraste o contrato aqui/)
    ).toBeInTheDocument()
  })
})

describe('RulesViewer', () => {
  it('shows empty state when no rules', async () => {
    api.getRules.mockResolvedValue({
      populated: false,
      rules: [],
      total: 0,
      meta: {},
    })

    const { default: RulesViewer } = await import('../pages/RulesViewer')
    renderWithRouter(<RulesViewer />)

    expect(
      await screen.findByText('Nenhuma regra carregada')
    ).toBeInTheDocument()
  })
})

describe('TestRules', () => {
  it('renders chat interface with quick questions', async () => {
    const { default: TestRules } = await import('../pages/TestRules')
    renderWithRouter(<TestRules />)

    expect(screen.getByText('Testar Regras')).toBeInTheDocument()
    expect(
      screen.getByText(/Faça uma pergunta/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Quero cancelar meu contrato/)
    ).toBeInTheDocument()
  })
})

describe('Extractions', () => {
  it('shows empty state when no extractions', async () => {
    api.getExtractions.mockResolvedValue({ items: [] })

    const { default: Extractions } = await import('../pages/Extractions')
    renderWithRouter(<Extractions />)

    expect(
      await screen.findByText('Nenhuma extração registrada ainda.')
    ).toBeInTheDocument()
  })
})

describe('Sidebar', () => {
  it('renders nav links', async () => {
    const { default: Sidebar } = await import('../components/Sidebar')
    renderWithRouter(<Sidebar />)

    expect(screen.getByText('Contract Rules')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Extrair Regras')).toBeInTheDocument()
    expect(screen.getByText('Regras')).toBeInTheDocument()
    expect(screen.getByText('Testar')).toBeInTheDocument()
    expect(screen.getByText('Histórico')).toBeInTheDocument()
  })
})
