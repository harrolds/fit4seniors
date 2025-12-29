import { ChoiceRoundData } from '../templates/ChoiceTemplate';
import { OddOneOutRoundData } from '../templates/OddOneOutTemplate';
import { PairsRoundData } from '../templates/PairsTemplate';
import { SequenceRoundData } from '../templates/SequenceTemplate';
import { ReactionRoundData } from '../templates/ReactionTemplate';

type BaseExerciseConfig<TemplateId, PoolItem> = {
  roundsTotal: number;
  template: TemplateId;
  pool: PoolItem[];
  seedKey?: string;
};

type ChoiceExerciseConfig = BaseExerciseConfig<'choice', ChoiceRoundData>;
type OddOneOutExerciseConfig = BaseExerciseConfig<'odd_one_out', OddOneOutRoundData>;
type PairsExerciseConfig = BaseExerciseConfig<'pairs', PairsRoundData>;
type SequenceExerciseConfig = BaseExerciseConfig<'sequence', SequenceRoundData>;
type ReactionExerciseConfig = BaseExerciseConfig<'reaction', ReactionRoundData>;

export type ExerciseRuntimeConfig =
  | ChoiceExerciseConfig
  | OddOneOutExerciseConfig
  | PairsExerciseConfig
  | SequenceExerciseConfig
  | ReactionExerciseConfig;

const createId = (exerciseId: string, index: number) => `${exerciseId}::q${String(index + 1).padStart(2, '0')}`;

const withIds = <T extends { id?: string }>(
  exerciseId: string,
  rounds: Array<Omit<T, 'id'>>,
): Array<T & { id: string }> =>
  rounds.map((round, index) => ({ ...round, id: createId(exerciseId, index) } as T & { id: string }));

const STORY_GAP_ROUNDS: ChoiceRoundData[] = withIds('memory_story_gaps', [
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
  {
    prompt: 'Sie band den Schal um ihren ____.',
    options: ['Hals', 'Teller', 'Fenster', 'Löffel'],
    correctIndex: 0,
  },
  {
    prompt: 'Er stellte den Wecker auf ____ Uhr.',
    options: ['7', '20', '0', '100'],
    correctIndex: 0,
  },
  {
    prompt: 'Zum Nachtisch gab es warme _____.',
    options: ['Pfannkuchen', 'Nägel', 'Steine', 'Sand'],
    correctIndex: 0,
  },
]);

const MEMORY_OBJECTS_ROUNDS: ChoiceRoundData[] = withIds('memory_objects', [
  { prompt: 'Welcher Gegenstand leuchtet?', options: ['Lampe', 'Decke', 'Buch', 'Tasse'], correctIndex: 0 },
  { prompt: 'Womit schreibst du eine Notiz?', options: ['Stift', 'Glas', 'Teller', 'Besen'], correctIndex: 0 },
  { prompt: 'Was gehört in den Kühlschrank?', options: ['Milch', 'Handschuh', 'Zeitung', 'Schlüssel'], correctIndex: 0 },
  { prompt: 'Was setzt du auf, wenn die Sonne stark scheint?', options: ['Hut', 'Schal', 'Schuh', 'Handschuh'], correctIndex: 0 },
  { prompt: 'Welches Werkzeug schneidet Papier?', options: ['Schere', 'Ball', 'Kissen', 'Kerze'], correctIndex: 0 },
  { prompt: 'Was brauchst du zum Öffnen einer Tür?', options: ['Schlüssel', 'Löffel', 'Zahn', 'Besen'], correctIndex: 0 },
  { prompt: 'Womit trinkst du Suppe?', options: ['Löffel', 'Säge', 'Ziegel', 'Schraube'], correctIndex: 0 },
  { prompt: 'Welches Gerät zeigt die Uhrzeit?', options: ['Uhr', 'Kissen', 'Lampe', 'Besen'], correctIndex: 0 },
]);

const ATTENTION_ODD_ROUNDS: OddOneOutRoundData[] = withIds('attention_odd_one_out', [
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
  {
    prompt: 'Welche Jahreszeit gehört nicht dazu?',
    options: ['Frühling', 'Sommer', 'Herbst', 'Montag'],
    oddIndex: 3,
  },
  {
    prompt: 'Welches Getränk ist kein Heißgetränk?',
    options: ['Tee', 'Kaffee', 'Kakao', 'Limonade'],
    oddIndex: 3,
  },
  {
    prompt: 'Welcher Gegenstand ist kein Werkzeug?',
    options: ['Hammer', 'Schraubenzieher', 'Säge', 'Kartoffel'],
    oddIndex: 3,
  },
]);

