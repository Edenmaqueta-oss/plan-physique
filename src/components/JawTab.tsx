import { useState, useCallback } from 'react';
import { C, JAW_SECTIONS } from '../constants';
import { loadJawChecked, saveJawChecked, saveJawHistory } from '../storage';

export default function JawTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadJawChecked);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const allItems = JAW_SECTIONS.flatMap(s => s.items);
  const totalItems = allItems.length;
  const doneItems = allItems.filter(i => checked[i.id]).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  const toggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      saveJawChecked(next);
      saveJawHistory(next);
      return next;
    });
  }, []);

  const msgs = [
    { min: 0, max: 30, msg: 'Lance ta routine — la constance fait tout 💪' },
    { min: 31, max: 59, msg: 'Bon départ ! Continue sur cette lancée 🔥' },
    { min: 60, max: 79, msg: 'Plus de la moitié, ne t\'arrête pas 🎯' },
    { min: 80, max: 99, msg: 'Dernière ligne droite ⚡' },
    { min: 100, max: 100, msg: 'Routine complète ! Résultats garantis 🏆' },
  ];
  const msg = msgs.find(m => pct >= m.min && pct <= m.max);

  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.8rem', letterSpacing: 1.5, marginBottom: 3 }}>
          MÂCHOIRE <span style={{ color: C.accent }}>CARRÉE</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: C.muted }}>Routine quotidienne · Masséter + joues + posture · Résultats en 4–8 semaines</div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'linear-gradient(135deg,#1e2333,#252c3f)', border: `1px solid ${pct === 100 ? 'rgba(74,222,128,0.4)' : C.border}`, borderLeft: `4px solid ${pct === 100 ? C.green : C.accent}`, borderRadius: 12, padding: '14px 18px', marginBottom: 20, transition: 'border-color 0.4s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Progression du jour</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2rem', color: pct === 100 ? C.green : C.accent, lineHeight: 1 }}>{doneItems}<span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '1rem', color: C.muted }}>/{totalItems}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2rem', color: pct === 100 ? C.green : C.accent }}>{pct}%</div>
            <div style={{ fontSize: '0.7rem', color: C.muted }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>
        </div>
        <div style={{ background: C.surface2, borderRadius: 99, height: 10, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', borderRadius: 99, background: pct === 100 ? C.green : 'linear-gradient(90deg,#60a5fa,#e8ff47)', width: pct + '%', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize: '0.77rem', color: pct === 100 ? '#a7f3d0' : C.muted }}>{msg?.msg}</div>
      </div>

      {JAW_SECTIONS.map(section => {
        const done = section.items.filter(i => checked[i.id]).length;
        const total = section.items.length;
        const spct = Math.round((done / total) * 100);
        const isOpen = collapsed[section.id] !== true;
        return (
          <div key={section.id} style={{ background: C.surface, border: `1px solid ${done === total ? section.color + '55' : C.border}`, borderRadius: 14, marginBottom: 10, overflow: 'hidden', transition: 'border-color 0.3s' }}>
            <div onClick={() => setCollapsed(c => ({ ...c, [section.id]: isOpen }))}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', cursor: 'pointer', borderBottom: isOpen ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{section.title}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>{section.subtitle}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.05rem', color: done === total ? C.green : section.color }}>{done}/{total}</div>
                  <div style={{ background: C.surface2, borderRadius: 99, height: 4, width: 52, overflow: 'hidden', marginTop: 3 }}>
                    <div style={{ height: '100%', borderRadius: 99, background: done === total ? C.green : section.color, width: spct + '%', transition: 'width 0.4s' }} />
                  </div>
                </div>
                <span style={{ color: C.muted, fontSize: '0.75rem', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
              </div>
            </div>
            {isOpen && section.items.map((item, idx) => {
              const isDone = !!checked[item.id];
              return (
                <div key={item.id} onClick={() => toggle(item.id)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: idx === section.items.length - 1 ? 'none' : `1px solid ${C.border}`, cursor: 'pointer', background: isDone ? 'rgba(255,255,255,0.018)' : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isDone ? section.color : C.border}`, background: isDone ? section.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
                    {isDone && <span style={{ color: '#0f1117', fontSize: '0.75rem', fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '0.87rem', fontWeight: isDone ? 400 : 600, color: isDone ? C.muted : C.text, textDecoration: isDone ? 'line-through' : 'none', transition: 'all 0.2s', lineHeight: 1.4 }}>{item.label}</div>
                      <span style={{ fontSize: '0.62rem', padding: '2px 7px', borderRadius: 99, background: `${section.color}18`, color: section.color, fontWeight: 600, flexShrink: 0 }}>{item.duration}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: 5, lineHeight: 1.65 }}>{item.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ background: 'linear-gradient(135deg,#1e1a2e,#221e35)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: '14px 16px', marginTop: 4, fontSize: '0.79rem', color: '#c4b5fd', lineHeight: 1.75 }}>
        <strong style={{ color: C.purple }}>⏱ Résultats réalistes :</strong> Masséter et joues en 4–8 semaines. Mewing et posture : transformation structurelle sur 3–6 mois.
      </div>
    </div>
  );
}
