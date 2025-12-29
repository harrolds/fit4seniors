import { OddOneOutRound } from '../types';

export const BANK_ID = 'attention.oddOneOut.v1';

export const items: OddOneOutRound[] = [
  {
    id: `${BANK_ID}::q01`,
    prompt: 'Was passt nicht dazu?',
    options: ['Apfel', 'Banane', 'Karotte', 'Birne'],
    oddIndex: 2,
    hint: 'Drei davon sind Obst.',
  },
  {
    id: `${BANK_ID}::q02`,
    prompt: 'Finde das Tier, das nicht fliegt.',
    options: ['Spatz', 'Adler', 'Pinguin', 'Amsel'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q03`,
    prompt: 'Welche Form weicht ab?',
    options: ['Quadrat', 'Dreieck', 'Kreis', 'Linie'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q04`,
    prompt: 'Welches Ding gehört nicht ins Bad?',
    options: ['Handtuch', 'Seife', 'Zahnbürste', 'Bratpfanne'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q05`,
    prompt: 'Welche Richtung passt nicht in die Reihe?',
    options: ['Norden', 'Süden', 'Osten', 'Heute'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q06`,
    prompt: 'Welche Jahreszeit gehört nicht dazu?',
    options: ['Frühling', 'Sommer', 'Herbst', 'Montag'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q07`,
    prompt: 'Welches Getränk ist kein Heißgetränk?',
    options: ['Tee', 'Kaffee', 'Kakao', 'Limonade'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q08`,
    prompt: 'Welcher Gegenstand ist kein Werkzeug?',
    options: ['Hammer', 'Schraubenzieher', 'Säge', 'Kartoffel'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q09`,
    prompt: 'Welche Speise ist kein Frühstück?',
    options: ['Brötchen', 'Marmelade', 'Schraube', 'Butter'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q10`,
    prompt: 'Welcher Raum gehört nicht ins Haus?',
    options: ['Küche', 'Bad', 'Garten', 'Schlafzimmer'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q11`,
    prompt: 'Was ist kein Getränk?',
    options: ['Wasser', 'Saft', 'Milch', 'Teller'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q12`,
    prompt: 'Welche Kleidung ist nicht für den Kopf?',
    options: ['Mütze', 'Hut', 'Schal', 'Helm'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q13`,
    prompt: 'Welcher Gegenstand macht kein Licht?',
    options: ['Lampe', 'Kerze', 'Taschenlampe', 'Kissen'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q14`,
    prompt: 'Welche Tätigkeit machst du nicht mit den Händen?',
    options: ['Schreiben', 'Kochen', 'Laufen', 'Basteln'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q15`,
    prompt: 'Welches Tier lebt nicht im Wald?',
    options: ['Fuchs', 'Reh', 'Eichhörnchen', 'Hai'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q16`,
    prompt: 'Welche Zahl ist keine runde Zehnerzahl?',
    options: ['20', '30', '55', '40'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q17`,
    prompt: 'Welche Farbe ist kein Grundfarbton?',
    options: ['Rot', 'Blau', 'Gelb', 'Silber'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q18`,
    prompt: 'Welche Fortbewegung ist nicht zu Fuß?',
    options: ['Spazieren', 'Joggen', 'Radfahren', 'Gehen'],
    oddIndex: 2,
  },
  {
    id: `${BANK_ID}::q19`,
    prompt: 'Welches Werkzeug ist nicht zum Schneiden?',
    options: ['Schere', 'Messer', 'Säge', 'Hammer'],
    oddIndex: 3,
  },
  {
    id: `${BANK_ID}::q20`,
    prompt: 'Welcher Wochentag ist kein Werktag?',
    options: ['Montag', 'Mittwoch', 'Samstag', 'Donnerstag'],
    oddIndex: 2,
  },
];

