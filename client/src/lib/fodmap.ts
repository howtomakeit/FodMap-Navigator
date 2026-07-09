/**
 * FODMAP Navigator — FODMAP Rules Engine
 */

export type FODMAPSubgroup = 'lactose' | 'fructans' | 'gos' | 'fructose' | 'polyols';

export interface FODMAPProfile {
  lactose: boolean;
  fructans: boolean;
  gos: boolean;
  fructose: boolean;
  polyols: boolean;
}

export type VerdictLevel = 'green' | 'yellow' | 'red';

export interface ScanResult {
  productName: string;
  barcode?: string;
  ingredients: string[];
  verdict: VerdictLevel;
  flaggedIngredients: Array<{
    ingredient: string;
    subgroups: FODMAPSubgroup[];
    level: VerdictLevel;
  }>;
  swaps: SwapSuggestion[];
  disclaimer: string;
  scannedAt?: string;
}

export interface SwapSuggestion {
  original: string;
  alternatives: Array<{
    name: string;
    reason: string;
    brand?: string;
  }>;
  diyTip?: string;
}

export interface TriageResult {
  likelySubgroups: FODMAPSubgroup[];
  confidence: 'high' | 'medium' | 'low';
  recommendation: string;
  shouldSeeDietitian: boolean;
}

// ============================================================================
// FODMAP Ingredient Databases — expanded to 200+ foods
// ============================================================================

const FRUCTANS = [
  // Alliums
  'garlic', 'onion', 'shallot', 'leek', 'scallion', 'spring onion', 'chive bulb',
  'onion powder', 'garlic powder', 'garlic salt', 'onion flakes', 'onion salt',
  // Grains
  'wheat', 'barley', 'rye', 'couscous', 'semolina', 'spelt', 'kamut', 'einkorn',
  'wheat flour', 'bread flour', 'all purpose flour', 'self raising flour',
  'whole wheat', 'wholewheat', 'whole grain wheat', 'durum wheat',
  'wheat starch', 'wheat germ', 'wheat bran', 'bulgur', 'freekeh', 'farro',
  // Additives
  'fructooligosaccharides', 'fos', 'inulin', 'chicory root', 'chicory root extract',
  'chicory fiber', 'chicory inulin', 'oligofructose', 'agave inulin',
  // Vegetables
  'artichoke', 'asparagus', 'beet', 'beetroot', 'brussels sprout', 'brussels sprouts',
  'cabbage', 'fennel', 'radicchio', 'pumpkin',
  // Dried fruits (high concentration)
  'dried apricot', 'dried cranberry', 'dried currant', 'dried fig', 'prune',
  'raisin', 'sultana', 'currant',
  // Fresh fruits (high fructan)
  'grapefruit', 'pomelo', 'honeydew', 'nectarine', 'persimmon', 'pomegranate',
  'watermelon', 'ripe banana', 'overripe banana',
  // Sweeteners
  'corn syrup', 'high fructose corn syrup', 'hfcs',
];

const GOS = [
  // Legumes
  'bean', 'baked bean', 'black bean', 'kidney bean', 'navy bean', 'pinto bean',
  'cannellini bean', 'borlotti bean', 'fava bean', 'broad bean', 'lima bean',
  'adzuki bean', 'mung bean', 'edamame', 'soybean', 'soy',
  'chickpea', 'lentil', 'pea', 'split pea', 'green pea', 'yellow pea',
  'black eyed pea', 'snap pea',
  // Soy products (high GOS)
  'soy milk', 'soy flour', 'textured vegetable protein', 'tvp', 'tempeh',
  // Tofu (contains some GOS)
  'tofu', 'silken tofu', 'firm tofu',
  // Nuts
  'cashew', 'pistachio',
  // Vegetables
  'beetroot', 'beet',
];