const ATTENTION_COLOR_WORD_ROUNDS: ChoiceRoundData[] = withIds('attention_color_word', [
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
  { prompt: 'Wähle die Farbe: SCHWARZ', options: ['Braun', 'Schwarz', 'Orange', 'Pink'], correctIndex: 1 },
  { prompt: 'Wähle die Farbe: WEISS', options: ['Weiß', 'Lila', 'Grau', 'Grün'], correctIndex: 0 },
  { prompt: 'Wähle die Farbe: ORANGE', options: ['Orange', 'Blau', 'Grau', 'Rosa'], correctIndex: 0 },
]);

const LOGIC_SERIES_ROUNDS: ChoiceRoundData[] = withIds('logic_next_in_series', [
  { prompt: '2, 4, 6, ?', options: ['7', '8', '9', '10'], correctIndex: 1 },
  { prompt: '5, 10, 15, ?', options: ['18', '20', '22', '25'], correctIndex: 1 },
  { prompt: '1, 3, 6, 10, ?', options: ['13', '14', '15', '16'], correctIndex: 2 },
  { prompt: '9, 7, 5, ?', options: ['3', '4', '2', '1'], correctIndex: 0 },
  { prompt: '4, 8, 16, ?', options: ['24', '28', '32', '36'], correctIndex: 2 },
  { prompt: '10, 20, 40, ?', options: ['50', '60', '80', '100'], correctIndex: 2 },
  { prompt: '1, 2, 4, 8, ?', options: ['10', '12', '14', '16'], correctIndex: 3 },
  { prompt: '3, 6, 9, ?', options: ['10', '11', '12', '13'], correctIndex: 2 },
]);

const LOGIC_GROUPING_ROUNDS: OddOneOutRoundData[] = withIds('logic_grouping', [
  { prompt: 'Welches Wort passt nicht in die Blumen-Gruppe?', options: ['Rose', 'Tulpe', 'Lilie', 'Stein'], oddIndex: 3 },
  { prompt: 'Welche Zahl ist nicht gerade?', options: ['8', '12', '15', '4'], oddIndex: 2 },
  { prompt: 'Welcher Begriff ist kein Wochentag?', options: ['Montag', 'Mittwoch', 'Freitag', 'Februar'], oddIndex: 3 },
  { prompt: 'Welche Farbe ist keine warme Farbe?', options: ['Rot', 'Orange', 'Gelb', 'Blau'], oddIndex: 3 },
  { prompt: 'Welches Tier lebt nicht im Wasser?', options: ['Karpfen', 'Hai', 'Delfin', 'Dachs'], oddIndex: 3 },
  { prompt: 'Welches Objekt ist kein Möbelstück?', options: ['Stuhl', 'Tisch', 'Sofa', 'Apfel'], oddIndex: 3 },
  { prompt: 'Welches Fortbewegungsmittel fährt nicht?', options: ['Auto', 'Bus', 'Zug', 'Haus'], oddIndex: 3 },
  { prompt: 'Welche Form hat keine Ecken?', options: ['Dreieck', 'Rechteck', 'Kreis', 'Quadrat'], oddIndex: 2 },
]);

const FLEX_REVERSE_ROUNDS: ChoiceRoundData[] = withIds('flex_reverse', [
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
  { prompt: "Antwort ist immer 'Vielleicht'.", options: ['Ja', 'Nein', 'Vielleicht', 'Selten'], correctIndex: 2 },
  { prompt: 'Wähle nicht die Farbe im Text.', options: ['Blau', 'Rot', 'Grün', 'Gelb'], correctIndex: 2 },
  { prompt: 'Tippe die zweite Option, nicht die erste.', options: ['Erste', 'Zweite', 'Dritte', 'Vierte'], correctIndex: 1 },
]);

const FLEX_SWITCH_ROUNDS: ChoiceRoundData[] = withIds('flex_switch_rules', [
  {
    prompt: 'Regel A: Tippe die größte Zahl.',
    options: ['2', '7', '5', '9'],
    correctIndex: 3,
    helper: 'Gerade Runden = größte Zahl.',
  },
  { prompt: 'Regel B: Tippe die kleinste Zahl.', options: ['12', '3', '8', '6'], correctIndex: 1, helper: 'Ungerade Runden = kleinste Zahl.' },
  { prompt: 'Regel A: Tippe die größte Zahl.', options: ['4', '14', '10', '1'], correctIndex: 1, helper: 'Gerade Runden = größte Zahl.' },
  { prompt: 'Regel B: Tippe die kleinste Zahl.', options: ['20', '16', '18', '5'], correctIndex: 3, helper: 'Ungerade Runden = kleinste Zahl.' },
  { prompt: 'Regel A: Tippe die größte Zahl.', options: ['11', '9', '13', '2'], correctIndex: 2, helper: 'Gerade Runden = größte Zahl.' },
  { prompt: 'Regel B: Tippe die kleinste Zahl.', options: ['30', '25', '40', '27'], correctIndex: 1, helper: 'Ungerade Runden = kleinste Zahl.' },
  { prompt: 'Regel A: Tippe die größte Zahl.', options: ['6', '18', '12', '3'], correctIndex: 1, helper: 'Gerade Runden = größte Zahl.' },
  { prompt: 'Regel B: Tippe die kleinste Zahl.', options: ['5', '2', '9', '8'], correctIndex: 1, helper: 'Ungerade Runden = kleinste Zahl.' },
]);

