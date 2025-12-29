import { OddOneOutRound } from '../types';

export const BANK_ID = 'logic.oddOneOut.v1';

export const items: OddOneOutRound[] = [
  { id: `${BANK_ID}::q01`, prompt: 'Welches Wort passt nicht in die Blumen-Gruppe?', options: ['Rose', 'Tulpe', 'Lilie', 'Stein'], oddIndex: 3 },
  { id: `${BANK_ID}::q02`, prompt: 'Welche Zahl ist nicht gerade?', options: ['8', '12', '15', '4'], oddIndex: 2 },
  { id: `${BANK_ID}::q03`, prompt: 'Welcher Begriff ist kein Wochentag?', options: ['Montag', 'Mittwoch', 'Freitag', 'Februar'], oddIndex: 3 },
  { id: `${BANK_ID}::q04`, prompt: 'Welche Farbe ist keine warme Farbe?', options: ['Rot', 'Orange', 'Gelb', 'Blau'], oddIndex: 3 },
  { id: `${BANK_ID}::q05`, prompt: 'Welches Tier lebt nicht im Wasser?', options: ['Karpfen', 'Hai', 'Delfin', 'Dachs'], oddIndex: 3 },
  { id: `${BANK_ID}::q06`, prompt: 'Welches Objekt ist kein Möbelstück?', options: ['Stuhl', 'Tisch', 'Sofa', 'Apfel'], oddIndex: 3 },
  { id: `${BANK_ID}::q07`, prompt: 'Welches Fortbewegungsmittel fährt nicht?', options: ['Auto', 'Bus', 'Zug', 'Haus'], oddIndex: 3 },
  { id: `${BANK_ID}::q08`, prompt: 'Welche Form hat keine Ecken?', options: ['Dreieck', 'Rechteck', 'Kreis', 'Quadrat'], oddIndex: 2 },
];

