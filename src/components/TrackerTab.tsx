import { useState } from 'react';
import { C, GOAL } from '../constants';
import FoodSearch, { AddedFood } from './FoodSearch';
import { saveProteinDay, loadApiKey } from '../storage';

export default function TrackerTab() {
  const [foods, setFoods] = useState<AddedFood[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const total = foods.reduce((s, f) => s + f.prot, 0);
  const pct = Math.min(100, Math.round((total / GOAL) * 100));
  const missing = Math.max(0, GOAL - total);

  const handleAdd = (item: AddedFood) => { setFoods(prev => [...prev, item]); setResult(null); };
  const remove = (i: number) => { setFoods(prev => prev.filter((_, j) => j !== i)); setResult(null); };
  const reset = () => { setFoods([]); setResult(null); setError(''); };

  const analyze = async () => {
    if (!foods.length) return;
    const apiKey = loadApiKey();
    if (!apiKey) { setError('Clé API manquante — va dans Réglages pour la saisir.'); return; }
    setLoading(true); setResult(null); setError('');
    const foodList = foods.map(f => `${f.food.name} (${f.label}, ~${f.prot}g)`).join(', ');
    const prompt = `Ancien joueur de water polo (88 kg, recomposition corporelle). A mangé : ${foodList}. Total : ${total}g. Objectif : ${GOAL}g/jour. Réponds UNIQUEMENT en JSON sans backticks : {"quality_score":"BON|MOYEN|INSUFFISANT","quality_note":"<2-3 lignes>","suggestions":[{"food":"<aliment>","qty":"<qté>","protein_g":<int>},{"food":"<aliment>","qty":"<qté>","protein_g":<int>},{"food":"<aliment>","qty":"<qté>","protein_g":<int>}],"suggestions_note":"<1-2 lignes>"}`;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 700, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error?.message || 'Erreur API ' + resp.status);
      const raw = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setResult(parsed);
      saveProteinDay(total, GOAL);
    } catch (e: any) { setError('Erreur : ' + e.message); }
    finally { setLoading(false); }
  };

  const scoreType = result ? (result.quality_score === 'BON' ? 'good' : result.quality_score === 'MOYEN' ? 'ok' : 'bad') : null;
  const scoreColor = scoreType === 'good' ? C.green : scoreType === 'ok' ? C.orange : C.red;
  const icons: Record<string, string> = { BON: '✅', MOYEN: '⚠️', INSUFFISANT: '❌' };

  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.7rem', letterSpacing: 1.5, marginBottom: 3 }}>
          SUIVI <span style={{ color: C.blue }}>IA</span>
          <span style={{ display: 'inline-block', fontSize: '0.6rem', padding: '2px 8px', borderRadius: 99, fontWeight: 600, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: C.purple, marginLeft: 8, verticalAlign: 'middle' }}>✦ Claude</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: C.muted }}>Recherche un aliment → choisis la portion → l'IA analyse et suggère.</div>
      </div>

      {foods.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: C.muted, marginBottom: 6 }}>
            <span>Protéines aujourd'hui</span>
            <span style={{ color: pct >= 100 ? C.green : pct >= 60 ? C.orange : C.red, fontWeight: 600 }}>{total}g / {GOAL}g</span>
          </div>
          <div style={{ background: C.surface2, borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: pct >= 100 ? C.green : pct >= 60 ? 'linear-gradient(90deg,#fb923c,#4ade80)' : 'linear-gradient(90deg,#f87171,#fb923c)', width: pct + '%', transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: '0.74rem', marginTop: 5, color: missing > 0 ? C.muted : C.green }}>
            {missing > 0 ? <span>Il te manque <strong style={{ color: C.orange }}>{missing}g</strong></span> : '🎉 Objectif atteint !'}
          </div>
        </div>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
        <span style={{ fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, display: 'block' }}>Ajoute ce que tu as mangé</span>
        <FoodSearch onAdd={handleAdd} />
        {foods.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 7 }}>Ajoutés ({foods.length})</div>
            {foods.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: C.surface2, borderRadius: 9, marginBottom: 5 }}>
                <span style={{ fontSize: '1.1rem' }}>{f.food.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.83rem', fontWeight: 500 }}>{f.food.name}</div>
                  <div style={{ fontSize: '0.7rem', color: C.muted }}>{f.label}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.1rem', color: C.green }}>{f.prot}g</div>
                <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '1rem', padding: '0 2px' }}>×</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={analyze} disabled={!foods.length || loading}
          style={{ width: '100%', padding: 11, marginTop: 12, background: foods.length && !loading ? 'linear-gradient(135deg,#1c2e3f,#1a3050)' : '#1a1e2a', border: foods.length && !loading ? '1px solid rgba(96,165,250,0.35)' : `1px solid ${C.border}`, borderRadius: 10, color: foods.length && !loading ? C.blue : '#3a4060', fontFamily: "'Bebas Neue',cursive", fontSize: '1rem', letterSpacing: 1, cursor: foods.length && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? '⏳ Analyse…' : '✦ Analyser avec l\'IA'}
        </button>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '24px 0', color: C.muted }}><div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🧠</div><div>Analyse en cours…</div></div>}
      {error && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: '0.8rem', color: C.red, marginBottom: 12 }}>{error}</div>}

      {result && !loading && (
        <div className="slide-up">
          <div style={{ background: scoreType === 'good' ? 'linear-gradient(135deg,#1a2e1e,#1e3525)' : scoreType === 'ok' ? 'linear-gradient(135deg,#2a2010,#2e2615)' : 'linear-gradient(135deg,#2a1515,#2e1a1a)', border: `1px solid ${scoreColor}44`, borderRadius: 14, padding: '16px 18px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div><div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Consommé</div><div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2rem', color: scoreColor }}>{total}g</div><div style={{ fontSize: '0.75rem' }}>{pct}% de l'objectif</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: '0.68rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Manquant</div><div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '2rem', color: scoreColor }}>{missing > 0 ? missing + 'g' : '✓ OK'}</div></div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: C.muted, marginBottom: 8 }}>✅ Qualité de ta journée</div>
            <div style={{ fontSize: '0.86rem', lineHeight: 1.75 }}>{icons[result.quality_score] || '⚠️'} <strong>{result.quality_score}</strong><br /><br />{result.quality_note}</div>
          </div>
          {missing > 0 && result.suggestions?.length > 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: C.muted, marginBottom: 10 }}>💡 Pour combler tes {missing}g</div>
              {result.suggestions.map((sg: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: C.surface2, borderRadius: 9, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: '0.86rem', fontWeight: 600 }}>🍽 {sg.food}</div><div style={{ fontSize: '0.72rem', color: C.muted }}>{sg.qty}</div></div>
                  <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '1.2rem', color: C.green }}>+{sg.protein_g}g</div>
                </div>
              ))}
              <div style={{ fontSize: '0.8rem', color: '#a7f3d0', lineHeight: 1.7, marginTop: 8 }}>{result.suggestions_note}</div>
            </div>
          )}
          <button onClick={reset} style={{ width: '100%', padding: 10, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 9, color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', cursor: 'pointer', marginTop: 4 }}>↺ Nouvelle journée</button>
        </div>
      )}
    </div>
  );
}
