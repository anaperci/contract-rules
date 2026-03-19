const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Erro na requisição')
  }
  return res.json()
}

export async function getStats() {
  return request('/stats')
}

export async function getRules(filters = {}) {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.priority) params.set('priority', filters.priority)
  const qs = params.toString()
  return request(`/rules${qs ? `?${qs}` : ''}`)
}

export async function updateRule(ruleId, data) {
  return request(`/rules/${ruleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function extractRules(file, company, centralType) {
  const form = new FormData()
  form.append('file', file)
  form.append('company', company || '')
  form.append('central_type', centralType || 'geral')
  return request('/extract', { method: 'POST', body: form })
}

export async function testRules(question) {
  return request('/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
}

export async function getExtractions() {
  return request('/extractions')
}
