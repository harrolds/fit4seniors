import { SequenceRound } from '../types';

export const BANK_ID = 'flexibility.sequence.v1';

export const items: SequenceRound[] = [
  { id: `${BANK_ID}::q01`, prompt: 'Ordne die Schritte beim Regelwechsel: erst lesen, dann handeln.', items: ['Handeln', 'Lesen', 'Überlegen'], correctOrder: ['Lesen', 'Überlegen', 'Handeln'] },
  { id: `${BANK_ID}::q02`, prompt: 'Sortiere diese Tagesaufgaben.', items: ['Post öffnen', 'Einkauf planen', 'Liste schreiben'], correctOrder: ['Post öffnen', 'Einkauf planen', 'Liste schreiben'] },
  { id: `${BANK_ID}::q03`, prompt: 'Bringe die Reihenfolge für einen Anruf.', items: ['Nummer wählen', 'Gespräch führen', 'Auflegen'], correctOrder: ['Nummer wählen', 'Gespräch führen', 'Auflegen'] },
  { id: `${BANK_ID}::q04`, prompt: 'Ordne „umdenken“: alte Regel weg, neue Regel anwenden.', items: ['Neue Regel anwenden', 'Alte Regel stoppen', 'Kurz prüfen'], correctOrder: ['Alte Regel stoppen', 'Kurz prüfen', 'Neue Regel anwenden'] },
  { id: `${BANK_ID}::q05`, prompt: 'Sortiere Aufräum-Schritte.', items: ['Schublade öffnen', 'Gegenstände sortieren', 'Schublade schließen'], correctOrder: ['Schublade öffnen', 'Gegenstände sortieren', 'Schublade schließen'] },
  { id: `${BANK_ID}::q06`, prompt: 'Ordne die Schritte fürs Kochen mit Regelwechsel.', items: ['Rezept lesen', 'Zutat schneiden', 'Pfanne erhitzen'], correctOrder: ['Rezept lesen', 'Pfanne erhitzen', 'Zutat schneiden'] },
  { id: `${BANK_ID}::q07`, prompt: 'Bringe den Ablauf fürs Kofferpacken.', items: ['Kleidung wählen', 'Falten', 'Einpacken'], correctOrder: ['Kleidung wählen', 'Falten', 'Einpacken'] },
  { id: `${BANK_ID}::q08`, prompt: 'Sortiere einen schnellen Spaziergang.', items: ['Jacke anziehen', 'Schlüssel nehmen', 'Tür schließen'], correctOrder: ['Jacke anziehen', 'Schlüssel nehmen', 'Tür schließen'] },
  { id: `${BANK_ID}::q09`, prompt: 'Ordne flexibles Denken beim Spiel.', items: ['Regel lesen', 'Beispiel merken', 'Aufgabe lösen'], correctOrder: ['Regel lesen', 'Beispiel merken', 'Aufgabe lösen'] },
  { id: `${BANK_ID}::q10`, prompt: 'Bringe einen Richtungswechsel in Ordnung.', items: ['Nach links schauen', 'Nach rechts schauen', 'Geradeaus gehen'], correctOrder: ['Nach links schauen', 'Nach rechts schauen', 'Geradeaus gehen'] },
  { id: `${BANK_ID}::q11`, prompt: 'Sortiere den Ablauf „Kochen und Servieren“.', items: ['Kochen', 'Servieren', 'Tisch decken'], correctOrder: ['Tisch decken', 'Kochen', 'Servieren'] },
  { id: `${BANK_ID}::q12`, prompt: 'Ordne einen schnellen Regelwechsel.', items: ['Regel A merken', 'Wechsel ankündigen', 'Regel B anwenden'], correctOrder: ['Regel A merken', 'Wechsel ankündigen', 'Regel B anwenden'] },
];

