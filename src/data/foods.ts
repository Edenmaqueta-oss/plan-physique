import type { Category, Food } from '../types'

export const CATEGORIES: Category[] = [
  'Viande',
  'Poisson',
  'Œufs',
  'Laitiers',
  'Compléments',
  'Légumineuses',
  'Glucides',
  'Oléagineux',
  'Fruits',
  'Légumes',
]

/**
 * Base alimentaire. `protein` = grammes de protéines pour 100 g.
 * `unit` = aliment comptable (l'app convertit automatiquement nb d'unités → grammes).
 */
export const FOODS: Food[] = [
  // ─── Viande ───
  { id: 'blanc-poulet', name: 'Blanc de poulet', category: 'Viande', protein: 31 },
  { id: 'dinde', name: 'Escalope de dinde', category: 'Viande', protein: 30 },
  { id: 'boeuf-hache-5', name: 'Bœuf haché 5%', category: 'Viande', protein: 22 },
  { id: 'steak', name: 'Steak de bœuf', category: 'Viande', protein: 26 },
  { id: 'jambon', name: 'Jambon blanc', category: 'Viande', protein: 18, unit: { label: 'tranche', grams: 25 } },
  { id: 'veau', name: 'Escalope de veau', category: 'Viande', protein: 28 },
  { id: 'cuisse-poulet', name: 'Cuisse de poulet', category: 'Viande', protein: 25, unit: { label: 'cuisse', grams: 130 } },
  { id: 'agneau', name: 'Agneau', category: 'Viande', protein: 25 },
  { id: 'bacon', name: 'Bacon', category: 'Viande', protein: 37, unit: { label: 'tranche', grams: 15 } },

  // ─── Poisson ───
  { id: 'thon-boite', name: 'Thon en boîte', category: 'Poisson', protein: 28, unit: { label: 'boîte', grams: 140 } },
  { id: 'saumon', name: 'Saumon', category: 'Poisson', protein: 25 },
  { id: 'cabillaud', name: 'Cabillaud', category: 'Poisson', protein: 18 },
  { id: 'crevettes', name: 'Crevettes', category: 'Poisson', protein: 20 },
  { id: 'sardines', name: 'Sardines', category: 'Poisson', protein: 25, unit: { label: 'boîte', grams: 90 } },
  { id: 'maquereau', name: 'Maquereau', category: 'Poisson', protein: 19 },
  { id: 'thon-frais', name: 'Thon frais', category: 'Poisson', protein: 29 },
  { id: 'truite', name: 'Truite', category: 'Poisson', protein: 20 },
  { id: 'saint-jacques', name: 'Noix de Saint-Jacques', category: 'Poisson', protein: 17, unit: { label: 'noix', grams: 30 } },
  { id: 'colin', name: 'Colin / lieu', category: 'Poisson', protein: 17 },
  { id: 'hareng', name: 'Hareng', category: 'Poisson', protein: 18 },

  // ─── Œufs ───
  { id: 'oeuf', name: 'Œuf entier', category: 'Œufs', protein: 13, unit: { label: 'œuf', grams: 60 } },
  { id: 'blanc-oeuf', name: "Blanc d'œuf", category: 'Œufs', protein: 11, unit: { label: 'blanc', grams: 35 } },

  // ─── Laitiers ───
  { id: 'fromage-blanc', name: 'Fromage blanc 0%', category: 'Laitiers', protein: 10 },
  { id: 'yaourt-grec', name: 'Yaourt grec', category: 'Laitiers', protein: 10 },
  { id: 'cottage', name: 'Cottage cheese', category: 'Laitiers', protein: 11 },
  { id: 'parmesan', name: 'Parmesan', category: 'Laitiers', protein: 36 },
  { id: 'lait', name: 'Lait', category: 'Laitiers', protein: 3 },
  { id: 'emmental', name: 'Emmental', category: 'Laitiers', protein: 28 },
  { id: 'mozzarella', name: 'Mozzarella', category: 'Laitiers', protein: 18 },
  { id: 'skyr', name: 'Skyr', category: 'Laitiers', protein: 11 },
  { id: 'ricotta', name: 'Ricotta', category: 'Laitiers', protein: 11 },
  { id: 'kefir', name: 'Kéfir', category: 'Laitiers', protein: 3 },

  // ─── Compléments ───
  { id: 'whey', name: 'Whey', category: 'Compléments', protein: 80 },
  { id: 'caseine', name: 'Caséine', category: 'Compléments', protein: 80 },
  { id: 'isolat', name: 'Isolat de whey', category: 'Compléments', protein: 90 },
  { id: 'proteine-pois', name: 'Protéine de pois', category: 'Compléments', protein: 75 },
  { id: 'barre-proteinee', name: 'Barre protéinée', category: 'Compléments', protein: 33, unit: { label: 'barre', grams: 60 } },

  // ─── Légumineuses ───
  { id: 'lentilles', name: 'Lentilles', category: 'Légumineuses', protein: 9 },
  { id: 'pois-chiches', name: 'Pois chiches', category: 'Légumineuses', protein: 9 },
  { id: 'edamame', name: 'Edamame', category: 'Légumineuses', protein: 11 },
  { id: 'haricots-rouges', name: 'Haricots rouges', category: 'Légumineuses', protein: 9 },
  { id: 'tofu', name: 'Tofu', category: 'Légumineuses', protein: 8 },
  { id: 'tempeh', name: 'Tempeh', category: 'Légumineuses', protein: 19 },

  // ─── Glucides ───
  { id: 'riz-blanc', name: 'Riz blanc cuit', category: 'Glucides', protein: 3 },
  { id: 'avoine', name: "Flocons d'avoine", category: 'Glucides', protein: 13 },
  { id: 'pates-cuites', name: 'Pâtes cuites', category: 'Glucides', protein: 5 },
  { id: 'pates-crues', name: 'Pâtes crues', category: 'Glucides', protein: 13 },
  { id: 'pain-complet', name: 'Pain complet', category: 'Glucides', protein: 9, unit: { label: 'tranche', grams: 35 } },
  { id: 'pomme-terre', name: 'Pomme de terre', category: 'Glucides', protein: 2 },
  { id: 'quinoa', name: 'Quinoa', category: 'Glucides', protein: 4 },
  { id: 'riz-complet', name: 'Riz complet', category: 'Glucides', protein: 3 },
  { id: 'patate-douce', name: 'Patate douce', category: 'Glucides', protein: 2 },
  { id: 'semoule', name: 'Semoule crue', category: 'Glucides', protein: 13 },

  // ─── Oléagineux ───
  { id: 'amandes', name: 'Amandes', category: 'Oléagineux', protein: 21 },
  { id: 'beurre-cacahuete', name: 'Beurre de cacahuète', category: 'Oléagineux', protein: 25 },
  { id: 'cajou', name: 'Noix de cajou', category: 'Oléagineux', protein: 18 },
  { id: 'chia', name: 'Graines de chia', category: 'Oléagineux', protein: 17 },
  { id: 'graines-courge', name: 'Graines de courge', category: 'Oléagineux', protein: 19 },
  { id: 'noix', name: 'Noix', category: 'Oléagineux', protein: 15 },
  { id: 'noisette', name: 'Noisettes', category: 'Oléagineux', protein: 15 },
  { id: 'pistache', name: 'Pistaches', category: 'Oléagineux', protein: 20 },

  // ─── Fruits ───
  { id: 'banane', name: 'Banane', category: 'Fruits', protein: 1, unit: { label: 'banane', grams: 120 } },
  { id: 'pomme', name: 'Pomme', category: 'Fruits', protein: 0.3, unit: { label: 'pomme', grams: 150 } },
  { id: 'fraise', name: 'Fraises', category: 'Fruits', protein: 0.7 },
  { id: 'avocat', name: 'Avocat', category: 'Fruits', protein: 2, unit: { label: 'avocat', grams: 150 } },
  { id: 'myrtille', name: 'Myrtilles', category: 'Fruits', protein: 0.7 },
  { id: 'orange', name: 'Orange', category: 'Fruits', protein: 1, unit: { label: 'orange', grams: 130 } },
  { id: 'kiwi', name: 'Kiwi', category: 'Fruits', protein: 1.1, unit: { label: 'kiwi', grams: 75 } },
  { id: 'framboise', name: 'Framboises', category: 'Fruits', protein: 1.2 },

  // ─── Légumes ───
  { id: 'brocoli', name: 'Brocoli', category: 'Légumes', protein: 3 },
  { id: 'epinards', name: 'Épinards', category: 'Légumes', protein: 3 },
  { id: 'petit-pois', name: 'Petits pois', category: 'Légumes', protein: 5 },
  { id: 'asperge', name: 'Asperges', category: 'Légumes', protein: 2 },
  { id: 'chou-fleur', name: 'Chou-fleur', category: 'Légumes', protein: 2 },
  { id: 'champignon', name: 'Champignons', category: 'Légumes', protein: 3 },
  { id: 'mais', name: 'Maïs', category: 'Légumes', protein: 3 },
  { id: 'haricot-vert', name: 'Haricots verts', category: 'Légumes', protein: 2 },
]

export const FOOD_BY_ID = Object.fromEntries(FOODS.map((f) => [f.id, f])) as Record<string, Food>

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
}

/**
 * Recherche insensible aux accents/casse, triée par pertinence :
 * correspondance exacte → début du nom → début d'un mot → ailleurs.
 * (ex : « oeuf » renvoie « Œuf entier » avant « Bœuf haché »)
 */
export function searchFoods(query: string, category?: Category | 'all'): Food[] {
  const q = normalize(query.trim())
  const inCat = (f: Food) => !category || category === 'all' || f.category === category

  if (!q) return FOODS.filter(inCat)

  const scored = FOODS.filter(inCat)
    .map((f) => {
      const n = normalize(f.name)
      const idx = n.indexOf(q)
      let score = -1
      if (idx === 0) score = n === q ? 0 : 1
      else if (idx > 0) score = /[\s'-]/.test(n[idx - 1]) ? 2 : 3
      return { f, score }
    })
    .filter((x) => x.score >= 0)

  scored.sort((a, b) => a.score - b.score || a.f.name.length - b.f.name.length)
  return scored.map((x) => x.f)
}
