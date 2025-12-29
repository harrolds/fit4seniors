import { ChoiceRound } from '../types';

export const BANK_ID = 'logic.choiceText.v1';

export const items: ChoiceRound[] = [
  { id: `${BANK_ID}::q01`, prompt: '2, 4, 6, ?', options: ['7', '8', '9', '10'], correctIndex: 1 },
  { id: `${BANK_ID}::q02`, prompt: '5, 10, 15, ?', options: ['18', '20', '22', '25'], correctIndex: 1 },
  { id: `${BANK_ID}::q03`, prompt: '1, 3, 6, 10, ?', options: ['13', '14', '15', '16'], correctIndex: 2 },
  { id: `${BANK_ID}::q04`, prompt: '9, 7, 5, ?', options: ['3', '4', '2', '1'], correctIndex: 0 },
  { id: `${BANK_ID}::q05`, prompt: '4, 8, 16, ?', options: ['24', '28', '32', '36'], correctIndex: 2 },
  { id: `${BANK_ID}::q06`, prompt: '10, 20, 40, ?', options: ['50', '60', '80', '100'], correctIndex: 2 },
  { id: `${BANK_ID}::q07`, prompt: '1, 2, 4, 8, ?', options: ['10', '12', '14', '16'], correctIndex: 3 },
  { id: `${BANK_ID}::q08`, prompt: '3, 6, 9, ?', options: ['10', '11', '12', '13'], correctIndex: 2 },
  { id: `${BANK_ID}::q09`, prompt: '1, 4, 9, ?', options: ['12', '14', '16', '25'], correctIndex: 3 },
  { id: `${BANK_ID}::q10`, prompt: '12, 11, 9, 6, ?', options: ['2', '3', '4', '5'], correctIndex: 3 },
  { id: `${BANK_ID}::q11`, prompt: '5, 15, 45, ?', options: ['60', '90', '120', '135'], correctIndex: 1 },
  { id: `${BANK_ID}::q12`, prompt: '2, 5, 9, 14, ?', options: ['18', '19', '20', '21'], correctIndex: 1 },
  { id: `${BANK_ID}::q13`, prompt: '7, 10, 8, 11, 9, ?', options: ['10', '11', '12', '13'], correctIndex: 1 },
  { id: `${BANK_ID}::q14`, prompt: '1, 2, 3, 5, 8, ?', options: ['10', '11', '12', '13'], correctIndex: 3 },
  { id: `${BANK_ID}::q15`, prompt: '20, 18, 15, 11, ?', options: ['6', '7', '8', '9'], correctIndex: 2 },
  { id: `${BANK_ID}::q16`, prompt: '4, 6, 9, 13, ?', options: ['16', '17', '18', '19'], correctIndex: 1 },
  { id: `${BANK_ID}::q17`, prompt: '30, 25, 21, 18, ?', options: ['16', '15', '14', '13'], correctIndex: 2 },
  { id: `${BANK_ID}::q18`, prompt: '3, 6, 12, 24, ?', options: ['36', '40', '44', '48'], correctIndex: 3 },
  { id: `${BANK_ID}::q19`, prompt: '2, 3, 5, 8, 12, ?', options: ['14', '15', '16', '17'], correctIndex: 3 },
  { id: `${BANK_ID}::q20`, prompt: '9, 12, 16, 21, ?', options: ['24', '25', '26', '27'], correctIndex: 1 },
];

