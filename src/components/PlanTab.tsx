import { useState } from 'react'
import type { EatenItem } from '../types'
import FoodPicker from './FoodPicker'
import {
  PROTEIN_GOAL,
  dayProteinTotal,
  getTodayMeals,
  setMealItems,
  type DayMeals,
} from '../lib/storage'

interface Meal {
  id: string
  name: string
  goal: number
  color: string
  conseil: string
  suggestions: string[]
}

const MEALS: Meal[] = [
  {
    id: 'petit-dej',
    name: 'Petit-déjeuner',
    goal: 42,
    color: '#e8ff47',
    conseil: 'Lance la machine tôt avec une base laitière + œufs.',
    suggestions: ['200 g fromage blanc 0%', '3 œufs entiers', '60 g flocons d\'avoine', '30 g whey'],
  },
  {
    id: 'collation',
    name: 'Collation',
    goal: 30,
    color: '#ff9f45',
    conseil: 'Snack dense et pratique entre les repas.',
    suggestions: ['1 boîte de thon', 'Skyr 250 g', '30 g amandes', '1 barre protéinée'],
  },
  {
    id: 'dejeuner',
    name: 'Déjeuner',
    goal: 52,
    color: '#5aa9ff',
    conseil: 'Le plus gros apport : viande/poisson maigre + glucides.',
    suggestions: ['180 g blanc de poulet', '150 g riz complet', '200 g brocoli', '40 g parmesan'],
  },
  {
    id: 'post-training',
    name: 'Post-training',
    goal: 36,
    color: '#b18cff',
    conseil: 'Protéines rapides juste après la séance.',
    suggestions: ['40 g isolat de whey', '1 banane', '250 g fromage blanc'],
  },
  {
    id: 'diner',
    name: 'Dîner',
    goal: 42,
    color: '#57d9a3',
    conseil: 'Repas complet, caséine lente possible avant le coucher.',
    suggestions: ['170 g saumon', '200 g patate douce', '150 g haricots verts', '30 g caséine'],
  },
]

export default function PlanTab() {
  const [meals, setMeals] = useState<DayMeals>(() => getTodayMeals())
  const [open, setOpen] = useState<string | null>(null)

  function update(mealId: string, items: EatenItem[]) {
    setMealItems(mealId, items)
    setMeals(getTodayMeals())
  }

  const total = dayProteinTotal(meals)
  const pct = Math.min(100, Math.round((total / PROTEIN_GOAL) * 100))

  return (
    <div className="tab">
      <header className="tab-head">
        <h1 className="display">Plan du jour</h1>
        <p className="muted">Coche ce que tu as vraiment mangé — l'objectif suit en direct.</p>
      </header>

      <section className="global-progress card">
        <div className="gp-top">
          <span className="gp-num">
            {Math.round(total)}<span className="gp-goal"> / {PROTEIN_GOAL} g</span>
          </span>
          <span className="gp-pct">{pct}%</span>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="gp-left">
          {total >= PROTEIN_GOAL
            ? '🔥 Objectif atteint, beau travail Eden !'
            : `Encore ${Math.round(PROTEIN_GOAL - total)} g à aller chercher.`}
        </p>
      </section>

      <div className="meal-list">
        {MEALS.map((meal) => {
          const items = meals[meal.id] ?? []
          const eaten = items.reduce((s, it) => s + it.protein, 0)
          const mealPct = Math.min(100, Math.round((eaten / meal.goal) * 100))
          const deficit = Math.max(0, meal.goal - eaten)
          const isOpen = open === meal.id
          return (
            <div
              key={meal.id}
              className={`card meal-card ${isOpen ? 'open' : ''}`}
              style={{ ['--meal' as string]: meal.color }}
            >
              <button className="meal-header" onClick={() => setOpen(isOpen ? null : meal.id)}>
                <span className="meal-dot" />
                <span className="meal-name">{meal.name}</span>
                <span className="meal-stat">
                  {Math.round(eaten)}/{meal.goal} g
                </span>
                <span className={`chev ${isOpen ? 'up' : ''}`}>⌄</span>
              </button>

              <div className="mini-bar">
                <div className="mini-fill" style={{ width: `${mealPct}%` }} />
              </div>
              {!isOpen && deficit > 0 && (
                <p className="deficit">déficit : {Math.round(deficit)} g</p>
              )}

              {isOpen && (
                <div className="meal-body">
                  <div className="conseil">
                    <p className="conseil-title">Conseil du plan</p>
                    <p className="muted">{meal.conseil}</p>
                    <div className="chips">
                      {meal.suggestions.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="conseil-title">Ce que j'ai vraiment mangé</p>
                  <FoodPicker
                    accent={meal.color}
                    placeholder="Rechercher (ex: 150g poulet, 3 œufs)…"
                    onAdd={(item) => update(meal.id, [...items, item])}
                  />

                  {items.length > 0 && (
                    <ul className="eaten-list">
                      {items.map((it) => (
                        <li key={it.id}>
                          <span className="eaten-name">{it.name}</span>
                          <span className="eaten-meta">
                            {Math.round(it.grams)} g · {Math.round(it.protein)} g prot.
                          </span>
                          <button
                            className="del"
                            onClick={() =>
                              update(
                                meal.id,
                                items.filter((x) => x.id !== it.id),
                              )
                            }
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {deficit > 0 ? (
                    <p className="deficit big">Déficit restant : {Math.round(deficit)} g</p>
                  ) : (
                    <p className="done">✓ Repas complété</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
