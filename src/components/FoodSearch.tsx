import { useState, useEffect, useRef } from 'react';
import { C, FOOD_DB } from '../constants';

type FoodItem = typeof FOOD_DB[0];
export type AddedFood = { food: FoodItem; qty: number; label: string; prot: number };

function calcProt(food: FoodItem, qty: number) { return Math.round((food.protPer100 * qty) / 100); }

export default function FoodSearch({ onAdd }: { onAdd: (item: AddedFood) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [portion, setPortion] = useState<{ label: string; qty: number } | null>(null);
  const [customQty, setCustomQty] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDrop(false); return; }
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const hits = FOOD_DB.filter(f => {
      const n = f.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return n.includes(q) || f.cat.toLowerCase().includes(q);
    }).slice(0, 9);
    setResults(hits);
    setShowDrop(hits.length > 0 && !selected);
  }, [query, selected]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selectFood = (food: FoodItem) => {
    setSelected(food);
    setPortion(food.portions[Math.min(1, food.portions.length - 1)]);
    setCustomQty('');
    setQuery(food.name);
    setShowDrop(false);
  };

  const effectiveQty = customQty ? (parseInt(customQty) || 0) : (portion?.qty || 0);
  const previewProt = selected ? calcProt(selected, effectiveQty) : 0;

  const handleAdd = () => {
    if (!selected || effectiveQty <= 0) return;
    const label = customQty ? `${customQty}g` : portion!.label;
    onAdd({ food: selected, qty: effectiveQty, label, prot: previewProt });
    setSelected(null); setPortion(null); setQuery(''); setCustomQty('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const grouped = results.reduce((acc, f) => { (acc[f.cat] = acc[f.cat] || []).push(f); return acc; }, {} as Record<string, FoodItem[]>);

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surface2, border: `1px solid ${selected ? C.blue : C.border}`, borderRadius: 11, padding: '10px 14px', transition: 'border-color 0.2s' }}>
          <span style={{ fontSize: '1.1rem' }}>{selected ? selected.emoji : '🔍'}</span>
          <input ref={inputRef} value={query}
            onChange={e => { setQuery(e.target.value); if (selected) setSelected(null); }}
            onFocus={() => { if (results.length > 0 && !selected) setShowDrop(true); }}
            placeholder="poulet, whey, thon, œuf, saumon…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem' }} />
          {query && <button onClick={() => { setSelected(null); setPortion(null); setQuery(''); setCustomQty(''); setTimeout(() => inputRef.current?.focus(), 50); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: 0 }}>×</button>}
        </div>
        {showDrop && (
          <div ref={dropRef} style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 200, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.55)', maxHeight: 260, overflowY: 'auto' }}>
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div style={{ fontSize: '0.62rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '7px 13px 3px', background: C.surface2 }}>{cat}</div>
                {items.map(food => (
                  <div key={food.id} onClick={() => selectFood(food)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(96,165,250,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <span style={{ fontSize: '1.2rem', width: 28, textAlign: 'center' }}>{food.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 500 }}>{food.name}</div>
                      <div style={{ fontSize: '0.7rem', color: C.muted }}>{food.protPer100}g prot / 100g</div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1rem', color: C.green }}>{food.protPer100}g</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div className="fade-in" style={{ background: 'rgba(96,165,250,0.04)', border: `1px solid rgba(96,165,250,0.18)`, borderRadius: 11, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '1.3rem' }}>{selected.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{selected.name}</div>
              <div style={{ fontSize: '0.68rem', color: C.muted }}>{selected.protPer100}g de protéines / 100g</div>
            </div>
          </div>
          <div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Sélectionne une portion</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {selected.portions.map((p, i) => {
              const active = !customQty && portion?.qty === p.qty;
              return (
                <button key={i} onClick={() => { setPortion(p); setCustomQty(''); }}
                  style={{ padding: '6px 12px', borderRadius: 99, fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', background: active ? 'rgba(96,165,250,0.18)' : C.surface2, border: active ? `1px solid ${C.blue}` : `1px solid ${C.border}`, color: active ? C.blue : C.text, transition: 'all 0.15s' }}>
                  {p.label} <span style={{ color: C.green, fontSize: '0.7rem' }}>+{calcProt(selected, p.qty)}g</span>
                </button>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: customQty ? 'rgba(96,165,250,0.15)' : C.surface2, border: customQty ? `1px solid ${C.blue}` : `1px solid ${C.border}`, borderRadius: 99, padding: '0 10px 0 6px' }}>
              <input value={customQty} onChange={e => setCustomQty(e.target.value.replace(/\D/g, ''))}
                placeholder="Autre" style={{ width: 52, background: 'transparent', border: 'none', outline: 'none', color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: '0.76rem', padding: '7px 4px' }} />
              <span style={{ fontSize: '0.7rem', color: C.muted }}>g</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, background: C.surface2, borderRadius: 9, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', color: C.muted }}>Protéines :</span>
              <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.4rem', color: C.green }}>{previewProt}g</span>
              <span style={{ fontSize: '0.7rem', color: C.muted }}>pour {effectiveQty}g</span>
            </div>
            <button onClick={handleAdd} disabled={effectiveQty <= 0}
              style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: effectiveQty > 0 ? C.blue : C.surface2, color: effectiveQty > 0 ? '#0f1117' : C.muted, fontFamily: "'Bebas Neue',cursive", fontSize: '0.95rem', cursor: effectiveQty > 0 ? 'pointer' : 'not-allowed', fontWeight: 700, transition: 'all 0.15s' }}>
              Ajouter ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
