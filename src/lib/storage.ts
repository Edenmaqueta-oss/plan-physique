import type { EatenItem } from '../types'

/** Clé date locale au format YYYY-MM-DD (sert au reset automatique à minuit) */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateKeyOffset(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return todayKey(d)
}

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / mode privé : on ignore */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// ─────────────────────────────────────────────
//  PLAN — ce qu'on a vraiment mangé, par date
//  plan_meals_v2 : { [date]: { [mealId]: EatenItem[] } }
// ─────────────────────────────────────────────
export const PLAN_KEY = 'plan_meals_v2'
export type DayMeals = Record<string, EatenItem[]>
export type PlanStore = Record<string, DayMeals>

export function loadPlan(): PlanStore {
  return loadJSON<PlanStore>(PLAN_KEY, {})
}

export function getTodayMeals(): DayMeals {
  const store = loadPlan()
  return store[todayKey()] ?? {}
}

export function setMealItems(mealId: string, items: EatenItem[]): PlanStore {
  const store = loadPlan()
  const date = todayKey()
  const day = { ...(store[date] ?? {}) }
  day[mealId] = items
  store[date] = day
  saveJSON(PLAN_KEY, store)
  return store
}

/** Total protéines consommées un jour donné (toutes catégories de repas) */
export function dayProteinTotal(day: DayMeals | undefined): number {
  if (!day) return 0
  return Object.values(day).reduce(
    (sum, items) => sum + items.reduce((s, it) => s + it.protein, 0),
    0,
  )
}

// ─────────────────────────────────────────────
//  Réglages
// ─────────────────────────────────────────────
export const API_KEY_STORAGE = 'anthropic_api_key'
export const PROTEIN_GOAL = 202
