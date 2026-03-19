import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileUp,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { extractRules } from '../services/api'

const TYPES = [
  { value: 'geral', label: 'Geral' },
  { value: 'suporte', label: 'Suporte' },
  { value: 'vendas', label: 'Vendas' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'saude', label: 'Saúde' },
  { value: 'juridico', label: 'Jurídico' },
]

export default function ExtractRules() {
  const [file, setFile] = useState(null)
  const [company, setCompany] = useState('')
  const [centralType, setCentralType] = useState('geral')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef()
  const navigate = useNavigate()

  function handleDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      const data = await extractRules(file, company, centralType)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Extrair Regras
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Envie um contrato ou documento de regras de negócio para extrair as
          regras automaticamente via Claude API.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl p-6">
        {/* File Drop */}
        <div
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            file
              ? 'border-accent/40 bg-accent/5'
              : 'border-gray-200 bg-gray-50/50 hover:border-accent/30'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? (
            <>
              <FileUp size={28} className="text-accent" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB — Clique para trocar
              </p>
            </>
          ) : (
            <>
              <Upload size={28} className="text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-600">
                Arraste o contrato aqui ou clique para selecionar
              </p>
              <p className="text-xs text-gray-400">.txt ou .md</p>
            </>
          )}
        </div>

        {/* Options */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Empresa (opcional)
            </label>
            <input
              type="text"
              placeholder="Nome da empresa"
              className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Tipo de Central
            </label>
            <select
              className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
              value={centralType}
              onChange={(e) => setCentralType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || status === 'loading'}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Extraindo regras com Claude API...
            </>
          ) : (
            <>
              <FileUp size={16} />
              Extrair Regras
            </>
          )}
        </button>

        {/* Result */}
        {status === 'success' && result && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <p className="text-sm font-medium text-emerald-800">
                {result.message}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="btn-primary text-xs"
                onClick={() => navigate('/rules')}
              >
                Ver Regras
              </button>
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => navigate('/')}
              >
                Dashboard
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
