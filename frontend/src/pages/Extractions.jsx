import { useEffect, useState } from 'react'
import { Clock, FileText, Building2, Hash } from 'lucide-react'
import { getExtractions } from '../services/api'

export default function Extractions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getExtractions()
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Histórico de Extrações
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Registro de todos os contratos processados.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card py-16 text-center">
          <Clock size={28} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm text-gray-400">
            Nenhuma extração registrada ainda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="card flex items-center gap-4 px-5 py-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileText size={18} className="text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.filename}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
                    {item.company && (
                      <span className="flex items-center gap-1">
                        <Building2 size={11} />
                        {item.company}
                      </span>
                    )}
                    <span className="capitalize">{item.central_type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm">
                  <Hash size={14} className="text-gray-400" />
                  <span className="font-mono font-medium text-gray-900">
                    {item.total_rules}
                  </span>
                  <span className="text-xs text-gray-400">regras</span>
                </div>

                <div className="text-right text-xs text-gray-400">
                  {new Date(item.extracted_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
