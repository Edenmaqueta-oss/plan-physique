import { useState } from 'react';
import { C, GOAL } from '../constants';
import { loadProteinHistory, loadAllJawHistory, getStreak, loadApiKey, saveApiKey } from '../storage';

export default function StatsTab() {
  const history = loadProteinHistory();
  const jawHistory = loadAllJawHistory();
  const streak = getStreak(history, jawHistory);
  const last7 = history.slice(-7);
  const avg7 = last7.length ? Math.round(last7.reduce((s, d) => s + d.total, 0) / last7.length) : 0;
  const maxStreak = streak; // simplified
  const jawWeekDone = jawHistory.filter(j => {
    const d = new Date(j.date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 3600 * 1000;
  });
  const jawWeekPct = jawWeekDone.length ? Math.round(jawWeekDone.reduce((s, j) => s + (Object.values(j.checked || {}).filter(Boolean).length / 24) * 100, 0) / jawWeekDone.length) : 0;

  const [apiKey, setApiKey] = useState(loadApiKey);
  const [saved, setSaved] = useState(false);

  const saveKey = () => { saveApiKey(apiKey); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const barMax = Math.max(GOAL, ...last7.map(d => d.total), 1);

  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.8rem', letterSpacing: 1.5, marginBottom: 3 }}>
        PROGRESSION <span style={{ color: C.accent }}>& STATS</span>
      </div>
      <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: 20 }}>Historique · Streak · Réglages API</div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Streak actuel', value: streak + ' 🔥', color: C.orange, sub: 'jours consécutifs' },
          { label: 'Moy. protéines 7j', value: avg7 + 'g', color: C.blue, sub: `objectif ${GOAL}g` },
          { label: 'Meilleur streak', value: maxStreak + ' ⚡', color: C.accent, sub: 'jours' },
          { label: 'Mâchoire semaine', value: jawWeekPct + '%', color: C.pink, sub: 'checklist moyenne' },
        ].map((kpi, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', borderTop: `3px solid ${kpi.color}` }}>
            <div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.8rem', color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 3 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* 7-day protein chart */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 16px 12px', marginBottom: 16 }}>
        <div style={{ fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>📊 Protéines — 7 derniers jours</div>
        {last7.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, fontSize: '0.82rem', padding: '20px 0' }}>Aucune donnée encore — commence à tracker dans l'onglet Suivi IA</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
            {last7.map((d, i) => {
              const h = Math.max(4, Math.round((d.total / barMax) * 100));
              const ok = d.total >= d.goal;
              const day = new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' });
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: '0.65rem', color: ok ? C.green : C.muted, fontWeight: 600 }}>{d.total}g</div>
                  <div style={{ width: '100%', height: h + '%', background: ok ? C.green : C.surface2, borderRadius: '4px 4px 0 0', minHeight: 4, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: ok ? 'linear-gradient(180deg,#4ade80,#22c55e)' : 'linear-gradient(180deg,#3a4060,#2a3050)' }} />
                  </div>
                  <div style={{ fontSize: '0.6rem', color: C.muted }}>{day}</div>
                </div>
              );
            })}
            {/* Goal line label */}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <div style={{ width: 20, height: 2, background: C.accent, borderRadius: 99 }} />
          <span style={{ fontSize: '0.68rem', color: C.muted }}>Objectif {GOAL}g</span>
          <div style={{ width: 12, height: 12, background: C.green, borderRadius: 3, marginLeft: 10 }} />
          <span style={{ fontSize: '0.68rem', color: C.muted }}>Objectif atteint</span>
        </div>
      </div>

      {/* Install banner */}
      <div style={{ background: 'linear-gradient(135deg,#1e2333,#252c3f)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>📲 Installer l'app sur ton téléphone</div>
        <div style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.7 }}>
          <strong style={{ color: C.text }}>iPhone :</strong> Ouvre dans Safari → icône Partager → <strong style={{ color: C.accent }}>Ajouter à l'écran d'accueil</strong><br />
          <strong style={{ color: C.text }}>Android :</strong> Menu Chrome ⋮ → <strong style={{ color: C.accent }}>Ajouter à l'écran d'accueil</strong>
        </div>
      </div>

      {/* API Key settings */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>⚙️ Clé API Anthropic</div>
        <div style={{ fontSize: '0.76rem', color: C.muted, marginBottom: 12 }}>Nécessaire pour le Suivi IA. Va sur console.anthropic.com → API Keys.</div>
        <input value={apiKey} onChange={e => setApiKey(e.target.value)} type="password" placeholder="sk-ant-..."
          style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 9, padding: '10px 13px', color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: '0.86rem', outline: 'none', marginBottom: 10 }} />
        <button onClick={saveKey}
          style={{ width: '100%', padding: 10, background: saved ? 'rgba(74,222,128,0.15)' : 'rgba(232,255,71,0.1)', border: `1px solid ${saved ? C.green : 'rgba(232,255,71,0.3)'}`, borderRadius: 9, color: saved ? C.green : C.accent, fontFamily: "'Bebas Neue',cursive", fontSize: '1rem', cursor: 'pointer', letterSpacing: 1 }}>
          {saved ? '✓ SAUVEGARDÉ' : 'SAUVEGARDER LA CLÉ'}
        </button>
      </div>
    </div>
  );
}
