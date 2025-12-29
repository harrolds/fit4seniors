import { SequenceRound } from '../types';

export const BANK_ID = 'logic.sequence.v1';

export const items: SequenceRound[] = [
  { id: `${BANK_ID}::q01`, prompt: 'Tippe die Zahlen von klein nach groß.', items: ['3', '1', '2'], correctOrder: ['1', '2', '3'] },
  { id: `${BANK_ID}::q02`, prompt: 'Reihe die Wochentage.', items: ['Dienstag', 'Montag', 'Mittwoch'], correctOrder: ['Montag', 'Dienstag', 'Mittwoch'] },
  { id: `${BANK_ID}::q03`, prompt: 'Ordne die Jahreszeiten beginnend mit Frühling.', items: ['Sommer', 'Frühling', 'Herbst'], correctOrder: ['Frühling', 'Sommer', 'Herbst'] },
  { id: `${BANK_ID}::q04`, prompt: 'Bringe den Morgenablauf in Reihenfolge.', items: ['Zähne putzen', 'Aufstehen', 'Frühstücken'], correctOrder: ['Aufstehen', 'Zähne putzen', 'Frühstücken'] },
  { id: `${BANK_ID}::q05`, prompt: 'Sortiere nach Wochentagen.', items: ['Freitag', 'Mittwoch', 'Donnerstag'], correctOrder: ['Mittwoch', 'Donnerstag', 'Freitag'] },
  { id: `${BANK_ID}::q06`, prompt: 'Ordne die Schritte zum Tee kochen.', items: ['Wasser kochen', 'Teebeutel in Tasse', 'Wasser eingießen'], correctOrder: ['Wasser kochen', 'Wasser eingießen', 'Teebeutel in Tasse'] },
  { id: `${BANK_ID}::q07`, prompt: 'Bringe die Jahreszeiten ab Sommer in Reihenfolge.', items: ['Herbst', 'Sommer', 'Winter'], correctOrder: ['Sommer', 'Herbst', 'Winter'] },
  { id: `${BANK_ID}::q08`, prompt: 'Sortiere die Zahlen aufsteigend.', items: ['14', '11', '13'], correctOrder: ['11', '13', '14'] },
  { id: `${BANK_ID}::q09`, prompt: 'Ordne einen Spaziergang.', items: ['Schuhe anziehen', 'Jacke nehmen', 'Tür öffnen'], correctOrder: ['Schuhe anziehen', 'Jacke nehmen', 'Tür öffnen'] },
  { id: `${BANK_ID}::q10`, prompt: 'Bringe die Mahlzeiten in Tagesreihenfolge.', items: ['Abendessen', 'Frühstück', 'Mittagessen'], correctOrder: ['Frühstück', 'Mittagessen', 'Abendessen'] },
  { id: `${BANK_ID}::q11`, prompt: 'Sortiere die Monate chronologisch.', items: ['April', 'März', 'Mai'], correctOrder: ['März', 'April', 'Mai'] },
  { id: `${BANK_ID}::q12`, prompt: 'Ordne den Arzttermin-Ablauf.', items: ['Warten', 'Anmelden', 'Aufruf'], correctOrder: ['Anmelden', 'Warten', 'Aufruf'] },
  { id: `${BANK_ID}::q13`, prompt: 'Bringe diese Gemüse alphabetisch.', items: ['Karotte', 'Erbse', 'Tomate'], correctOrder: ['Erbse', 'Karotte', 'Tomate'] },
  { id: `${BANK_ID}::q14`, prompt: 'Sortiere nach Uhrzeit.', items: ['09:00', '07:30', '08:15'], correctOrder: ['07:30', '08:15', '09:00'] },
  { id: `${BANK_ID}::q15`, prompt: 'Bringe die Schritte fürs Bettgehen in Reihenfolge.', items: ['Licht ausmachen', 'Zähne putzen', 'Pyjama anziehen'], correctOrder: ['Zähne putzen', 'Pyjama anziehen', 'Licht ausmachen'] },
];

