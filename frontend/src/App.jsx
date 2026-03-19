import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ExtractRules from './pages/ExtractRules'
import RulesViewer from './pages/RulesViewer'
import TestRules from './pages/TestRules'
import Extractions from './pages/Extractions'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/extract" element={<ExtractRules />} />
            <Route path="/rules" element={<RulesViewer />} />
            <Route path="/test" element={<TestRules />} />
            <Route path="/extractions" element={<Extractions />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
