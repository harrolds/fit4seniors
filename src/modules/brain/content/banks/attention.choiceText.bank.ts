import { ChoiceRound } from '../types';

export const BANK_ID = 'attention.choiceText.v1';

export const items: ChoiceRound[] = [
  {
    id: `${BANK_ID}::q01`,
    prompt: 'Wähle die Farbe: GRÜN',
    options: ['Grün', 'Rot', 'Blau', 'Gelb'],
    correctIndex: 0,
    hint: 'Ignoriere die Schriftfarbe, lies das Wort.',
  },
  { id: `${BANK_ID}::q02`, prompt: 'Wähle die Farbe: BLAU', options: ['Gelb', 'Blau', 'Rot', 'Grau'], correctIndex: 1 },
  { id: `${BANK_ID}::q03`, prompt: 'Wähle die Farbe: ROT', options: ['Rot', 'Grün', 'Orange', 'Lila'], correctIndex: 0 },
  { id: `${BANK_ID}::q04`, prompt: 'Wähle die Farbe: GELB', options: ['Schwarz', 'Weiß', 'Gelb', 'Braun'], correctIndex: 2 },
  { id: `${BANK_ID}::q05`, prompt: 'Wähle die Farbe: GRAU', options: ['Grau', 'Rosa', 'Türkis', 'Grün'], correctIndex: 0 },
  { id: `${BANK_ID}::q06`, prompt: 'Wähle die Farbe: SCHWARZ', options: ['Braun', 'Schwarz', 'Orange', 'Pink'], correctIndex: 1 },
  { id: `${BANK_ID}::q07`, prompt: 'Wähle die Farbe: WEISS', options: ['Weiß', 'Lila', 'Grau', 'Grün'], correctIndex: 0 },
  { id: `${BANK_ID}::q08`, prompt: 'Wähle die Farbe: ORANGE', options: ['Orange', 'Blau', 'Grau', 'Rosa'], correctIndex: 0 },
  { id: `${BANK_ID}::q09`, prompt: 'Wähle das Wort, das Ruhe beschreibt.', options: ['leise', 'schnell', 'laut', 'wild'], correctIndex: 0 },
  { id: `${BANK_ID}::q10`, prompt: 'Welches Wort passt zu warmem Wetter?', options: ['sommerlich', 'frostig', 'eisig', 'stürmisch'], correctIndex: 0 },
  { id: `${BANK_ID}::q11`, prompt: 'Was stellst du ins Bücherregal?', options: ['Roman', 'Apfel', 'Schuh', 'Teller'], correctIndex: 0 },
  { id: `${BANK_ID}::q12`, prompt: 'Wähle das Verkehrsmittel auf Schienen.', options: ['Zug', 'Auto', 'Bus', 'Fahrrad'], correctIndex: 0 },
  { id: `${BANK_ID}::q13`, prompt: 'Was nutzt du zum Anrufen?', options: ['Telefon', 'Löffel', 'Tasse', 'Schlüssel'], correctIndex: 0 },
  { id: `${BANK_ID}::q14`, prompt: 'Welches Gerät zeigt Nachrichten?', options: ['Radio', 'Messer', 'Besen', 'Pfanne'], correctIndex: 0 },
  { id: `${BANK_ID}::q15`, prompt: 'Was trägst du an kalten Tagen?', options: ['Mantel', 'Handtuch', 'Teller', 'Kerze'], correctIndex: 0 },
  { id: `${BANK_ID}::q16`, prompt: 'Welche Speise isst du mit dem Löffel?', options: ['Suppe', 'Brötchen', 'Steak', 'Banane'], correctIndex: 0 },
  { id: `${BANK_ID}::q17`, prompt: 'Womit putzt du dir die Zähne?', options: ['Zahnbürste', 'Besen', 'Säge', 'Kamm'], correctIndex: 0 },
  { id: `${BANK_ID}::q18`, prompt: 'Was öffnest du mit einem Schlüssel?', options: ['Tür', 'Lampe', 'Fenster', 'Schublade'], correctIndex: 0 },
  { id: `${BANK_ID}::q19`, prompt: 'Welches Möbelstück hat eine Lehne?', options: ['Stuhl', 'Lampe', 'Teller', 'Kissen'], correctIndex: 0 },
  { id: `${BANK_ID}::q20`, prompt: 'Was brauchst du zum Kochen von Nudeln?', options: ['Topf', 'Kissen', 'Buch', 'Tuch'], correctIndex: 0 },
];

