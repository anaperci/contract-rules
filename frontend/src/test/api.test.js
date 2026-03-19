import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

import { getStats, getRules, getExtractions, testRules } from '../services/api'

beforeEach(() => {
  mockFetch.mockReset()
})

describe('API Service', () => {
  it('getStats calls /api/stats', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ total_rules: 5, populated: true }),
    })

    const data = await getStats()
    expect(mockFetch).toHaveBeenCalledWith('/api/stats', {})
    expect(data.total_rules).toBe(5)
  })

  it('getRules calls /api/rules with no filters', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rules: [], total: 0 }),
    })

    await getRules()
    expect(mockFetch).toHaveBeenCalledWith('/api/rules', {})
  })

  it('getRules appends category filter', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rules: [], total: 0 }),
    })

    await getRules({ category: 'sla' })
    expect(mockFetch).toHaveBeenCalledWith('/api/rules?category=sla', {})
  })

  it('getRules appends priority filter', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ rules: [], total: 0 }),
    })

    await getRules({ priority: 'alta' })
    expect(mockFetch).toHaveBeenCalledWith('/api/rules?priority=alta', {})
  })

  it('getExtractions calls /api/extractions', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    })

    const data = await getExtractions()
    expect(data.items).toEqual([])
  })

  it('testRules sends POST with question', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          question: 'test',
          response: 'answer',
          matched_rules: [],
        }),
    })

    const data = await testRules('Quero cancelar')
    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'Quero cancelar' }),
    })
    expect(data.response).toBe('answer')
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      json: () => Promise.resolve({ detail: 'Nenhuma regra carregada' }),
    })

    await expect(testRules('test')).rejects.toThrow('Nenhuma regra carregada')
  })
})