const MEMORY_PAIRS_SMOKE: PairsRoundData[] = withIds('memory_pairs_smoke', [
  {
    pairs: [
      { a: 'Sonne', b: '☀' },
      { a: 'Mond', b: '🌙' },
      { a: 'Herz', b: '❤️' },
    ],
  },
  {
    pairs: [
      { a: 'Hund', b: '🐶' },
      { a: 'Katze', b: '🐱' },
      { a: 'Vogel', b: '🐦' },
    ],
  },
  {
    pairs: [
      { a: 'Apfel', b: '🍎' },
      { a: 'Banane', b: '🍌' },
      { a: 'Traube', b: '🍇' },
    ],
  },
]);

const LOGIC_SEQUENCE_SMOKE: SequenceRoundData[] = withIds('logic_sequence_smoke', [
  { prompt: 'Tippe die Zahlen von klein nach groß.', items: ['3', '1', '2'], correctOrder: ['1', '2', '3'] },
  { prompt: 'Reihe die Wochentage.', items: ['Dienstag', 'Montag', 'Mittwoch'], correctOrder: ['Montag', 'Dienstag', 'Mittwoch'] },
  { prompt: 'Ordne die Jahreszeiten beginnend mit Frühling.', items: ['Sommer', 'Frühling', 'Herbst'], correctOrder: ['Frühling', 'Sommer', 'Herbst'] },
]);

const REACTION_TAP_SMOKE: ReactionRoundData[] = withIds('reaction_tap_smoke', [
  {
    instructionKey: 'brain.reaction.smoke.star',
    paceMs: 1400,
    stimuli: [
      { label: '○', isTarget: false },
      { label: '✳', isTarget: true },
      { label: '□', isTarget: false },
      { label: '✳', isTarget: true },
    ],
  },
  {
    instructionKey: 'brain.reaction.smoke.heart',
    paceMs: 1300,
    stimuli: [
      { label: '▲', isTarget: false },
      { label: '❤', isTarget: true },
      { label: '●', isTarget: false },
    ],
  },
  {
    instructionKey: 'brain.reaction.smoke.green',
    paceMs: 1200,
    stimuli: [
      { label: 'ROT', isTarget: false },
      { label: 'GRÜN', isTarget: true },
      { label: 'BLAU', isTarget: false },
      { label: 'GRÜN', isTarget: true },
    ],
  },
]);

const CONFIGS: Record<string, ExerciseRuntimeConfig> = {
  memory_story_gaps: {
    roundsTotal: 8,
    template: 'choice',
    pool: STORY_GAP_ROUNDS,
  },
  memory_objects: {
    roundsTotal: 8,
    template: 'choice',
    pool: MEMORY_OBJECTS_ROUNDS,
  },
  attention_odd_one_out: {
    roundsTotal: 8,
    template: 'odd_one_out',
    pool: ATTENTION_ODD_ROUNDS,
  },
  attention_color_word: {
    roundsTotal: 8,
    template: 'choice',
    pool: ATTENTION_COLOR_WORD_ROUNDS,
  },
  logic_next_in_series: {
    roundsTotal: 8,
    template: 'choice',
    pool: LOGIC_SERIES_ROUNDS,
  },
  logic_grouping: {
    roundsTotal: 8,
    template: 'odd_one_out',
    pool: LOGIC_GROUPING_ROUNDS,
  },
  flex_reverse: {
    roundsTotal: 8,
    template: 'choice',
    pool: FLEX_REVERSE_ROUNDS,
  },
  flex_switch_rules: {
    roundsTotal: 8,
    template: 'choice',
    pool: FLEX_SWITCH_ROUNDS,
  },
  memory_pairs_smoke: {
    roundsTotal: 3,
    template: 'pairs',
    pool: MEMORY_PAIRS_SMOKE,
  },
  logic_sequence_smoke: {
    roundsTotal: 3,
    template: 'sequence',
    pool: LOGIC_SEQUENCE_SMOKE,
  },
  reaction_tap_smoke: {
    roundsTotal: 3,
    template: 'reaction',
    pool: REACTION_TAP_SMOKE,
  },
};

export const getRuntimeConfig = (exerciseId: string): ExerciseRuntimeConfig | null => CONFIGS[exerciseId] ?? null;

