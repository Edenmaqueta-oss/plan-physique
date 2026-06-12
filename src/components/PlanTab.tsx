import { useState, useEffect } from 'react';
import { C, MEALS_DATA, GOAL } from '../constants';

export default function PlanTab() {
  const [open, setOpen] = useState<number | null>(null);
  const [filled, setFilled] = useState(false);
  useEffect(() => { setTimeout(() => setFilled(true), 600); }, []);

  return (
    <div style={{ padding: '0 0 100px' }}>
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg,#1e2333,#252c3f)', border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.accent}`, borderRadius: 12, padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Objectif journalier</div>
          <div style={{ fontSize: '0.8rem', marginTop: 2 }}>2,2–2,5 g × 88 kg</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2.1rem', color: C.accent }}>{GOAL} <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.82rem', color: C.muted }}>g / jour</span></div>
        </div>
      </div>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: C.muted, marginBottom: 6 }}><span>Plan complet</span><span>{GOAL}/{GOAL}g</span></div>
        <div style={{ background: C.surface2, borderRadius: 99, height: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#ff6b35,#e8ff47)', width: filled ? '100%' : '0%', transition: 'width 1s ease' }} />
        </div>
      </div>
      {/* Meal cards */}
      {MEALS_DATA.map((meal, i) => {
        const pct = Math.round((meal.protein / GOAL) * 100);
        const isOpen = open === i;
        return (
          <div key={i} onClick={() => setOpen(isOpen ? null : i)}
            style={{ background: isOpen ? '#1d2235' : C.surface, border: `1px solid ${isOpen ? meal.color : C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: meal.color, borderRadius: '4px 0 0 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: '1.4rem', width: 34, textAlign: 'center' }}>{meal.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {meal.title}
                  {meal.tag && <span style={{ display: 'inline-block', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 99, fontWeight: 600, textTransform: 'uppercase', marginLeft: 6, verticalAlign: 'middle', background: 'rgba(232,255,71,0.1)', color: C.accent }}>{meal.tag}</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: C.muted }}>{meal.time}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.6rem', color: meal.color, lineHeight: 1, textAlign: 'right' }}>~{meal.protein}<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.62rem', color: C.muted }}>g</span></div>
                <div style={{ fontSize: '0.65rem', color: C.muted, textAlign: 'right' }}>{pct}% du total</div>
              </div>
            </div>
            {isOpen && (
              <div className="fade-in" style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                {meal.foods.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: j === meal.foods.length - 1 ? 'none' : `1px solid ${C.border}`, fontSize: '0.84rem' }}>
                    <div><div>{f.name}</div><div style={{ color: C.muted, fontSize: '0.72rem' }}>{f.qty}</div></div>
                    <div style={{ fontWeight: 600, color: meal.color }}>~{f.prot}g</div>
                  </div>
                ))}
                <div style={{ background: C.surface2, borderRadius: 99, height: 5, overflow: 'hidden', marginTop: 10 }}>
                  <div style={{ height: '100%', borderRadius: 99, background: meal.color, width: pct + '%', opacity: 0.7 }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginTop: 16, background: 'linear-gradient(135deg,#1a2010,#1c2412)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12, padding: '13px 15px', fontSize: '0.8rem', color: '#a7f3d0', lineHeight: 1.7 }}>
        <strong style={{ color: C.green }}>💡 Règle des 40g au petit-déjeuner :</strong> Stoppe le catabolisme nocturne et déclenche la synthèse musculaire dès le réveil. Ne le saute jamais.
      </div>
    </div>
  );
}
