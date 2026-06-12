import type { EatenItem } from '../types'
import { PROTEIN_GOAL } from './storage'

export interface DayAnalysis {
  totalProteines: number
  scoreQualite: number // /100
  resume: string
  suggestions: string[]
}

const PROFIL =
  "Eden, 88 kg, ancien joueur de water-polo. Objectif : 202 g de protéines / jour, " +
  'musculation 3 à 4×/semaine, en sèche (mâchoire carrée). Cherche des protéines de qualité.'

/**
 * Appel direct (navigateur) à l'API Anthropic.
 * Nécessite le header anthropic-dangerous-direct-browser-access.
 * ⚠️ La clé est exposée côté client : usage strictement personnel.
 */
export async function analyzeDay(apiKey: string, items: EatenItem[]): Promise<DayAnalysis> {
  const computedTotal = Math.round(items.reduce((s, it) => s + it.protein, 0))

  const liste = items
    .map((it) => `- ${it.name} : ${Math.round(it.grams)} g → ${Math.round(it.protein)} g de protéines`)
    .join('\n')

  const prompt = `Profil : ${PROFIL}

Voici ce que la personne a mangé aujourd'hui :
${liste || '(rien pour le moment)'}

Total protéines calculé localement : ${computedTotal} g (objectif : ${PROTEIN_GOAL} g).

Analyse la journée. Si un aliment a été ajouté manuellement (hors base), estime ses protéines toi-même.
Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format :
{
  "totalProteines": <nombre entier, total estimé en g>,
  "scoreQualite": <0-100, qualité globale des sources de protéines>,
  "resume": "<2 phrases max, bilan de la journée>",
  "suggestions": ["<aliment + quantité pour combler le déficit>", "..."]
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`API ${res.status} : ${txt.slice(0, 200) || res.statusText}`)
  }

  const data = await res.json()
  const text: string = data?.content?.[0]?.text ?? ''
  const parsed = extractJson(text)

  return {
    totalProteines: Number(parsed.totalProteines) || computedTotal,
    scoreQualite: clamp(Number(parsed.scoreQualite) || 0, 0, 100),
    resume: String(parsed.resume ?? '').trim() || 'Analyse indisponible.',
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String) : [],
  }
}

function extractJson(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text)
  } catch {
    const m = text.match(/\{[\s\S]*\}/)
    if (m) {
      try {
        return JSON.parse(m[0])
      } catch {
        /* ignore */
      }
    }
    return {}
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
