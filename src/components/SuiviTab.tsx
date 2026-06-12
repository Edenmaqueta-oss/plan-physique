import { useState } from 'react'
import type { EatenItem } from '../types'
import FoodPicker from './FoodPicker'
import { analyzeDay, type DayAnalysis } from '../lib/anthropic'
import { API_KEY_STORAGE, PROTEIN_GOAL, loadJSON, saveJSON, todayKey } from '../lib/storage'

const SUIVI_KEY = 'suivi_foods_v1'
type SuiviStore = Record<string, EatenItem[]>

function loadToday(): EatenItem[] {
  const store = loadJSON<SuiviStore>(SUIVI_KEY, {})
  return store[todayKey()] ?? []
}
function saveToday(items: EatenItem[]) {
  const store = loadJSON<SuiviStore>(SUIVI_KEY, {})
  store[todayKey()] = items
  saveJSON(SUIVI_KEY, store)
}

export default function SuiviTab() {
  const [items, setItems] = useState<EatenItem[]>(() => loadToday())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DayAnalysis | null>(null)

  function update(next: EatenItem[]) {
    setItems(next)
    saveToday(next)
    setAnalysis(null)
  }

  const total = Math.round(items.reduce((s, it) => s + it.protein, 0))
  const hasManual = items.some((it) => it.manual)

  async function runAnalysis() {
    const apiKey = loadJSON<string>(API_KEY_STORAGE, '')
    if (!apiKey) {
      setError("Aucune clé API. Ajoute ta clé Anthropic dans l'onglet Stats → Réglages.")
      return
    }
    setLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const result = await analyzeDay(apiKey, items)
      setAnalysis(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tab">
      <header className="tab-head">
        <h1 className="display">Suivi IA</h1>
        <p className="muted">Note tout ce que tu manges, puis laisse l'IA analyser ta journée.</p>
      </header>

      <section className="card suivi-counter">
        <span className="gp-num">
          {total}
          <span className="gp-goal"> / {PROTEIN_GOAL} g</span>
        </span>
        <span className="muted">
          {items.length} aliment{items.length > 1 ? 's' : ''}
          {hasManual ? ' · estimation IA incluse' : ''}
        </span>
      </section>

      <section className="card">
        <FoodPicker
          showCategory
          allowManual
          placeholder="Chercher dans toute la base (70+ aliments)…"
          onAdd={(item) => update([...items, item])}
        />
      </section>

      {items.length > 0 && (
        <ul className="eaten-list standalone">
          {items.map((it) => (
            <li key={it.id}>
              <span className="eaten-name">
                {it.name}
                {it.manual && <span className="badge">manuel</span>}
              </span>
              <span className="eaten-meta">
                {Math.round(it.grams)} g · {it.manual ? '≈ IA' : `${Math.round(it.protein)} g`}
              </span>
              <button className="del" onClick={() => update(items.filter((x) => x.id !== it.id))}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className="btn block big-cta" onClick={runAnalysis} disabled={loading || items.length === 0}>
        {loading ? 'Analyse en cours…' : '✦ Analyser ma journée'}
      </button>

      {error && <p className="error">{error}</p>}

      {analysis && (
        <section className="card analysis">
          <div className="analysis-top">
            <div>
              <p className="muted">Total estimé</p>
              <p className="analysis-big">{analysis.totalProteines} g</p>
            </div>
            <div>
              <p className="muted">Qualité</p>
              <p className="analysis-big">{analysis.scoreQualite}/100</p>
            </div>
          </div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${analysis.scoreQualite}%` }} />
          </div>
          <p className="analysis-resume">{analysis.resume}</p>
          {analysis.suggestions.length > 0 && (
            <>
              <p className="conseil-title">Pour combler le déficit</p>
              <ul className="sugg-list">
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>→ {s}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  )
}
