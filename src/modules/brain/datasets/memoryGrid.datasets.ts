import type { MemoryGridDataset } from '../types';

const everydayItems = [
  { id: 'keys', label_de: 'Schlüsselbund', label_en: 'Keys' },
  { id: 'glasses', label_de: 'Brille', label_en: 'Glasses' },
  { id: 'phone', label_de: 'Handy', label_en: 'Phone' },
  { id: 'wallet', label_de: 'Geldbörse', label_en: 'Wallet' },
  { id: 'umbrella', label_de: 'Regenschirm', label_en: 'Umbrella' },
  { id: 'newspaper', label_de: 'Zeitung', label_en: 'Newspaper' },
  { id: 'shopping', label_de: 'Einkaufstasche', label_en: 'Shopping bag' },
  { id: 'mug', label_de: 'Kaffeetasse', label_en: 'Coffee mug' },
  { id: 'remote', label_de: 'Fernbedienung', label_en: 'Remote control' },
  { id: 'notebook', label_de: 'Notizblock', label_en: 'Notebook' },
  { id: 'bottle', label_de: 'Wasserflasche', label_en: 'Water bottle' },
  { id: 'pillow', label_de: 'Kissen', label_en: 'Cushion' },
];

const kitchenItems = [
  { id: 'pan', label_de: 'Pfanne', label_en: 'Pan' },
  { id: 'pot', label_de: 'Topf', label_en: 'Pot' },
  { id: 'spoon', label_de: 'Löffel', label_en: 'Spoon' },
  { id: 'fork', label_de: 'Gabel', label_en: 'Fork' },
  { id: 'plate', label_de: 'Teller', label_en: 'Plate' },
  { id: 'cup', label_de: 'Tasse', label_en: 'Cup' },
  { id: 'board', label_de: 'Schneidebrett', label_en: 'Cutting board' },
  { id: 'knife', label_de: 'Messer', label_en: 'Knife' },
  { id: 'kettle', label_de: 'Wasserkocher', label_en: 'Kettle' },
  { id: 'toaster', label_de: 'Toaster', label_en: 'Toaster' },
  { id: 'bowl', label_de: 'Schüssel', label_en: 'Bowl' },
  { id: 'ladle', label_de: 'Kochlöffel', label_en: 'Cooking spoon' },
];

const natureItems = [
  { id: 'tree', label_de: 'Baum', label_en: 'Tree' },
  { id: 'flower', label_de: 'Blume', label_en: 'Flower' },
  { id: 'river', label_de: 'Fluss', label_en: 'River' },
  { id: 'mountain', label_de: 'Berg', label_en: 'Mountain' },
  { id: 'sun', label_de: 'Sonne', label_en: 'Sun' },
  { id: 'cloud', label_de: 'Wolke', label_en: 'Cloud' },
  { id: 'leaf', label_de: 'Blatt', label_en: 'Leaf' },
  { id: 'shell', label_de: 'Muschel', label_en: 'Shell' },
  { id: 'stone', label_de: 'Stein', label_en: 'Stone' },
  { id: 'mushroom', label_de: 'Pilz', label_en: 'Mushroom' },
  { id: 'bird', label_de: 'Vogel', label_en: 'Bird' },
  { id: 'sea', label_de: 'Meer', label_en: 'Sea' },
];

export const memoryGridDatasets: Record<string, MemoryGridDataset> = {
  everyday_grid: {
    puzzleType: 'memory-grid',
    datasetKey: 'everyday_grid',
    titleHint_de: 'Präge dir die gezeigten Alltagswörter und ihre Positionen ein.',
    titleHint_en: 'Remember the everyday words and their positions.',
    items: everydayItems,
  },
  kitchen_grid: {
    puzzleType: 'memory-grid',
    datasetKey: 'kitchen_grid',
    titleHint_de: 'Küchenwörter kurz anzeigen, dann die Reihenfolge nachtippen.',
    titleHint_en: 'Kitchen words flash briefly, then repeat their spots.',
    items: kitchenItems,
  },
  nature_grid: {
    puzzleType: 'memory-grid',
    datasetKey: 'nature_grid',
    titleHint_de: 'Naturbegriffe merken und die Positionen wiederholen.',
    titleHint_en: 'Memorize nature words and replay the positions.',
    items: natureItems,
  },
};


