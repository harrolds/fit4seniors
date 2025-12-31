import type { LanguageCategoryPickDataset } from '../types';

const fruitsSets = [
  {
    prompt_de: 'Welches Wort ist ein Obst?',
    prompt_en: 'Which word is a fruit?',
    options_de: ['Apfel', 'Schraube', 'Stuhl', 'Lampe'],
    options_en: ['Apple', 'Screw', 'Chair', 'Lamp'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort passt zur Obstschale?',
    prompt_en: 'Which word belongs in a fruit bowl?',
    options_de: ['Schraube', 'Birne', 'Besen', 'Hemd'],
    options_en: ['Screw', 'Pear', 'Broom', 'Shirt'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Welches Wort ist ein süßes Obst?',
    prompt_en: 'Which word is a sweet fruit?',
    options_de: ['Traube', 'Tasse', 'Löffel', 'Brille'],
    options_en: ['Grape', 'Cup', 'Spoon', 'Glasses'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort beschreibt Obst?',
    prompt_en: 'Which word describes fruit?',
    options_de: ['Pfanne', 'Kirsche', 'Topf', 'Teppich'],
    options_en: ['Pan', 'Cherry', 'Pot', 'Carpet'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Welches Wort kann man essen?',
    prompt_en: 'Which word is edible fruit?',
    options_de: ['Orange', 'Gabel', 'Messer', 'Kissen'],
    options_en: ['Orange', 'Fork', 'Knife', 'Pillow'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort ist eine Frucht?',
    prompt_en: 'Which word is a fruit?',
    options_de: ['Nagel', 'Zange', 'Eimer', 'Pflaume'],
    options_en: ['Nail', 'Pliers', 'Bucket', 'Plum'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist exotisches Obst?',
    prompt_en: 'Which word is exotic fruit?',
    options_de: ['Bohrer', 'Zollstock', 'Bürste', 'Mango'],
    options_en: ['Drill', 'Measuring tape', 'Brush', 'Mango'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist ein Obststück?',
    prompt_en: 'Which word is a piece of fruit?',
    options_de: ['Ananas', 'Schlüssel', 'Koffer', 'Schere'],
    options_en: ['Pineapple', 'Key', 'Suitcase', 'Scissors'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort gehört zum Nachtisch?',
    prompt_en: 'Which word fits dessert fruit?',
    options_de: ['Computer', 'Schreibtisch', 'Tacker', 'Erdbeere'],
    options_en: ['Computer', 'Desk', 'Stapler', 'Strawberry'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist eine Beere?',
    prompt_en: 'Which word is a berry?',
    options_de: ['Schraubenzieher', 'Spachtel', 'Säge', 'Himbeere'],
    options_en: ['Screwdriver', 'Spatula', 'Saw', 'Raspberry'],
    answerIndex: 3,
  },
];

const toolsSets = [
  {
    prompt_de: 'Welches Wort ist ein Werkzeug?',
    prompt_en: 'Which word is a tool?',
    options_de: ['Hammer', 'Apfel', 'Banane', 'Kissen'],
    options_en: ['Hammer', 'Apple', 'Banana', 'Pillow'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Was brauchst du zum Schrauben?',
    prompt_en: 'What do you need for screws?',
    options_de: ['Bett', 'Schraubenzieher', 'Lampe', 'Löffel'],
    options_en: ['Bed', 'Screwdriver', 'Lamp', 'Spoon'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Was gehört in den Werkzeugkasten?',
    prompt_en: 'What belongs in the toolbox?',
    options_de: ['Pfanne', 'Teller', 'Blume', 'Zange'],
    options_en: ['Pan', 'Plate', 'Flower', 'Pliers'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort steht für ein Sägeblatt?',
    prompt_en: 'Which word is about cutting wood?',
    options_de: ['Säge', 'Stuhl', 'Teppich', 'Buch'],
    options_en: ['Saw', 'Chair', 'Carpet', 'Book'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Womit bohrst du Löcher?',
    prompt_en: 'What drills holes?',
    options_de: ['Herd', 'Fenster', 'Teekanne', 'Bohrer'],
    options_en: ['Stove', 'Window', 'Teapot', 'Drill'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Werkzeug misst die Waage?',
    prompt_en: 'Which item levels things?',
    options_de: ['Tomate', 'Paprika', 'Glas', 'Wasserwaage'],
    options_en: ['Tomato', 'Bell pepper', 'Glass', 'Spirit level'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort gehört zur Feinarbeit?',
    prompt_en: 'Which word is a fine tool?',
    options_de: ['Gabel', 'Kuchen', 'Kleid', 'Feile'],
    options_en: ['Fork', 'Cake', 'Dress', 'File'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist ein Schraubwerkzeug?',
    prompt_en: 'Which word is a screw tool?',
    options_de: ['Handtasche', 'Schraubenschlüssel', 'Schal', 'Kamm'],
    options_en: ['Handbag', 'Wrench', 'Scarf', 'Comb'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Welches Wort nutzt du zum Schneiden im Werkraum?',
    prompt_en: 'Which word is a cutting tool?',
    options_de: ['Birne', 'Orange', 'Brot', 'Messer'],
    options_en: ['Pear', 'Orange', 'Bread', 'Knife'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort klebt Bastelarbeiten?',
    prompt_en: 'Which word helps glue crafts?',
    options_de: ['Heißklebepistole', 'Stoff', 'Kissen', 'Teller'],
    options_en: ['Hot glue gun', 'Fabric', 'Pillow', 'Plate'],
    answerIndex: 0,
  },
];

export const languageCategoryPickDatasets: Record<string, LanguageCategoryPickDataset> = {
  fruits_pick: {
    puzzleType: 'language-categorypick',
    datasetKey: 'fruits_pick',
    sets: fruitsSets,
  },
  tools_pick: {
    puzzleType: 'language-categorypick',
    datasetKey: 'tools_pick',
    sets: toolsSets,
  },
};


