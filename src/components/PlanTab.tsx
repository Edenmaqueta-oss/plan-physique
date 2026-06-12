import { useState } from 'react'
import type { EatenItem } from '../types'
import FoodPicker from './FoodPicker'
import { FOOD_BY_ID } from '../data/foods'
import {
  PROTEIN_GOAL,
  dayProteinTotal,
  getTodayMeals,
  setMealItems,
  uid,
  type DayMeals,
} from '../lib/storage'

/** Suggestion structurée → ajoutable d'un tap */
interface Suggestion {
  foodId: string
  qty: number
  mode: 'g' | 'unit'
}

interface Meal {
  id: string
  name: string
  goal: number
  color: string
  conseil: string
  suggestions: Suggestion[]
}

const MEALS: Meal[] = [
  {
    id: 'petit-dej',
    name: 'Petit-déjeuner',
    goal: 42,
    color: '#e8ff47',
    conseil: 'Lance la machine tôt avec une base laitière + œufs.',
    suggestions: [
      { foodId: 'fromage-blanc', qty: 200, mode: 'g' },
      { foodId: 'oeuf', qty: 3, mode: 'unit' },
      { foodId: 'avoine', qty: 60, mode: 'g' },
      { foodId: 'whey', qty: 30, mode: 'g' },
    ],
  },
  {
    id: 'collation',
    name: 'Collation',
    goal: 30,
    color: '#ff9f45',
    conseil: 'Snack dense et pratique entre les repas.',
    suggestions: [
      { foodId: 'thon-boite', qty: 1, mode: 'unit' },
      { foodId: 'skyr', qty: 250, mode: 'g' },
      { foodId: 'amandes', qty: 30, mode: 'g' },
      { foodId: 'barre-proteinee', qty: 1, mode: 'unit' },
    ],
  },
  {
    id: 'dejeuner',
    name: 'Déjeuner',
    goal: 52,
    color: '#5aa9ff',
    conseil: 'Le plus gros apport : viande/poisson maigre + glucides.',
    suggestions: [
      { foodId: 'blanc-poulet', qty: 180, mode: 'g' },
      { foodId: 'riz-complet', qty: 150, mode: 'g' },
      { foodId: 'brocoli', qty: 200, mode: 'g' },
      { foodId: 'parmesan', qty: 40, mode: 'g' },
    ],
  },
  {
    id: 'post-training',
    name: 'Post-training',
    goal: 36,
    color: '#b18cff',
    conseil: 'Protéines rapides juste après la séance.',
    suggestions: [
      { foodId: 'isolat', qty: 40, mode: 'g' },
      { foodId: 'banane', qty: 1, mode: 'unit' },
      { foodId: 'fromage-blanc', qty: 250, mode: 'g' },
    ],
  },
  {
    id: 'diner',
    name: 'Dîner',
    goal: 42,
    color: '#57d9a3',
    conseil: 'Repas complet, caséine lente possible avant le coucher.',
    suggestions: [
      { foodId: 'saumon', qty: 170, mode: 'g' },
      { foodId: 'patate-douce', qty: 200, mode: 'g' },
      { foodId: 'haricot-vert', qty: 150, mode: 'g' },
      { foodId: 'caseine', qty: 30, mode: 'g' },
    ],
  },
]

/** Construit un EatenItem + son libellé à partir d'une suggestion */
function buildSuggestion(s: Suggestion): { item: EatenItem; label: string } {
  const food = FOOD_BY_ID[s.foodId]
  const grams = s.mode === 'unit' && food.unit ? s.qty * food.unit.grams : s.qty
  const protein = (grams * food.protein) / 100
  const label =
    s.mode === 'unit' && food.unit
      ? `${s.qty} × ${food.name.toLowerCase()}`
      : `${s.qty} g ${food.name.toLowerCase()}`
  return { item: { id: uid(), foodId: food.id, name: food.name, grams, protein }, label }
}

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
                      {meal.suggestions.map((s, i) => {
                        const { item, label } = buildSuggestion(s)
                        return (
                          <button
                            key={i}
                            className="chip chip-add"
                            onClick={() => update(meal.id, [...items, item])}
                          >
                            <span className="chip-plus">+</span> {label}
                          </button>
                        )
                      })}
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