const LACTOSE = [
  // Milks
  'milk', 'cow milk', 'goat milk', 'sheep milk', 'buffalo milk', 'skim milk',
  'whole milk', 'reduced fat milk', 'low fat milk', 'buttermilk', 'kefir',
  'condensed milk', 'evaporated milk', 'powdered milk', 'milk powder', 'milk solids',
  'nonfat dry milk', 'skimmed milk powder', 'milk protein',
  // Creams
  'cream', 'heavy cream', 'whipping cream', 'half and half', 'sour cream',
  'creme fraiche', 'double cream', 'single cream', 'clotted cream',
  // Yogurts
  'yogurt', 'yoghurt', 'greek yogurt', 'frozen yogurt', 'froyo',
  // Ice cream
  'ice cream', 'gelato', 'soft serve', 'custard',
  // Butter (low lactose but still listed)
  'butter', 'ghee',
  // Cheeses (soft = high lactose)
  'ricotta', 'cottage cheese', 'cream cheese', 'mascarpone', 'quark',
  'fromage frais', 'brie', 'camembert', 'feta', 'haloumi', 'halloumi',
  'mozzarella', 'paneer',
  // Cheeses (hard = lower lactose, but include for sensitivity)
  'cheese', 'soft cheese', 'processed cheese', 'cheese sauce', 'cheesy',
  // Whey
  'whey', 'whey protein', 'milk whey', 'whey concentrate', 'whey isolate',
  'lactulose', 'lactose',
];

const EXCESS_FRUCTOSE = [
  // Fruits high in fructose
  'apple', 'pear', 'mango', 'cherry', 'fig', 'grape', 'watermelon',
  'boysenberry', 'tamarillo', 'rambutan', 'longan', 'guava',
  'concentrated fruit juice', 'apple juice', 'pear juice', 'grape juice',
  'apple sauce', 'applesauce', 'apple puree', 'dried mango',
  // Sweeteners
  'honey', 'agave', 'agave nectar', 'agave syrup', 'agave nectar',
  'fructose', 'crystalline fructose', 'fruit sugar',
  'high fructose corn syrup', 'hfcs', 'corn syrup',
  // Vegetables
  'asparagus', 'artichoke', 'sugar snap pea',
];

const POLYOLS = [
  // Sugar alcohols (common in "sugar-free" products)
  'sorbitol', 'mannitol', 'xylitol', 'maltitol', 'isomalt', 'erythritol',
  'lactitol', 'HSH', 'hydrogenated starch hydrolysate',
  'sugar alcohol', 'sugar-free', 'diabetic chocolate',
  // Fruits
  'apple', 'apricot', 'avocado', 'blackberry', 'cherry', 'lychee',
  'nectarine', 'peach', 'pear', 'plum', 'prune', 'watermelon',
  'longan', 'coconut water',
  // Vegetables
  'cauliflower', 'celery', 'corn', 'mushroom', 'pumpkin', 'snow pea',
  'sweet corn', 'sweetcorn',
  // Sweeteners in gum/candy
  'sorb', 'xylitol gum', 'sugar free gum', 'mint', 'peppermint candy',
];

// ============================================================================
// Ingredient Scoring
// ============================================================================

