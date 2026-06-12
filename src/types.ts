export type Category =
  | 'Viande'
  | 'Poisson'
  | 'Œufs'
  | 'Laitiers'
  | 'Compléments'
  | 'Légumineuses'
  | 'Glucides'
  | 'Oléagineux'
  | 'Fruits'
  | 'Légumes'

export interface Food {
  id: string
  name: string
  category: Category
  /** protéines pour 100 g */
  protein: number
  /** si l'aliment est comptable à l'unité */
  unit?: { label: string; grams: number }
}

/** Un aliment réellement consommé (dans le Plan ou le Suivi IA) */
export interface EatenItem {
  id: string
  foodId: string | null // null = ajout manuel hors base
  name: string
  grams: number
  protein: number // protéines totales pour cette quantité
  manual?: boolean
}
