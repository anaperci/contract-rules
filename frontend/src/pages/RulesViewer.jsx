import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, FileUp, Search } from 'lucide-react'
import { getRules } from '../services/api'
import RuleCard from '../components/RuleCard'

export default function RulesViewer() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('')
  const [filterPrio, setFilterPrio] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  function load() {
    setLoading(true)
    getRules({ category: filterCat, priority: filterPrio })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filterCat, filterPrio])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!data?.populated) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
          <FileUp size={28} className="text-accent" />
        </div>
        <h2 className="font-display text-xl font-semibold text-gray-900">
          Nenhuma regra carregada
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Extraia um contrato primeiro para ver as regras aqui.
        </p>
        <button
          className="btn-primary mt-6"
          onClick={() => navigate('/extract')}
        >
          <FileUp size={16} />
          Extrair Regras
        </button>
      </div>
    )
  }

  const categories = [...new Set(data.rules.map((r) => r.category))].sort()

  const filtered = search
    ? data.rules.filter(
        (r) =>
          r.rule.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase()) ||
          r.conditions.toLowerCase().includes(search.toLowerCase())
      )
    : data.rules

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Regras
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {data.total} regras carregadas
            {data.meta?.company && ` — ${data.meta.company}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-3 px-4 py-3">
        <Filter size={16} className="text-gray-400" />

        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar regra..."
            className="w-full rounded-lg border border-surface-border py-2 pl-8 pr-3 text-sm focus:border-accent focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Todas categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
          value={filterPrio}
          onChange={(e) => setFilterPrio(e.target.value)}
        >
          <option value="">Todas prioridades</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        {(filterCat || filterPrio || search) && (
          <button
            className="text-xs text-accent hover:underline"
            onClick={() => {
              setFilterCat('')
              setFilterPrio('')
              setSearch('')
            }}
          >
            Limpar
          </button>
        )}
      </div>

      {/* Rules */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Nenhuma regra encontrada com esses filtros.
          </div>
        ) : (
          filtered.map((rule) => (
            <RuleCard key={rule.id} rule={rule} onUpdated={load} />
          ))
        )}
      </div>
    </div>
  )
}