function normalizeIngredient(ing: string): string {
  return ing
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

function ingredientMatches(ingredient: string, list: string[]): boolean {
  const normalized = normalizeIngredient(ingredient);
  return list.some(item => normalized.includes(normalizeIngredient(item)));
}

export function scoreIngredient(
  ingredient: string,
  profile: FODMAPProfile
): { subgroups: FODMAPSubgroup[]; level: VerdictLevel } {
  const flaggedSubgroups: FODMAPSubgroup[] = [];

  if (profile.lactose && ingredientMatches(ingredient, LACTOSE)) {
    flaggedSubgroups.push('lactose');
  }
  if (profile.fructans && ingredientMatches(ingredient, FRUCTANS)) {
    flaggedSubgroups.push('fructans');
  }
  if (profile.gos && ingredientMatches(ingredient, GOS)) {
    flaggedSubgroups.push('gos');
  }
  if (profile.fructose && ingredientMatches(ingredient, EXCESS_FRUCTOSE)) {
    flaggedSubgroups.push('fructose');
  }
  if (profile.polyols && ingredientMatches(ingredient, POLYOLS)) {
    flaggedSubgroups.push('polyols');
  }

  const level: VerdictLevel = flaggedSubgroups.length > 0 ? 'red' : 'green';
  return { subgroups: flaggedSubgroups, level };
}

export function scanProduct(
  productName: string,
  ingredients: string[],
  profile: FODMAPProfile,
  barcode?: string
): ScanResult {
  const flaggedIngredients: ScanResult['flaggedIngredients'] = [];
  let hasRed = false;

  for (const ing of ingredients) {
    const { subgroups, level } = scoreIngredient(ing, profile);
    if (subgroups.length > 0) {
      flaggedIngredients.push({ ingredient: ing, subgroups, level });
      if (level === 'red') hasRed = true;
    }
  }

  const verdict: VerdictLevel = hasRed ? 'red' : flaggedIngredients.length > 0 ? 'yellow' : 'green';
  const swaps = flaggedIngredients.length > 0 ? generateSwaps(flaggedIngredients) : [];

  return {
    productName,
    barcode,
    ingredients,
    verdict,
    flaggedIngredients,
    swaps,
    disclaimer: 'Educational tool only — not medical advice. Always confirm with a dietitian or doctor.',
    scannedAt: new Date().toISOString(),
  };
}

// ============================================================================
// Swap Suggestions — expanded to 30+ ingredients
// ============================================================================

const SWAP_DATABASE: Record<string, SwapSuggestion> = {
  garlic: {
    original: 'Garlic',
    alternatives: [
      { name: 'Garlic-infused olive oil', reason: 'The oil captures flavor; the solids (which contain FODMAPs) are strained out', brand: 'Fody' },
      { name: 'Asafoetida (hing)', reason: 'Provides savory depth — start with a very small pinch' },
      { name: 'Green scallion tops (green part only)', reason: 'Lower FODMAP than garlic; use the green portion only' },
    ],
    diyTip: 'Gently heat 2 cloves of garlic in ¼ cup olive oil for 5 min, then discard cloves. The flavored oil is low FODMAP.',
  },
  'garlic powder': {
    original: 'Garlic powder',
    alternatives: [
      { name: 'Garlic-infused olive oil', reason: 'Use infused oil instead of dry powder', brand: 'Fody' },
      { name: 'Asafoetida (hing)', reason: 'Similar savory depth, much lower FODMAP' },
    ],
  },
  onion: {
    original: 'Onion',
    alternatives: [
      { name: 'Onion-infused olive oil', reason: 'The oil is low FODMAP; the onion solids are not', brand: 'Fody' },
      { name: 'Chives — green parts only', reason: 'Much lower FODMAP than onion bulb' },
      { name: 'Green scallion tops (green part only)', reason: 'Gives fresh onion flavor without FODMAPs' },
    ],
    diyTip: 'Sauté onion in oil, then remove the pieces before eating — or make onion-infused oil.',
  },
  'onion powder': {
    original: 'Onion powder',
    alternatives: [
      { name: 'Chive flakes (dried)', reason: 'Green onion tops, dried — lower FODMAP' },
      { name: 'Onion-infused oil', reason: 'Use infused oil for savory onion flavor' },
    ],
  },
  wheat: {
    original: 'Wheat',
    alternatives: [
      { name: 'Rice flour', reason: 'Low FODMAP staple grain substitute' },
      { name: 'Oat flour (certified GF)', reason: 'Low FODMAP; check for added chicory/inulin' },
      { name: 'Tapioca starch', reason: 'Gluten-free, low FODMAP thickener' },
      { name: 'Potato starch', reason: 'Low FODMAP thickener for sauces and baking' },
    ],
  },
  'wheat flour': {
    original: 'Wheat flour',
    alternatives: [
      { name: 'Bob\'s Red Mill 1-to-1 GF Baking Flour', reason: 'Drop-in wheat flour replacement, low FODMAP', brand: "Bob's Red Mill" },
      { name: 'Rice flour blend', reason: 'Mix rice + tapioca + potato starch for best texture' },
    ],
  },
  barley: {
    original: 'Barley',
    alternatives: [
      { name: 'Oats (certified gluten-free)', reason: 'Low FODMAP whole grain option' },
      { name: 'Brown rice', reason: 'Low FODMAP and widely available' },
      { name: 'Quinoa', reason: 'Low FODMAP, high protein whole grain' },
    ],
  },
  rye: {
    original: 'Rye',
    alternatives: [
      { name: 'Sourdough spelt (small serve)', reason: 'Fermentation reduces fructan content' },
      { name: 'Rice crackers', reason: 'Low FODMAP snack alternative' },
    ],
  },
  inulin: {
    original: 'Inulin / Chicory root fiber',
    alternatives: [
      { name: 'Psyllium husk (small amount)', reason: 'Low FODMAP prebiotic fiber — use ¼ tsp max' },
      { name: 'Oat bran', reason: 'Low FODMAP soluble fiber source' },
    ],
    diyTip: 'When buying protein bars, look for ones without inulin or chicory root — check for "Contains: chicory root" in the ingredient list.',
  },
  milk: {
    original: 'Milk',
    alternatives: [
      { name: 'Lactose-free cow\'s milk', reason: 'Same taste and nutrition; lactose removed', brand: 'Lactaid' },
      { name: 'Oat milk (plain, no additives)', reason: 'Creamy and low FODMAP in ½ cup serves', brand: 'Oatly' },
      { name: 'Almond milk (unsweetened)', reason: 'Low FODMAP; check for added honey or inulin' },
      { name: 'Rice milk', reason: 'Neutral taste, low FODMAP' },
    ],
  },
  cream: {
    original: 'Cream',
    alternatives: [
      { name: 'Lactose-free cream', reason: 'Same richness, lactose removed' },
      { name: 'Coconut cream (canned)', reason: 'Rich and creamy; low FODMAP in ⅓ cup serves' },
    ],
  },
  butter: {
    original: 'Butter',
    alternatives: [
      { name: 'Regular butter (small amount)', reason: 'Butter is actually very low in lactose — most people tolerate it' },
      { name: 'Lactose-free butter', reason: 'For high sensitivity', brand: 'Organic Valley' },
      { name: 'Ghee (clarified butter)', reason: 'Milk solids removed — nearly lactose-free' },
    ],
  },
  yogurt: {
    original: 'Yogurt',
    alternatives: [
      { name: 'Lactose-free yogurt', reason: 'Same taste; lactose enzymatically removed', brand: 'Green Valley' },
      { name: 'Coconut yogurt (plain)', reason: 'Low FODMAP dairy-free option' },
      { name: 'Hard cheeses (small amount)', reason: 'Aged cheeses like cheddar are very low in lactose' },
    ],
  },
  cheese: {
    original: 'Cheese',
    alternatives: [
      { name: 'Hard aged cheese (cheddar, parmesan)', reason: 'Ageing removes most lactose — generally well-tolerated' },
      { name: 'Lactose-free cheese', reason: 'For high sensitivity' },
      { name: 'Nutritional yeast', reason: 'Dairy-free cheesy flavor, low FODMAP' },
    ],
  },
  'cream cheese': {
    original: 'Cream cheese',
    alternatives: [
      { name: 'Lactose-free cream cheese', reason: 'Same spreadable texture, lactose removed' },
      { name: 'Firm tofu (blended smooth)', reason: 'Dairy-free cream cheese alternative' },
    ],
  },
  apple: {
    original: 'Apple',
    alternatives: [
      { name: 'Blueberries', reason: 'Low FODMAP, sweet, antioxidant-rich' },
      { name: 'Strawberries', reason: 'Low FODMAP, naturally sweet' },
      { name: 'Firm banana (unripe)', reason: 'Low FODMAP; ripe/overripe are higher FODMAP' },
      { name: 'Grapes (small serve)', reason: 'Low FODMAP in servings of ~1 cup' },
    ],
  },
  pear: {
    original: 'Pear',
    alternatives: [
      { name: 'Cantaloupe / rockmelon', reason: 'Low FODMAP melon option' },
      { name: 'Papaya (pawpaw)', reason: 'Low FODMAP tropical fruit' },
      { name: 'Kiwi fruit', reason: 'Low FODMAP and high in vitamin C' },
    ],
  },
  mango: {
    original: 'Mango',
    alternatives: [
      { name: 'Papaya (small serve)', reason: 'Low FODMAP tropical alternative' },
      { name: 'Pineapple (fresh)', reason: 'Low FODMAP in ½ cup serves' },
      { name: 'Passion fruit', reason: 'Low FODMAP, tropical flavor' },
    ],
  },
  honey: {
    original: 'Honey',
    alternatives: [
      { name: 'Pure maple syrup', reason: 'Low FODMAP sweetener — 2 tbsp is a safe serve' },
      { name: 'Rice malt syrup', reason: 'Fructose-free sweetener, low FODMAP' },
      { name: 'Glucose syrup', reason: 'Pure glucose — no fructose' },
      { name: 'Stevia (pure)', reason: 'Zero FODMAP, no calories; check for polyol fillers' },
    ],
  },
  agave: {
    original: 'Agave / Agave nectar',
    alternatives: [
      { name: 'Pure maple syrup', reason: 'Low FODMAP and similar consistency' },
      { name: 'Rice malt syrup', reason: 'Low fructose, low FODMAP' },
    ],
  },
  sorbitol: {
    original: 'Sorbitol',
    alternatives: [
      { name: 'Stevia (pure)', reason: 'No polyols; check for other fillers' },
      { name: 'Maple syrup', reason: 'Low FODMAP natural sweetener' },
      { name: 'Dextrose / glucose', reason: 'No polyols, absorbs easily' },
    ],
  },
  xylitol: {
    original: 'Xylitol',
    alternatives: [
      { name: 'Stevia (pure)', reason: 'No polyols, tooth-friendly' },
      { name: 'Erythritol (small amount)', reason: 'Lower FODMAP than xylitol — still use sparingly' },
    ],
  },
  mushroom: {
    original: 'Mushroom',
    alternatives: [
      { name: 'Oyster mushrooms (small serve)', reason: 'Lower FODMAP than button or portobello' },
      { name: 'Zucchini', reason: 'Similar umami when roasted; low FODMAP' },
      { name: 'Eggplant / aubergine', reason: 'Meaty texture without polyols' },
    ],
  },
  cauliflower: {
    original: 'Cauliflower',
    alternatives: [
      { name: 'Broccoli (small ½ cup serve)', reason: 'Lower FODMAP in controlled portions' },
      { name: 'Parsnip', reason: 'Low FODMAP root vegetable' },
      { name: 'Celeriac', reason: 'Similar texture; low FODMAP' },
    ],
  },
  chickpea: {
    original: 'Chickpea',
    alternatives: [
      { name: 'Canned chickpeas (rinsed, ¼ cup max)', reason: 'Rinsing reduces GOS significantly' },
      { name: 'Firm tofu', reason: 'Low FODMAP protein alternative' },
      { name: 'Eggs', reason: 'High protein, no FODMAP' },
    ],
  },
  lentil: {
    original: 'Lentil',
    alternatives: [
      { name: 'Canned green lentils (rinsed, ¼ cup)', reason: 'Rinsing reduces GOS; use sparingly' },
      { name: 'Firm tofu', reason: 'Low FODMAP plant protein' },
      { name: 'Tempeh (small serve)', reason: 'Fermentation reduces GOS content' },
    ],
  },
  cashew: {
    original: 'Cashew',
    alternatives: [
      { name: 'Macadamia nuts (10 nuts)', reason: 'Low FODMAP and rich' },
      { name: 'Pumpkin seeds (pepitas)', reason: 'Low FODMAP seed alternative' },
      { name: 'Walnuts (10 halves)', reason: 'Low FODMAP nut option' },
    ],
  },
  'soy milk': {
    original: 'Soy milk',
    alternatives: [
      { name: 'Oat milk (plain)', reason: 'Low FODMAP in ½ cup serves', brand: 'Oatly' },
      { name: 'Rice milk', reason: 'Low FODMAP, neutral flavor' },
      { name: 'Almond milk (unsweetened)', reason: 'Low FODMAP; avoid brands with inulin' },
    ],
  },
  tofu: {
    original: 'Tofu (silken)',
    alternatives: [
      { name: 'Firm tofu', reason: 'Firm/extra-firm tofu is low FODMAP; silken has more GOS' },
      { name: 'Eggs', reason: 'No FODMAP protein alternative' },
      { name: 'Chicken or fish', reason: 'Animal protein — no FODMAP content' },
    ],
  },
};

function generateSwaps(flaggedIngredients: ScanResult['flaggedIngredients']): SwapSuggestion[] {
  const swaps: SwapSuggestion[] = [];
  const seen = new Set<string>();

  for (const { ingredient } of flaggedIngredients) {
    const normalized = normalizeIngredient(ingredient);

    for (const [key, swap] of Object.entries(SWAP_DATABASE)) {
      if (normalized.includes(normalizeIngredient(key)) && !seen.has(key)) {
        swaps.push(swap);
        seen.add(key);
        break;
      }
    }
  }

  return swaps;
}

// ============================================================================
// Triage / Symptom Narrowing
// ============================================================================

export interface TriageInput {
  symptoms: string[];
  badFoods: string[];
  goodFoods: string[];
  redFlags?: string[];
}

export function triageSymptoms(input: TriageInput): TriageResult {
  const subgroupScores: Record<FODMAPSubgroup, number> = {
    lactose: 0,
    fructans: 0,
    gos: 0,
    fructose: 0,
    polyols: 0,
  };

  const redFlagKeywords = ['weight loss', 'blood', 'fever', 'severe pain', 'persistent diarrhea', 'rectal bleeding', 'night sweats'];
  const hasRedFlag = input.redFlags?.some(flag =>
    redFlagKeywords.some(rf => normalizeIngredient(flag).includes(normalizeIngredient(rf)))
  );

  if (hasRedFlag) {
    return {
      likelySubgroups: [],
      confidence: 'low',
      recommendation:
        'Your symptoms may not be FODMAP-related. Please see a doctor or gastroenterologist urgently to rule out other conditions.',
      shouldSeeDietitian: true,
    };
  }

  for (const food of input.badFoods) {
    if (ingredientMatches(food, LACTOSE)) subgroupScores.lactose += 2;
    if (ingredientMatches(food, FRUCTANS)) subgroupScores.fructans += 2;
    if (ingredientMatches(food, GOS)) subgroupScores.gos += 2;
    if (ingredientMatches(food, EXCESS_FRUCTOSE)) subgroupScores.fructose += 2;
    if (ingredientMatches(food, POLYOLS)) subgroupScores.polyols += 2;
  }

  for (const food of input.goodFoods) {
    if (!ingredientMatches(food, LACTOSE)) subgroupScores.lactose -= 0.5;
    if (!ingredientMatches(food, FRUCTANS)) subgroupScores.fructans -= 0.5;
    if (!ingredientMatches(food, GOS)) subgroupScores.gos -= 0.5;
    if (!ingredientMatches(food, EXCESS_FRUCTOSE)) subgroupScores.fructose -= 0.5;
    if (!ingredientMatches(food, POLYOLS)) subgroupScores.polyols -= 0.5;
  }

  if (input.symptoms.includes('pain') || input.symptoms.includes('constipation')) {
    subgroupScores.fructans += 1;
    subgroupScores.gos += 1;
  }
  if (input.symptoms.includes('diarrhea')) {
    subgroupScores.fructose += 1;
    subgroupScores.polyols += 1;
    subgroupScores.lactose += 1;
  }
  if (input.symptoms.includes('bloating') || input.symptoms.includes('gas')) {
    subgroupScores.fructans += 0.5;
    subgroupScores.gos += 0.5;
  }

  const ranked = Object.entries(subgroupScores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0)
    .map(([subgroup]) => subgroup as FODMAPSubgroup);

  const likelySubgroups = ranked.slice(0, 3);
  const confidence: 'high' | 'medium' | 'low' = likelySubgroups.length >= 2 ? 'high' : likelySubgroups.length === 1 ? 'medium' : 'low';

  let recommendation = '';
  if (likelySubgroups.length === 0) {
    recommendation =
      'No clear FODMAP pattern detected based on the foods you listed. Your symptoms may have a different cause. Please consult a healthcare provider.';
  } else {
    const subgroupNames = likelySubgroups.map(sg => SUBGROUP_INFO[sg].label).join(', ');
    recommendation = `Based on your reported foods and symptoms, you may be sensitive to: ${subgroupNames}. Try a low-FODMAP elimination diet for 2–6 weeks, then carefully reintroduce foods one at a time.`;
  }

  return {
    likelySubgroups,
    confidence,
    recommendation,
    shouldSeeDietitian: true,
  };
}

// ============================================================================
// Subgroup Metadata
// ============================================================================

export const SUBGROUP_INFO: Record<FODMAPSubgroup, { label: string; icon: string; color: string; description: string }> = {
  lactose: { label: 'Lactose', icon: '🥛', color: 'bg-blue-100 text-blue-900', description: 'Found in milk, soft cheeses, yogurt, and ice cream' },
  fructans: { label: 'Fructans', icon: '🧄', color: 'bg-amber-100 text-amber-900', description: 'Found in garlic, onion, wheat, rye, and some fruits' },
  gos: { label: 'GOS', icon: '🫘', color: 'bg-green-100 text-green-900', description: 'Found in legumes, beans, lentils, and cashews' },
  fructose: { label: 'Fructose', icon: '🍎', color: 'bg-red-100 text-red-900', description: 'Found in apples, pears, honey, agave, and fruit juice' },
  polyols: { label: 'Polyols', icon: '🍄', color: 'bg-purple-100 text-purple-900', description: 'Found in stone fruits, mushrooms, cauliflower, and sugar alcohols' },
};
