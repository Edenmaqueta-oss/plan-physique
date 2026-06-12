import { useMemo, useState } from 'react'
import { loadJSON, saveJSON, todayKey } from '../lib/storage'

const MACHOIRE_KEY = 'machoire_v1'
type Checks = Record<string, boolean>
type Store = Record<string, Checks>

interface Item {
  t: string
  info: string
}

interface Section {
  id: string
  title: string
  icon: string
  items: Item[]
}

const SECTIONS: Section[] = [
  {
    id: 'exos',
    title: 'Exercices de mâchoire',
    icon: '🦷',
    items: [
      {
        t: 'Chewing-gum Falim (10–15 min/côté)',
        info: 'Mâche un chewing-gum très dur (type Falim) 10 à 15 min de chaque côté. Ça muscle les masséters et dessine la mâchoire. Alterne bien les côtés pour rester symétrique. Arrête si tu sens une douleur à l\'articulation.',
      },
      {
        t: 'Jaw clenching — séries de contractions',
        info: 'Serre fermement les dents 5–10 s puis relâche. Fais 3 séries de 10 à 15 contractions. Tu dois sentir les muscles sur les côtés de la mâchoire travailler. Ne force pas si tu as mal aux dents.',
      },
      {
        t: 'Mentonnière / résistance menton',
        info: 'Place ton poing sous le menton et pousse vers le bas avec la mâchoire contre la résistance de la main. 3 × 10 répétitions. Renforce les muscles sous la mâchoire et la ligne mandibulaire.',
      },
      {
        t: 'Mastication consciente des deux côtés',
        info: 'Pendant les repas, mâche lentement et de façon égale des deux côtés. Évite de toujours mastiquer du même côté pour garder une musculature symétrique.',
      },
    ],
  },
  {
    id: 'joues',
    title: 'Creuser les joues',
    icon: '😗',
    items: [
      {
        t: 'Fish face (10 × 10 s)',
        info: 'Aspire les joues vers l\'intérieur (bouche de poisson) et tiens 10 s. Répète 10 fois. Travaille les muscles des joues pour un visage plus creusé.',
      },
      {
        t: 'Smiling fish face',
        info: 'Même chose que la fish face, mais en souriant en même temps. Ajoute le travail des zygomatiques (les muscles du sourire).',
      },
      {
        t: 'Gua Sha contour visage',
        info: 'Avec une pierre Gua Sha et un peu d\'huile, masse en remontant de la mâchoire vers l\'oreille. Draine la rétention d\'eau et affine l\'ovale du visage. Toujours du centre vers l\'extérieur.',
      },
      {
        t: 'Aspiration joues + sourire forcé',
        info: 'Aspire les joues puis force un large sourire en gardant l\'aspiration. Maintiens quelques secondes. Combine le creux des joues et le tonus du sourire.',
      },
    ],
  },
  {
    id: 'posture',
    title: 'Posture langue & tête',
    icon: '👅',
    items: [
      {
        t: 'Mewing — langue au palais toute la journée',
        info: 'Pose toute la langue (pointe ET dos) contre le palais, dents légèrement en contact, lèvres fermées. À garder en permanence. Améliore le maintien de la mâchoire et l\'ovale du visage sur le long terme.',
      },
      {
        t: 'Respiration nasale exclusive',
        info: 'Respire uniquement par le nez, jamais par la bouche. Ça soutient le mewing et une bonne posture de langue. La respiration par la bouche relâche le bas du visage.',
      },
      {
        t: 'Tête haute, menton rentré',
        info: 'Garde la tête droite et le menton légèrement rentré (pas vers le haut, pas en avant). Évite le « tech neck » (tête penchée sur le téléphone) qui crée un double menton.',
      },
      {
        t: 'Pas de tongue posture avachie',
        info: 'Évite de laisser la langue posée au fond ou en bas de la bouche : ça relâche le bas du visage. Reviens toujours en position mewing (langue collée au palais).',
      },
    ],
  },
  {
    id: 'nutrition',
    title: 'Nutrition visage sec',
    icon: '💧',
    items: [
      {
        t: 'Sel réduit (rétention d\'eau)',
        info: 'Limite le sel : il provoque de la rétention d\'eau qui gonfle le visage. Méfie-toi des plats industriels, de la charcuterie et des snacks salés.',
      },
      {
        t: 'Eau ≥ 3 L',
        info: 'Bois au moins 3 L d\'eau par jour. Paradoxalement, bien s\'hydrater réduit la rétention d\'eau et aide à affiner le visage.',
      },
      {
        t: 'Zéro alcool',
        info: 'L\'alcool déshydrate et fait gonfler le visage, surtout le lendemain. Zéro alcool = visage plus sec et plus net.',
      },
      {
        t: 'Sucre limité',
        info: 'Limite le sucre : il favorise l\'inflammation et la rétention d\'eau. Privilégie des aliments peu transformés.',
      },
    ],
  },
  {
    id: 'training',
    title: 'Entraînement & sèche',
    icon: '🏋️',
    items: [
      {
        t: 'Séance muscu faite',
        info: 'Coche quand ta séance de musculation du jour est faite. L\'entraînement global soutient la sèche et donc la définition du visage.',
      },
      {
        t: 'Déficit calorique respecté',
        info: 'Mange un peu moins de calories que ce que tu dépenses pour perdre du gras, visage compris. C\'est ce déficit qui révèle la structure de la mâchoire.',
      },
      {
        t: 'Protéines ≥ 202 g',
        info: 'Atteins ton objectif de 202 g de protéines (voir l\'onglet Plan). Les protéines préservent le muscle pendant la sèche.',
      },
    ],
  },
  {
    id: 'reco',
    title: 'Récupération',
    icon: '😴',
    items: [
      {
        t: 'Sommeil 7–8 h',
        info: 'Dors 7 à 8 h. Un bon sommeil régule les hormones (notamment le cortisol) et limite le gonflement du visage.',
      },
      {
        t: 'Tête surélevée la nuit',
        info: 'Dors avec la tête légèrement surélevée (un oreiller en plus). Ça évite que les liquides s\'accumulent dans le visage la nuit → moins de gonflement au réveil.',
      },
      {
        t: 'Écrans coupés avant le coucher',
        info: 'Coupe les écrans 30 à 60 min avant de dormir. Un sommeil de meilleure qualité aide la récupération et le visage sec.',
      },
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
  const [openInfo, setOpenInfo] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    const next = { ...checks, [key]: !checks[key] }
    setChecks(next)
    const store = loadJSON<Store>(MACHOIRE_KEY, {})
    store[todayKey()] = next
    saveJSON(MACHOIRE_KEY, store)
  }

  function toggleInfo(key: string) {
    setOpenInfo((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const doneCount = useMemo(() => Object.values(checks).filter(Boolean).length, [checks])
  const pct = Math.round((doneCount / TOTAL_ITEMS) * 100)

  return (
    <div className="tab">
      <header className="tab-head">
        <h1 className="display">Mâchoire carrée</h1>
        <p className="muted">Routine quotidienne — se remet à zéro chaque jour à minuit. Touche un exercice pour voir comment le faire.</p>
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
                const isOpen = !!openInfo[key]
                return (
                  <li key={key} className="check-item">
                    <div className={`check ${on ? 'on' : ''}`}>
                      <button
                        type="button"
                        className="box-btn"
                        onClick={() => toggle(key)}
                        aria-label={on ? 'Décocher' : 'Cocher'}
                        aria-pressed={on}
                      >
                        <span className="box" />
                      </button>
                      <button
                        type="button"
                        className="check-text-btn"
                        onClick={() => toggleInfo(key)}
                        aria-expanded={isOpen}
                      >
                        <span className="check-text">{item.t}</span>
                        <span className={`info-ico ${isOpen ? 'open' : ''}`}>{isOpen ? '▲' : 'ⓘ'}</span>
                      </button>
                    </div>
                    {isOpen && <p className="exo-info">{item.info}</p>}
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
