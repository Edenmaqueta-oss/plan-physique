export const C = {
  bg: '#0f1117', surface: '#181c27', surface2: '#1e2333',
  accent: '#e8ff47', orange: '#fb923c', text: '#f0f2f8',
  muted: '#7a8099', border: 'rgba(255,255,255,0.07)',
  green: '#4ade80', blue: '#60a5fa', red: '#f87171',
  purple: '#a78bfa', pink: '#f472b6'
};

export const GOAL = 202;

export const FOOD_DB = [
  { id:1,  emoji:'🍗', name:'Blanc de poulet',        cat:'Viande',      protPer100:31, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g (1 filet)',qty:200},{label:'300g',qty:300}] },
  { id:2,  emoji:'🍗', name:'Blanc de dinde',          cat:'Viande',      protPer100:30, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200},{label:'300g',qty:300}] },
  { id:3,  emoji:'🥩', name:'Bœuf haché 5%',           cat:'Viande',      protPer100:22, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g (1 steak)',qty:200}] },
  { id:4,  emoji:'🥩', name:'Steak de bœuf',           cat:'Viande',      protPer100:26, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200}] },
  { id:5,  emoji:'🍖', name:'Jambon blanc',             cat:'Viande',      protPer100:18, portions:[{label:'1 tranche (30g)',qty:30},{label:'2 tranches (60g)',qty:60},{label:'4 tranches (120g)',qty:120}] },
  { id:10, emoji:'🐟', name:'Thon en boîte (nature)',  cat:'Poisson',     protPer100:28, portions:[{label:'½ boîte (60g)',qty:60},{label:'1 boîte (120g)',qty:120},{label:'200g',qty:200}] },
  { id:11, emoji:'🍣', name:'Saumon frais',             cat:'Poisson',     protPer100:25, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g (1 pavé)',qty:200}] },
  { id:12, emoji:'🐟', name:'Cabillaud',                cat:'Poisson',     protPer100:18, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200}] },
  { id:13, emoji:'🍤', name:'Crevettes',                cat:'Poisson',     protPer100:20, portions:[{label:'80g',qty:80},{label:'150g',qty:150},{label:'200g',qty:200}] },
  { id:14, emoji:'🐟', name:'Sardines à l\'huile',      cat:'Poisson',     protPer100:25, portions:[{label:'1 boîte (90g)',qty:90},{label:'2 boîtes (180g)',qty:180}] },
  { id:20, emoji:'🥚', name:'Œuf entier',               cat:'Œufs',        protPer100:13, portions:[{label:'1 œuf',qty:60},{label:'2 œufs',qty:120},{label:'3 œufs',qty:180},{label:'4 œufs',qty:240},{label:'6 œufs',qty:360}] },
  { id:21, emoji:'🥚', name:'Blanc d\'œuf',             cat:'Œufs',        protPer100:11, portions:[{label:'1 blanc (30g)',qty:30},{label:'2 blancs (60g)',qty:60},{label:'4 blancs (120g)',qty:120},{label:'6 blancs (180g)',qty:180}] },
  { id:22, emoji:'🥛', name:'Fromage blanc 0%',         cat:'Laitiers',    protPer100:10, portions:[{label:'100g',qty:100},{label:'150g (1 pot)',qty:150},{label:'200g',qty:200},{label:'500g',qty:500}] },
  { id:23, emoji:'🥣', name:'Yaourt grec 0%',           cat:'Laitiers',    protPer100:10, portions:[{label:'100g',qty:100},{label:'150g (1 pot)',qty:150},{label:'200g',qty:200}] },
  { id:24, emoji:'🧀', name:'Fromage cottage',          cat:'Laitiers',    protPer100:11, portions:[{label:'100g',qty:100},{label:'200g',qty:200},{label:'250g',qty:250}] },
  { id:25, emoji:'🧀', name:'Parmesan râpé',            cat:'Laitiers',    protPer100:36, portions:[{label:'20g',qty:20},{label:'40g',qty:40}] },
  { id:26, emoji:'🥛', name:'Lait demi-écrémé',         cat:'Laitiers',    protPer100:3,  portions:[{label:'200ml',qty:200},{label:'250ml',qty:250},{label:'500ml',qty:500}] },
  { id:30, emoji:'🥤', name:'Whey protéine',            cat:'Compléments', protPer100:80, portions:[{label:'1 dose (25g)',qty:25},{label:'1,5 dose (37g)',qty:37},{label:'2 doses (50g)',qty:50}] },
  { id:31, emoji:'🥤', name:'Caséine',                  cat:'Compléments', protPer100:80, portions:[{label:'1 dose (25g)',qty:25},{label:'1,5 dose (37g)',qty:37},{label:'2 doses (50g)',qty:50}] },
  { id:32, emoji:'🥤', name:'Whey isolat',              cat:'Compléments', protPer100:90, portions:[{label:'1 dose (25g)',qty:25},{label:'1,5 dose (37g)',qty:37},{label:'2 doses (50g)',qty:50}] },
  { id:40, emoji:'🫘', name:'Lentilles cuites',         cat:'Légumineuses', protPer100:9, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200}] },
  { id:41, emoji:'🫘', name:'Pois chiches cuits',       cat:'Légumineuses', protPer100:9, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200}] },
  { id:42, emoji:'🫘', name:'Edamame',                  cat:'Légumineuses', protPer100:11, portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200}] },
  { id:50, emoji:'🌾', name:'Riz blanc cuit',           cat:'Glucides',    protPer100:3,  portions:[{label:'100g',qty:100},{label:'150g',qty:150},{label:'200g',qty:200},{label:'250g',qty:250}] },
  { id:51, emoji:'🌾', name:'Flocons d\'avoine',        cat:'Glucides',    protPer100:13, portions:[{label:'50g',qty:50},{label:'80g',qty:80},{label:'100g',qty:100}] },
  { id:52, emoji:'🫐', name:'Banane',                   cat:'Fruits',      protPer100:1,  portions:[{label:'1 petite (100g)',qty:100},{label:'1 moyenne (130g)',qty:130},{label:'1 grande (160g)',qty:160}] },
  { id:53, emoji:'🥜', name:'Amandes',                  cat:'Oléagineux',  protPer100:21, portions:[{label:'20g (petite poignée)',qty:20},{label:'30g (poignée)',qty:30},{label:'50g',qty:50}] },
  { id:54, emoji:'🥜', name:'Beurre de cacahuète',      cat:'Oléagineux',  protPer100:25, portions:[{label:'1 c.à.s (20g)',qty:20},{label:'2 c.à.s (40g)',qty:40}] },
  { id:55, emoji:'🍞', name:'Pain complet',             cat:'Glucides',    protPer100:9,  portions:[{label:'1 tranche (35g)',qty:35},{label:'2 tranches (70g)',qty:70}] },
];

