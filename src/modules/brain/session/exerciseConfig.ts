import { ChoiceRoundData } from '../templates/ChoiceTemplate';
import { OddOneOutRoundData } from '../templates/OddOneOutTemplate';

export type ExerciseRuntimeConfig = {
  roundsTotal: number;
  template: 'wordpuzzle' | 'choice' | 'odd_one_out';
  buildRound: (roundIndex: number) => ChoiceRoundData | OddOneOutRoundData;
};

const STORY_GAP_ROUNDS: ChoiceRoundData[] = [
  {
    prompt: 'Setze das fehlende Wort ein: Anna ging zum Markt und kaufte frisches _____.',
    options: ['Brot', 'Meer', 'Gewitter', 'Eis'],
    correctIndex: 0,
    helper: 'Denke an das Frühstück.',
  },
  {
    prompt: 'Er legte den Schlüssel auf den ____ und ging schlafen.',
    options: ['Tisch', 'Berg', 'Himmel', 'Fluss'],
    correctIndex: 0,
  },
  {
    prompt: 'Nach dem Regen erschien ein bunter ____ über der Stadt.',
    options: ['Regenbogen', 'Sandkasten', 'Schneesturm', 'Kaktus'],
    correctIndex: 0,
  },
  {
    prompt: 'Zum Frühstück trank sie ein Glas ____.',
    options: ['Orangensaft', 'Salz', 'Staub', 'Kiesel'],
    correctIndex: 0,
  },
  {
    prompt: 'Die Katze schlief friedlich auf der warmen ____.',
    options: ['Decke', 'Straße', 'Wolke', 'Torte'],
    correctIndex: 0,
  },
];

const MEMORY_OBJECTS_ROUNDS: ChoiceRoundData[] = [
  { prompt: 'Welcher Gegenstand leuchtet?', options: ['Lampe', 'Decke', 'Buch', 'Tasse'], correctIndex: 0 },
  { prompt: 'Womit schreibst du eine Notiz?', options: ['Stift', 'Glas', 'Teller', 'Besen'], correctIndex: 0 },
  { prompt: 'Was gehört in den Kühlschrank?', options: ['Milch', 'Handschuh', 'Zeitung', 'Schlüssel'], correctIndex: 0 },
  { prompt: 'Was setzt du auf, wenn die Sonne stark scheint?', options: ['Hut', 'Schal', 'Schuh', 'Handschuh'], correctIndex: 0 },
  { prompt: 'Welches Werkzeug schneidet Papier?', options: ['Schere', 'Ball', 'Kissen', 'Kerze'], correctIndex: 0 },
];

const ATTENTION_ODD_ROUNDS: OddOneOutRoundData[] = [
  {
    prompt: 'Was passt nicht dazu?',
    options: ['Apfel', 'Banane', 'Karotte', 'Birne'],
    oddIndex: 2,
    helper: 'Drei davon sind Obst.',
  },
  {
    prompt: 'Finde das Tier, das nicht fliegt.',
    options: ['Spatz', 'Adler', 'Pinguin', 'Amsel'],
    oddIndex: 2,
  },
  {
    prompt: 'Welche Form weicht ab?',
    options: ['Quadrat', 'Dreieck', 'Kreis', 'Linie'],
    oddIndex: 3,
  },
  {
    prompt: 'Welches Ding gehört nicht ins Bad?',
    options: ['Handtuch', 'Seife', 'Zahnbürste', 'Bratpfanne'],
    oddIndex: 3,
  },
  {
    prompt: 'Welche Richtung passt nicht in die Reihe?',
    options: ['Norden', 'Süden', 'Osten', 'Heute'],
    oddIndex: 3,
  },
];

const ATTENTION_COLOR_WORD_ROUNDS: ChoiceRoundData[] = [
  {
    prompt: 'Wähle die Farbe: GRÜN',
    options: ['Grün', 'Rot', 'Blau', 'Gelb'],
    correctIndex: 0,
    helper: 'Ignoriere die Schriftfarbe, lies das Wort.',
  },
  { prompt: 'Wähle die Farbe: BLAU', options: ['Gelb', 'Blau', 'Rot', 'Grau'], correctIndex: 1 },
  { prompt: 'Wähle die Farbe: ROT', options: ['Rot', 'Grün', 'Orange', 'Lila'], correctIndex: 0 },
  { prompt: 'Wähle die Farbe: GELB', options: ['Schwarz', 'Weiß', 'Gelb', 'Braun'], correctIndex: 2 },
  { prompt: 'Wähle die Farbe: GRAU', options: ['Grau', 'Rosa', 'Türkis', 'Grün'], correctIndex: 0 },
];

const LOGIC_SERIES_ROUNDS: ChoiceRoundData[] = [
  { prompt: '2, 4, 6, ?', options: ['7', '8', '9', '10'], correctIndex: 1 },
  { prompt: '5, 10, 15, ?', options: ['18', '20', '22', '25'], correctIndex: 1 },
  { prompt: '1, 3, 6, 10, ?', options: ['13', '14', '15', '16'], correctIndex: 2 },
  { prompt: '9, 7, 5, ?', options: ['3', '4', '2', '1'], correctIndex: 0 },
  { prompt: '4, 8, 16, ?', options: ['24', '28', '32', '36'], correctIndex: 2 },
];

