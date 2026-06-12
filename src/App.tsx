import { useState } from 'react';
import { C } from './constants';
import PlanTab from './components/PlanTab';
import TrackerTab from './components/TrackerTab';
import JawTab from './components/JawTab';
import StatsTab from './components/StatsTab';
import './index.css';

const TABS = [
  { id: 'plan',    label: 'Plan',    icon: '📋' },
  { id: 'tracker', label: 'Suivi IA', icon: '🧠' },
  { id: 'jaw',     label: 'Mâchoire', icon: '🦷' },
  { id: 'stats',   label: 'Stats',   icon: '📊' },
];

export default function App() {
  const [tab, setTab] = useState('plan');

  return (
    <div style={{ background: C.bg, minHeight: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 0', paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2.2rem', letterSpacing: 2, lineHeight: 1, marginBottom: 2 }}>
          PLAN <span style={{ color: C.accent }}>PHYSIQUE</span>
        </h1>
        <p style={{ color: C.muted, fontSize: '0.78rem', marginBottom: 16 }}>Recomposition · Ancien athlète · 88 kg</p>
      </div>

      {/* Content */}
      <div style={{ padding: '0 18px', paddingBottom: 90 }}>
        {tab === 'plan'    && <PlanTab />}
        {tab === 'tracker' && <TrackerTab />}
        {tab === 'jaw'     && <JawTab />}
        {tab === 'stats'   && <StatsTab />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'rgba(24,28,39,0.96)', backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'stretch',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            padding: '10px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            transition: 'opacity 0.15s'
          }}>
            <span style={{ fontSize: '1.2rem', filter: tab === t.id ? 'none' : 'grayscale(1) opacity(0.5)' }}>{t.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3px', color: tab === t.id ? C.accent : C.muted, transition: 'color 0.15s' }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 2, background: C.accent, borderRadius: 99, position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom) + 2px)' }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
