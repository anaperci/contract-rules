import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  Shield,
  FileUp,
  Building2,
  Clock,
} from 'lucide-react'
import { getStats } from '../services/api'
import StatCard from '../components/StatCard'

const CATEGORY_COLORS = {
  refund: '#EF4444',
  sla: '#F59E0B',
  cancellation: '#8B5CF6',
  access: '#3B82F6',
  pricing: '#10B981',
  support: '#06B6D4',
  penalty: '#EC4899',
  other: '#6B7280',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!stats || !stats.populated) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
          <FileUp size={28} className="text-accent" />
        </div>
        <h2 className="font-display text-xl font-semibold text-gray-900">
          Nenhum contrato carregado
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-gray-500">
          Envie um contrato ou documento de regras para extrair as regras que o
          agente de IA vai aplicar no atendimento.
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

  const { by_priority, by_category, meta, total_rules, total_extractions, last_extraction } = stats

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {meta?.company && (
            <span className="font-medium text-gray-700">{meta.company}</span>
          )}
          {meta?.company && ' — '}
          {meta?.summary || 'Visão geral das regras contratuais carregadas'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total de Regras"
          value={total_rules}
          accent="#5B8DEF"
        />
        <StatCard
          icon={ShieldAlert}
          label="Prioridade Alta"
          value={by_priority.alta || 0}
          accent="#EF4444"
        />
        <StatCard
          icon={Shield}
          label="Prioridade Média"
          value={by_priority.media || 0}
          accent="#F59E0B"
        />
        <StatCard
          icon={ShieldCheck}
          label="Prioridade Baixa"
          value={by_priority.baixa || 0}
          accent="#10B981"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category breakdown */}
        <div className="card p-6">
          <h3 className="font-display text-sm font-semibold text-gray-900">
            Regras por Categoria
          </h3>
          <div className="mt-4 space-y-3">
            {Object.entries(by_category)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[cat] || '#6B7280',
                    }}
                  />
                  <span className="flex-1 text-sm capitalize text-gray-600">
                    {cat}
                  </span>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {count}
                  </span>
                  <div className="h-1.5 w-24 rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${(count / total_rules) * 100}%`,
                        backgroundColor: CATEGORY_COLORS[cat] || '#6B7280',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Meta info */}
        <div className="card p-6">
          <h3 className="font-display text-sm font-semibold text-gray-900">
            Informações do Contrato
          </h3>
          <div className="mt-4 space-y-3">
            {meta?.company && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 size={16} className="text-gray-400" />
                <span className="text-gray-500">Empresa</span>
                <span className="ml-auto font-medium text-gray-900">
                  {meta.company}
                </span>
              </div>
            )}
            {meta?.type && (
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-gray-400" />
                <span className="text-gray-500">Tipo</span>
                <span className="ml-auto font-medium capitalize text-gray-900">
                  {meta.type}
                </span>
              </div>
            )}
            {meta?.version && (
              <div className="flex items-center gap-3 text-sm">
                <BookOpen size={16} className="text-gray-400" />
                <span className="text-gray-500">Versão</span>
                <span className="ml-auto font-mono text-sm text-gray-900">
                  {meta.version}
                </span>
              </div>
            )}
            {meta?.extracted && (
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-500">Extraído em</span>
                <span className="ml-auto text-sm text-gray-900">
                  {meta.extracted}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <FileUp size={16} className="text-gray-400" />
              <span className="text-gray-500">Extrações</span>
              <span className="ml-auto font-mono text-sm text-gray-900">
                {total_extractions}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              className="btn-primary text-xs"
              onClick={() => navigate('/rules')}
            >
              Ver Regras
            </button>
            <button
              className="btn-secondary text-xs"
              onClick={() => navigate('/test')}
            >
              Testar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
