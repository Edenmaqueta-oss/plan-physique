import { useMemo, useState } from 'react'
import type { Category, EatenItem, Food } from '../types'
import { CATEGORIES, searchFoods } from '../data/foods'
import { uid } from '../lib/storage'

interface Props {
  onAdd: (item: EatenItem) => void
  showCategory?: boolean
  allowManual?: boolean
  placeholder?: string
  accent?: string
}

export default function FoodPicker({
  onAdd,
  showCategory = false,
  allowManual = false,
  placeholder = 'Rechercher un aliment…',
  accent = 'var(--accent)',
}: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [selected, setSelected] = useState<Food | null>(null)
  const [mode, setMode] = useState<'g' | 'unit'>('g')
  const [qty, setQty] = useState<string>('100')
  const [manualGrams, setManualGrams] = useState<string>('100')

  const results = useMemo(() => searchFoods(query, category).slice(0, 8), [query, category])

  function pick(food: Food) {
    setSelected(food)
    if (food.unit) {
      setMode('unit')
      setQty('1')
    } else {
      setMode('g')
      setQty('100')
    }
  }

  function reset() {
    setSelected(null)
    setQuery('')
    setQty('100')
  }

  const preview = useMemo(() => {
    if (!selected) return null
    const n = parseFloat(qty.replace(',', '.')) || 0
    const grams = mode === 'unit' && selected.unit ? n * selected.unit.grams : n
    const protein = (grams * selected.protein) / 100
    return { grams, protein }
  }, [selected, qty, mode])

  function confirm() {
    if (!selected || !preview || preview.grams <= 0) return
    onAdd({
      id: uid(),
      foodId: selected.id,
      name: selected.name,
      grams: preview.grams,
      protein: preview.protein,
    })
    reset()
  }

  function addManual() {
    const grams = parseFloat(manualGrams.replace(',', '.')) || 0
    const name = query.trim()
    if (!name || grams <= 0) return
    onAdd({
      id: uid(),
      foodId: null,
      name,
      grams,
      protein: 0, // estimé par l'IA
      manual: true,
    })
    setManualGrams('100')
    setQuery('')
  }

  return (
    <div className="picker">
      <div className="picker-row">
        <input
          className="input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(null)
          }}
          placeholder={placeholder}
        />
        {showCategory && (
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | 'all')}
          >
            <option value="all">Toutes</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {!selected && query && (
        <ul className="results">
          {results.map((f) => (
            <li key={f.id}>
              <button className="result-btn" onClick={() => pick(f)}>
                <span>{f.name}</span>
                <span className="result-meta">
                  {f.protein}g/100g{f.unit ? ` · 1 ${f.unit.label}=${f.unit.grams}g` : ''}
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && allowManual && (
            <li>
              <div className="manual">
                <span>
                  Aucun résultat. Ajouter « {query.trim()} » ?
                </span>
                <div className="qty-row">
                  <input
                    className="input small"
                    type="number"
                    inputMode="decimal"
                    value={manualGrams}
                    onChange={(e) => setManualGrams(e.target.value)}
                  />
                  <span className="unit-label">g</span>
                  <button className="btn" style={{ background: accent }} onClick={addManual}>
                    Ajouter (IA estime)
                  </button>
                </div>
              </div>
            </li>
          )}
          {results.length === 0 && !allowManual && (
            <li className="empty">Aucun résultat dans la base.</li>
          )}
        </ul>
      )}

      {selected && preview && (
        <div className="qty-panel">
          <div className="qty-head">
            <strong>{selected.name}</strong>
            <button className="link" onClick={reset}>
              changer
            </button>
          </div>

          {selected.unit && (
            <div className="mode-toggle">
              <button
                className={mode === 'g' ? 'toggle on' : 'toggle'}
                onClick={() => {
                  setMode('g')
                  setQty('100')
                }}
              >
                Grammes
              </button>
              <button
                className={mode === 'unit' ? 'toggle on' : 'toggle'}
                onClick={() => {
                  setMode('unit')
                  setQty('1')
                }}
              >
                Unités ({selected.unit.label})
              </button>
            </div>
          )}

          <div className="qty-row">
            <input
              className="input small"
              type="number"
              inputMode="decimal"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <span className="unit-label">
              {mode === 'unit' && selected.unit ? selected.unit.label + '(s)' : 'g'}
            </span>
            <div className="preview-pill" style={{ borderColor: accent, color: accent }}>
              {Math.round(preview.protein)} g protéines
              {mode === 'unit' && selected.unit ? ` · ${Math.round(preview.grams)} g` : ''}
            </div>
          </div>

          <button className="btn block" style={{ background: accent }} onClick={confirm}>
            + Ajouter
          </button>
        </div>
      )}
    </div>
  )
}