export const JAW_SECTIONS = [
  {
    id:'exercises', title:'💪 Exercices de mâchoire', color:'#e8ff47',
    subtitle:'Musculation & définition du masséter',
    items:[
      { id:'j1', label:'Chewing-gum Falim (dur)', detail:'Résistance maximale pour travailler le masséter comme un muscle à part entière.', duration:'20 min' },
      { id:'j2', label:'Jaw clenching × 20', detail:'Serre les mâchoires à fond 5 sec, relâche 3 sec. Sens le masséter se contracter sur les côtés.', duration:'5 min' },
      { id:'j3', label:'Résistance latérale manuelle', detail:'Pousse la mâchoire contre ta main résistante, 5 sec chaque côté × 10 séries.', duration:'3 min' },
      { id:'j4', label:'Mâcher 20-30x par bouchée', detail:'Stimulus naturel à chaque repas. Bonus : meilleure digestion.', duration:'Repas' },
    ]
  },
  {
    id:'cheeks', title:'🫦 Creuser les joues', color:'#f472b6',
    subtitle:'Vider la graisse buccale & sculpter le zygomatique',
    items:[
      { id:'c1', label:'Fish face × 15', detail:'Aspire les joues à fond, tiens 10 sec. Active directement la graisse buccale.', duration:'3 min' },
      { id:'c2', label:'Smiling fish face × 15', detail:'Sourire large + joues aspirées simultanément. Active le zygomatique (pommette).', duration:'3 min' },
      { id:'c3', label:'Ballon d\'air alternatif × 10', detail:'Transfère l\'air joue droite → joue gauche → les deux ensemble.', duration:'3 min' },
      { id:'c4', label:'Cheek lifts × 15', detail:'Sourire forcé vers le haut avec plissement des yeux, tiens 10 sec. Meilleur exercice pour les pommettes.', duration:'4 min' },
      { id:'c5', label:'Massage drainage lymphatique', detail:'Pouces sous la mâchoire, index sur les joues, mouvements ascendants × 20. Faire le matin.', duration:'5 min' },
      { id:'c6', label:'Gua Sha / rouleau jade', detail:'Remontée ferme de la mâchoire vers la tempe sur peau propre + huile. Désengorgement visible en 2-3 semaines.', duration:'5 min' },
    ]
  },
  {
    id:'posture', title:'🧘 Posture langue & tête', color:'#60a5fa',
    subtitle:'L\'impact structural le plus puissant à long terme',
    items:[
      { id:'p1', label:'Mewing toute la journée', detail:'TOUTE la langue collée au palais au repos — pas juste la pointe. Devient automatique en quelques semaines.', duration:'Permanent' },
      { id:'p2', label:'Lèvres fermées, respiration nasale', detail:'Lèvres jointes, dents légèrement en contact. Éviter absolument la respiration buccale.', duration:'Permanent' },
      { id:'p3', label:'Tête droite, menton rentré', detail:'Fil imaginaire tirant le sommet du crâne vers le haut. Crucial pour la projection de la mâchoire.', duration:'Permanent' },
      { id:'p4', label:'Vérification posture × 1h', detail:'Un rappel toutes les heures. Tête droite = mâchoire plus définie visuellement.', duration:'Journée' },
    ]
  },
  {
    id:'nutrition', title:'🥗 Nutrition visage sec', color:'#fb923c',
    subtitle:'Le gras facial se perd avec le gras général',
    items:[
      { id:'n1', label:'Sel < 5g aujourd\'hui', detail:'Le sel provoque une rétention d\'eau visible sur le visage en quelques heures. Éviter plats préparés.', duration:'Journée' },
      { id:'n2', label:'3L d\'eau minimum', detail:'Boire plus réduit paradoxalement la rétention. Commencer par 500ml à jeun.', duration:'Journée' },
      { id:'n3', label:'Zéro alcool', detail:'L\'alcool gonfle le visage pendant 48h. Ennemi numéro 1 de la définition faciale.', duration:'Journée' },
      { id:'n4', label:'Café / thé sans sucre', detail:'Le sucre génère de l\'inflammation et du gonflement facial. Utiliser stévia si besoin.', duration:'Journée' },
    ]
  },
  {
    id:'body', title:'🏋️ Entraînement & sèche', color:'#a78bfa',
    subtitle:'Impossible de cibler le gras facial — le corps sèche globalement',
    items:[
      { id:'b1', label:'Séance effectuée (muscu + HIIT)', detail:'3-4x/semaine. La perte de gras globale révèle la mâchoire. Priorité épaules + dos pour l\'effet imposant.', duration:'45-60 min' },
      { id:'b2', label:'Déficit calorique ~300 kcal', detail:'Petit déficit régulier = perte de gras sans sacrifier le muscle.', duration:'Journée' },
      { id:'b3', label:'Objectif 202g protéines atteint', detail:'Sans protéines pendant la sèche, le visage devient flasque au lieu de défini.', duration:'Journée' },
    ]
  },
  {
    id:'sleep', title:'😴 Récupération & gonflement', color:'#4ade80',
    subtitle:'Le manque de sommeil gonfle le visage en 24h',
    items:[
      { id:'s1', label:'7-8h de sommeil', detail:'Le cortisol du manque de sommeil = rétention d\'eau et stockage graisseux au visage.', duration:'7-8h' },
      { id:'s2', label:'Tête surélevée en dormant', detail:'Dormir à plat accumule les fluides au visage. 1 oreiller supplémentaire suffit.', duration:'Nuit' },
      { id:'s3', label:'Pas d\'écrans 30 min avant', detail:'Réduit le cortisol nocturne et l\'inflammation. Améliore la qualité du sommeil.', duration:'Soir' },
    ]
  },
];

