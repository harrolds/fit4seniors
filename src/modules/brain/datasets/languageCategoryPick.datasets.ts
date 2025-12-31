import type { LanguageCategoryPickDataset } from '../types';

const fruitsSets = [
  {
    prompt_de: 'Welches Wort ist ein Obst?',
    prompt_en: 'Which word is a fruit?',
    options: ['Apfel', 'Schraube', 'Stuhl', 'Lampe'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort passt zur Obstschale?',
    prompt_en: 'Which word belongs in a fruit bowl?',
    options: ['Schraube', 'Birne', 'Besen', 'Hemd'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Welches Wort ist ein süßes Obst?',
    prompt_en: 'Which word is a sweet fruit?',
    options: ['Traube', 'Tasse', 'Löffel', 'Brille'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort beschreibt Obst?',
    prompt_en: 'Which word describes fruit?',
    options: ['Pfanne', 'Kirsche', 'Topf', 'Teppich'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Welches Wort kann man essen?',
    prompt_en: 'Which word is edible fruit?',
    options: ['Orange', 'Gabel', 'Messer', 'Kissen'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort ist eine Frucht?',
    prompt_en: 'Which word is a fruit?',
    options: ['Nagel', 'Zange', 'Eimer', 'Pflaume'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist exotisches Obst?',
    prompt_en: 'Which word is exotic fruit?',
    options: ['Bohrer', 'Zollstock', 'Bürste', 'Mango'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist ein Obststück?',
    prompt_en: 'Which word is a piece of fruit?',
    options: ['Ananas', 'Schlüssel', 'Koffer', 'Schere'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Welches Wort gehört zum Nachtisch?',
    prompt_en: 'Which word fits dessert fruit?',
    options: ['Computer', 'Schreibtisch', 'Tacker', 'Erdbeere'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist eine Beere?',
    prompt_en: 'Which word is a berry?',
    options: ['Schraubenzieher', 'Spachtel', 'Säge', 'Himbeere'],
    answerIndex: 3,
  },
];

const toolsSets = [
  {
    prompt_de: 'Welches Wort ist ein Werkzeug?',
    prompt_en: 'Which word is a tool?',
    options: ['Hammer', 'Apfel', 'Banane', 'Kissen'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Was brauchst du zum Schrauben?',
    prompt_en: 'What do you need for screws?',
    options: ['Bett', 'Schraubenzieher', 'Lampe', 'Löffel'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Was gehört in den Werkzeugkasten?',
    prompt_en: 'What belongs in the toolbox?',
    options: ['Pfanne', 'Teller', 'Blume', 'Zange'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort steht für ein Sägeblatt?',
    prompt_en: 'Which word is about cutting wood?',
    options: ['Säge', 'Stuhl', 'Teppich', 'Buch'],
    answerIndex: 0,
  },
  {
    prompt_de: 'Womit bohrst du Löcher?',
    prompt_en: 'What drills holes?',
    options: ['Herd', 'Fenster', 'Teekanne', 'Bohrer'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Werkzeug misst die Waage?',
    prompt_en: 'Which item levels things?',
    options: ['Tomate', 'Paprika', 'Glas', 'Wasserwaage'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort gehört zur Feinarbeit?',
    prompt_en: 'Which word is a fine tool?',
    options: ['Gabel', 'Kuchen', 'Kleid', 'Feile'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort ist ein Schraubwerkzeug?',
    prompt_en: 'Which word is a screw tool?',
    options: ['Handtasche', 'Schraubenschlüssel', 'Schal', 'Kamm'],
    answerIndex: 1,
  },
  {
    prompt_de: 'Welches Wort nutzt du zum Schneiden im Werkraum?',
    prompt_en: 'Which word is a cutting tool?',
    options: ['Birne', 'Orange', 'Brot', 'Messer'],
    answerIndex: 3,
  },
  {
    prompt_de: 'Welches Wort klebt Bastelarbeiten?',
    prompt_en: 'Which word helps glue crafts?',
    options: ['Heißklebepistole', 'Stoff', 'Kissen', 'Teller'],
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


