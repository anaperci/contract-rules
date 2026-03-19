import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileUp,
  BookOpen,
  MessageSquare,
  History,
  ScrollText,
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/extract', icon: FileUp, label: 'Extrair Regras' },
  { to: '/rules', icon: BookOpen, label: 'Regras' },
  { to: '/test', icon: MessageSquare, label: 'Testar' },
  { to: '/extractions', icon: History, label: 'Histórico' },
]

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-white/90">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
          <ScrollText size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-base font-semibold tracking-tight text-white">
            Contract Rules
          </h1>
          <p className="text-[11px] text-white/50">ITIL Skill Manager</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-white/70 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-[11px] text-white/40">
          NexIA Lab + NCT Informatica
        </p>
      </div>
    </aside>
  )
}
