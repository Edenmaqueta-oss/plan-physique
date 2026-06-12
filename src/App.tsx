import { useEffect, useState } from 'react'
import PlanTab from './components/PlanTab'
import SuiviTab from './components/SuiviTab'
import MachoireTab from './components/MachoireTab'
import StatsTab from './components/StatsTab'
import { todayKey } from './lib/storage'

type TabId = 'plan' | 'suivi' | 'machoire' | 'stats'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'plan', label: 'Plan', icon: '🍽️' },
  { id: 'suivi', label: 'Suivi IA', icon: '✦' },
  { id: 'machoire', label: 'Mâchoire', icon: '🪨' },
  { id: 'stats', label: 'Stats', icon: '📈' },
]

export default function App() {
  const [tab, setTab] = useState<TabId>('plan')
  const [day, setDay] = useState(() => todayKey())

  // Reset automatique à minuit : on surveille le changement de date
  // et on remonte les onglets (clé React = date du jour).
  useEffect(() => {
    const t = setInterval(() => {
      const now = todayKey()
      setDay((prev) => (prev !== now ? now : prev))
    }, 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="app">
      <main className="content" key={day}>
        {tab === 'plan' && <PlanTab />}
        {tab === 'suivi' && <SuiviTab />}
        {tab === 'machoire' && <MachoireTab />}
        {tab === 'stats' && <StatsTab />}
      </main>

      <nav className="bottom-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
