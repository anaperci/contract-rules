import { useState } from 'react'
import {
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  BookOpen,
} from 'lucide-react'
import { testRules } from '../services/api'

const QUICK_QUESTIONS = [
  'Quero cancelar meu contrato e pedir reembolso.',
  'Qual o prazo de resposta para chamados críticos?',
  'Posso transferir meu plano para outra pessoa?',
  'Vocês prometeram responder em 4h e já faz 8h.',
  'Quero cancelar antes do fim do contrato, tem multa?',
]

export default function TestRules() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend(question) {
    const q = question || input.trim()
    if (!q || loading) return

    const userMsg = { role: 'user', content: q }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const data = await testRules(q)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          matched_rules: data.matched_rules,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: err.message },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Testar Regras
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Simule perguntas de clientes e veja como o agente aplica as regras
          extraídas.
        </p>
      </div>

      {/* Chat area */}
      <div className="card flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <MessageSquare size={24} className="text-accent" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Faça uma pergunta como se fosse um cliente
              </p>
              <p className="mt-1 text-xs text-gray-400">
                O agente consultará as regras extraídas do contrato
              </p>

              {/* Quick questions */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Bot size={16} className="text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-sidebar text-white'
                      : msg.role === 'error'
                        ? 'border border-red-200 bg-red-50 text-red-800'
                        : 'border border-surface-border bg-white text-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>

                  {/* Matched rules */}
                  {msg.matched_rules?.length > 0 && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <BookOpen size={12} />
                        Regras aplicadas
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {msg.matched_rules.map((r) => (
                          <span
                            key={r.id}
                            className={`badge-${r.priority} text-[10px]`}
                          >
                            [{r.id}] {r.category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar/10">
                    <User size={16} className="text-sidebar" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Bot size={16} className="text-accent" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-3">
                <Loader2 size={14} className="animate-spin text-accent" />
                <span className="text-xs text-gray-400">
                  Consultando regras...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-surface-border p-4">
          <div className="flex gap-3">
            <textarea
              rows={1}
              placeholder="Digite a pergunta do cliente..."
              className="flex-1 resize-none rounded-lg border border-surface-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn-primary shrink-0"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
