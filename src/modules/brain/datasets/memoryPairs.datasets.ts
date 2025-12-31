import type { MemoryPairsDataset } from '../types';

const everydayPairs = [
  { id: 'keys', label_de: 'Schlüsselbund', label_en: 'Keys' },
  { id: 'glasses', label_de: 'Brille', label_en: 'Glasses' },
  { id: 'phone', label_de: 'Handy', label_en: 'Phone' },
  { id: 'wallet', label_de: 'Geldbörse', label_en: 'Wallet' },
  { id: 'umbrella', label_de: 'Regenschirm', label_en: 'Umbrella' },
  { id: 'book', label_de: 'Buch', label_en: 'Book' },
  { id: 'candle', label_de: 'Kerze', label_en: 'Candle' },
  { id: 'bag', label_de: 'Tasche', label_en: 'Bag' },
  { id: 'watch', label_de: 'Armbanduhr', label_en: 'Watch' },
  { id: 'headphones', label_de: 'Kopfhörer', label_en: 'Headphones' },
  { id: 'bottle', label_de: 'Trinkflasche', label_en: 'Water bottle' },
  { id: 'camera', label_de: 'Kamera', label_en: 'Camera' },
];

const householdPairs = [
  { id: 'broom', label_de: 'Besen', label_en: 'Broom' },
  { id: 'sponge', label_de: 'Schwamm', label_en: 'Sponge' },
  { id: 'bucket', label_de: 'Eimer', label_en: 'Bucket' },
  { id: 'towel', label_de: 'Handtuch', label_en: 'Towel' },
  { id: 'pillow', label_de: 'Kissen', label_en: 'Pillow' },
  { id: 'blanket', label_de: 'Decke', label_en: 'Blanket' },
  { id: 'plate', label_de: 'Teller', label_en: 'Plate' },
  { id: 'knife', label_de: 'Messer', label_en: 'Knife' },
  { id: 'chair', label_de: 'Stuhl', label_en: 'Chair' },
  { id: 'table', label_de: 'Tisch', label_en: 'Table' },
  { id: 'lamp', label_de: 'Lampe', label_en: 'Lamp' },
  { id: 'plant', label_de: 'Topfpflanze', label_en: 'Potted plant' },
];

const clothingPairs = [
  { id: 'shirt', label_de: 'Hemd', label_en: 'Shirt' },
  { id: 'shoe', label_de: 'Schuh', label_en: 'Shoe' },
  { id: 'hat', label_de: 'Hut', label_en: 'Hat' },
  { id: 'scarf', label_de: 'Schal', label_en: 'Scarf' },
  { id: 'sock', label_de: 'Socke', label_en: 'Sock' },
  { id: 'jacket', label_de: 'Jacke', label_en: 'Jacket' },
  { id: 'belt', label_de: 'Gürtel', label_en: 'Belt' },
  { id: 'glove', label_de: 'Handschuh', label_en: 'Glove' },
  { id: 'dress', label_de: 'Kleid', label_en: 'Dress' },
  { id: 'jeans', label_de: 'Jeans', label_en: 'Jeans' },
  { id: 'boots', label_de: 'Stiefel', label_en: 'Boots' },
  { id: 'cap', label_de: 'Mütze', label_en: 'Beanie' },
];

export const memoryPairsDatasets: Record<string, MemoryPairsDataset> = {
  everyday_pairs: {
    puzzleType: 'memory-pairs',
    datasetKey: 'everyday_pairs',
    pairs: everydayPairs,
  },
  household_pairs: {
    puzzleType: 'memory-pairs',
    datasetKey: 'household_pairs',
    pairs: householdPairs,
  },
  clothing_pairs: {
    puzzleType: 'memory-pairs',
    datasetKey: 'clothing_pairs',
    pairs: clothingPairs,
  },
};


