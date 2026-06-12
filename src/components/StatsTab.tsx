import { useMemo, useState } from 'react'
import {
  API_KEY_STORAGE,
  PROTEIN_GOAL,
  dateKeyOffset,
  dayProteinTotal,
  loadJSON,
  loadPlan,
  saveJSON,
} from '../lib/storage'

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export default function StatsTab() {
  const [apiKey, setApiKey] = useState<string>(() => loadJSON<string>(API_KEY_STORAGE, ''))
  const [saved, setSaved] = useState(false)

  const { last7, average, streak } = useMemo(() => {
    const plan = loadPlan()
    // index 0 = il y a 6 jours … index 6 = aujourd'hui
    const days = Array.from({ length: 7 }, (_, i) => {
      const offset = 6 - i
      const key = dateKeyOffset(offset)
      const total = dayProteinTotal(plan[key])
      const d = new Date()
      d.setDate(d.getDate() - offset)
      return { key, total: Math.round(total), label: DAY_LABELS[d.getDay()] }
    })

    const avg = Math.round(days.reduce((s, d) => s + d.total, 0) / 7)

    // streak : jours consécutifs avec objectif atteint, en remontant depuis aujourd'hui.
    // Si aujourd'hui pas encore atteint, on ne casse pas le streak (journée en cours).
    let s = 0
    let start = 0
    const todayTotal = dayProteinTotal(plan[dateKeyOffset(0)])
    if (todayTotal < PROTEIN_GOAL) start = 1
    for (let offset = start; offset < 365; offset++) {
      const total = dayProteinTotal(plan[dateKeyOffset(offset)])
      if (total >= PROTEIN_GOAL) s++
      else break
    }

    return { last7: days, average: avg, streak: s }
  }, [])

  const maxBar = Math.max(PROTEIN_GOAL, ...last7.map((d) => d.total))

  function save() {
    saveJSON(API_KEY_STORAGE, apiKey.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="tab">
      <header className="tab-head">
        <h1 className="display">Stats</h1>
        <p className="muted">Ta régularité sur les protéines.</p>
      </header>

      <div className="stat-grid">
        <section className="card stat-box">
          <span className="stat-emoji">🔥</span>
          <span className="stat-value">{streak}</span>
          <span className="muted">jour{streak > 1 ? 's' : ''} d'affilée</span>
        </section>
        <section className="card stat-box">
          <span className="stat-emoji">📊</span>
          <span className="stat-value">{average} g</span>
          <span className="muted">moyenne 7 j</span>
        </section>
      </div>

      <section className="card">
        <p className="conseil-title">7 derniers jours</p>
        <div className="chart">
          {last7.map((d, i) => {
            const h = Math.round((d.total / maxBar) * 100)
            const reached = d.total >= PROTEIN_GOAL
            return (
              <div className="chart-col" key={i}>
                <div className="chart-track">
                  <div
                    className={`chart-bar ${reached ? 'reached' : ''}`}
                    style={{ height: `${Math.max(2, h)}%` }}
                    title={`${d.total} g`}
                  />
                </div>
                <span className="chart-val">{d.total}</span>
                <span className="chart-label">{d.label}</span>
              </div>
            )
          })}
        </div>
        <div className="goal-line-legend">
          <span className="dot reached" /> objectif {PROTEIN_GOAL} g atteint
        </div>
      </section>

      <section className="card settings">
        <p className="conseil-title">Réglages — Clé API Anthropic</p>
        <p className="muted small-text">
          Nécessaire pour « Analyser ma journée ». Stockée uniquement sur cet appareil
          (localStorage).
        </p>
        <div className="qty-row">
          <input
            className="input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-…"
            autoComplete="off"
          />
          <button className="btn" onClick={save}>
            {saved ? '✓' : 'Enregistrer'}
          </button>
        </div>
        <p className="warn-text">
          ⚠️ La clé est exposée côté navigateur (appel direct à l'API). À usage strictement
          personnel — ne partage pas l'app publiquement avec ta clé en mémoire.
        </p>
      </section>
    </div>
  )
}
