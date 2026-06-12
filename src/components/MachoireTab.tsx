import { useMemo, useState } from 'react'
import { loadJSON, saveJSON, todayKey } from '../lib/storage'

const MACHOIRE_KEY = 'machoire_v1'
type Checks = Record<string, boolean>
type Store = Record<string, Checks>

interface Section {
  id: string
  title: string
  icon: string
  items: string[]
}

const SECTIONS: Section[] = [
  {
    id: 'exos',
    title: 'Exercices de mâchoire',
    icon: '🦷',
    items: [
      'Chewing-gum Falim (10–15 min/côté)',
      'Jaw clenching — séries de contractions',
      'Mentonnière / résistance menton',
      'Mastication consciente des deux côtés',
    ],
  },
  {
    id: 'joues',
    title: 'Creuser les joues',
    icon: '😗',
    items: [
      'Fish face (10 × 10 s)',
      'Smiling fish face',
      'Gua Sha contour visage',
      'Aspiration joues + sourire forcé',
    ],
  },
  {
    id: 'posture',
    title: 'Posture langue & tête',
    icon: '👅',
    items: [
      'Mewing — langue au palais toute la journée',
      'Respiration nasale exclusive',
      'Tête haute, menton rentré',
      'Pas de tongue posture avachie',
    ],
  },
  {
    id: 'nutrition',
    title: 'Nutrition visage sec',
    icon: '💧',
    items: [
      'Sel réduit (rétention d\'eau)',
      'Eau ≥ 3 L',
      'Zéro alcool',
      'Sucre limité',
    ],
  },
  {
    id: 'training',
    title: 'Entraînement & sèche',
    icon: '🏋️',
    items: [
      'Séance muscu faite',
      'Déficit calorique respecté',
      'Protéines ≥ 202 g',
    ],
  },
  {
    id: 'reco',
    title: 'Récupération',
    icon: '😴',
    items: [
      'Sommeil 7–8 h',
      'Tête surélevée la nuit',
      'Écrans coupés avant le coucher',
    ],
  },
]

const TOTAL_ITEMS = SECTIONS.reduce((s, sec) => s + sec.items.length, 0)

function loadToday(): Checks {
  const store = loadJSON<Store>(MACHOIRE_KEY, {})
  return store[todayKey()] ?? {}
}

export default function MachoireTab() {
  const [checks, setChecks] = useState<Checks>(() => loadToday())

  function toggle(key: string) {
    const next = { ...checks, [key]: !checks[key] }
    setChecks(next)
    const store = loadJSON<Store>(MACHOIRE_KEY, {})
    store[todayKey()] = next
    saveJSON(MACHOIRE_KEY, store)
  }

  const doneCount = useMemo(() => Object.values(checks).filter(Boolean).length, [checks])
  const pct = Math.round((doneCount / TOTAL_ITEMS) * 100)

  return (
    <div className="tab">
      <header className="tab-head">
        <h1 className="display">Mâchoire carrée</h1>
        <p className="muted">Routine quotidienne — se remet à zéro chaque jour à minuit.</p>
      </header>

      <section className="global-progress card">
        <div className="gp-top">
          <span className="gp-num">
            {doneCount}
            <span className="gp-goal"> / {TOTAL_ITEMS}</span>
          </span>
          <span className="gp-pct">{pct}%</span>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {SECTIONS.map((sec) => {
        const done = sec.items.filter((_, i) => checks[`${sec.id}-${i}`]).length
        return (
          <section key={sec.id} className="card check-section">
            <div className="check-head">
              <span className="check-icon">{sec.icon}</span>
              <h2>{sec.title}</h2>
              <span className="check-count">
                {done}/{sec.items.length}
              </span>
            </div>
            <ul className="check-list">
              {sec.items.map((item, i) => {
                const key = `${sec.id}-${i}`
                const on = !!checks[key]
                return (
                  <li key={key}>
                    <label className={`check ${on ? 'on' : ''}`}>
                      <input type="checkbox" checked={on} onChange={() => toggle(key)} />
                      <span className="box" />
                      <span className="check-text">{item}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