const LOGIC_GROUPING_ROUNDS: OddOneOutRoundData[] = [
  { prompt: 'Welches Wort passt nicht in die Blumen-Gruppe?', options: ['Rose', 'Tulpe', 'Lilie', 'Stein'], oddIndex: 3 },
  { prompt: 'Welche Zahl ist nicht gerade?', options: ['8', '12', '15', '4'], oddIndex: 2 },
  { prompt: 'Welcher Begriff ist kein Wochentag?', options: ['Montag', 'Mittwoch', 'Freitag', 'Februar'], oddIndex: 3 },
  { prompt: 'Welche Farbe ist keine warme Farbe?', options: ['Rot', 'Orange', 'Gelb', 'Blau'], oddIndex: 3 },
  { prompt: 'Welches Tier lebt nicht im Wasser?', options: ['Karpfen', 'Hai', 'Delfin', 'Dachs'], oddIndex: 3 },
];

const FLEX_REVERSE_ROUNDS: ChoiceRoundData[] = [
  {
    prompt: "Tippe NICHT auf 'Ja'.",
    options: ['Ja', 'Nein', 'Vielleicht'],
    correctIndex: 1,
    helper: 'Denk an das Gegenteil.',
  },
  { prompt: "Antworte mit 'Nein', auch wenn es stimmt.", options: ['Ja', 'Nein', 'Unklar'], correctIndex: 1 },
  { prompt: 'Wähle das Gegenteil von heiß.', options: ['kalt', 'warm', 'leise', 'langsam'], correctIndex: 0 },
  { prompt: "Wenn du 'links' hörst, tippe rechts.", options: ['Links', 'Rechts', 'Mitte', 'Beides'], correctIndex: 1 },
  { prompt: 'Suche die kleinere Zahl.', options: ['9', '3', '7', '11'], correctIndex: 1 },
];

const FLEX_SWITCH_BASE = [
  ['2', '7', '5', '9'],
  ['12', '3', '8', '6'],
  ['4', '14', '10', '1'],
  ['20', '16', '18', '5'],
];

const buildFlexSwitchRound = (roundIndex: number): ChoiceRoundData => {
  const evenRule = roundIndex % 2 === 0;
  const options = FLEX_SWITCH_BASE[roundIndex % FLEX_SWITCH_BASE.length];
  const numeric = options.map((value) => Number(value));
  const target = evenRule ? Math.max(...numeric) : Math.min(...numeric);
  const correctIndex = numeric.indexOf(target);

  return {
    prompt: evenRule ? 'Regel A: Tippe die größte Zahl.' : 'Regel B: Tippe die kleinste Zahl.',
    options,
    correctIndex,
    helper: evenRule ? 'Gerade Runden = größte Zahl.' : 'Ungerade Runden = kleinste Zahl.',
  };
};

const CONFIGS: Record<string, ExerciseRuntimeConfig> = {
  memory_story_gaps: {
    roundsTotal: 8,
    template: 'choice',
    buildRound: (roundIndex: number) => ({ ...STORY_GAP_ROUNDS[roundIndex % STORY_GAP_ROUNDS.length] }),
  },
  memory_objects: {
    roundsTotal: 8,
    template: 'choice',
    buildRound: (roundIndex: number) => ({ ...MEMORY_OBJECTS_ROUNDS[roundIndex % MEMORY_OBJECTS_ROUNDS.length] }),
  },
  attention_odd_one_out: {
    roundsTotal: 8,
    template: 'odd_one_out',
    buildRound: (roundIndex: number) => ({ ...ATTENTION_ODD_ROUNDS[roundIndex % ATTENTION_ODD_ROUNDS.length] }),
  },
  attention_color_word: {
    roundsTotal: 8,
    template: 'choice',
    buildRound: (roundIndex: number) => ({ ...ATTENTION_COLOR_WORD_ROUNDS[roundIndex % ATTENTION_COLOR_WORD_ROUNDS.length] }),
  },
  logic_next_in_series: {
    roundsTotal: 8,
    template: 'choice',
    buildRound: (roundIndex: number) => ({ ...LOGIC_SERIES_ROUNDS[roundIndex % LOGIC_SERIES_ROUNDS.length] }),
  },
  logic_grouping: {
    roundsTotal: 8,
    template: 'odd_one_out',
    buildRound: (roundIndex: number) => ({ ...LOGIC_GROUPING_ROUNDS[roundIndex % LOGIC_GROUPING_ROUNDS.length] }),
  },
  flex_reverse: {
    roundsTotal: 8,
    template: 'choice',
    buildRound: (roundIndex: number) => ({ ...FLEX_REVERSE_ROUNDS[roundIndex % FLEX_REVERSE_ROUNDS.length] }),
  },
  flex_switch_rules: {
    roundsTotal: 8,
    template: 'choice',
    buildRound: buildFlexSwitchRound,
  },
};

export const getRuntimeConfig = (exerciseId: string): ExerciseRuntimeConfig | null => CONFIGS[exerciseId] ?? null;