export const MEALS_DATA = [
  { emoji:'🌅', title:'Petit-déjeuner', tag:'Essentiel', time:'7h–8h', color:'#e8ff47', protein:42,
    foods:[{name:'Œufs entiers',qty:'4 œufs',prot:28},{name:'Fromage blanc 0%',qty:'150g',prot:15}] },
  { emoji:'☕', title:'Collation matin', tag:null, time:'10h–11h', color:'#fb923c', protein:30,
    foods:[{name:'Whey protéine',qty:'1 dose (25g)',prot:24},{name:'Amandes',qty:'30g',prot:6}] },
  { emoji:'🍽️', title:'Déjeuner', tag:null, time:'13h', color:'#60a5fa', protein:52,
    foods:[{name:'Blanc de poulet',qty:'200g',prot:52}] },
  { emoji:'⚡', title:'Post-entraînement', tag:'Post-training', time:'17h–18h', color:'#a78bfa', protein:36,
    foods:[{name:'Whey protéine',qty:'1,5 dose (37g)',prot:28},{name:'Yaourt grec 0%',qty:'150g',prot:15}] },
  { emoji:'🌙', title:'Dîner', tag:null, time:'19h30–20h30', color:'#4ade80', protein:42,
    foods:[{name:'Saumon ou bœuf maigre',qty:'200g',prot:42},{name:'Légumes vapeur',qty:'300g',prot:4}] }
];
