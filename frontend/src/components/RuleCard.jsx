import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Save, X } from 'lucide-react'
import { updateRule } from '../services/api'

const priorityLabels = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

export default function RuleCard({ rule, onUpdated }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...rule })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateRule(rule.id, form)
      onUpdated?.()
      setEditing(false)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="font-mono text-xs font-medium text-accent">
          {rule.id}
        </span>
        <span className={`badge-${rule.priority}`}>
          {priorityLabels[rule.priority]}
        </span>
        <span className="badge-category">{rule.category}</span>
        <span className="flex-1 truncate text-sm text-gray-700">
          {rule.rule}
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div className="border-t border-surface-border px-5 py-4">
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Regra
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  value={form.rule}
                  onChange={(e) => setForm({ ...form, rule: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Categoria
                  </label>
                  <select
                    className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {[
                      'refund',
                      'sla',
                      'cancellation',
                      'access',
                      'pricing',
                      'support',
                      'penalty',
                      'other',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Prioridade
                  </label>
                  <select
                    className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Condições
                </label>
                <input
                  className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  value={form.conditions}
                  onChange={(e) =>
                    setForm({ ...form, conditions: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Exceções
                </label>
                <input
                  className="w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  value={form.exceptions || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      exceptions: e.target.value || null,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  className="btn-primary text-xs"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={14} />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  className="btn-secondary text-xs"
                  onClick={() => {
                    setForm({ ...rule })
                    setEditing(false)
                  }}
                >
                  <X size={14} />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-400">
                  Regra
                </span>
                <p className="mt-0.5 text-sm text-gray-700">{rule.rule}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-400">
                    Condições
                  </span>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {rule.conditions}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400">
                    Exceções
                  </span>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {rule.exceptions || 'Nenhuma'}
                  </p>
                </div>
              </div>
              <button
                className="btn-secondary mt-2 text-xs"
                onClick={() => setEditing(true)}
              >
                <Pencil size={14} />
                Editar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
