import { ReactionRound } from '../types';

export const BANK_ID = 'reaction.reaction.v1';

export const items: ReactionRound[] = [
  {
    id: `${BANK_ID}::q01`,
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
    id: `${BANK_ID}::q02`,
    instructionKey: 'brain.reaction.smoke.heart',
    paceMs: 1300,
    stimuli: [
      { label: '▲', isTarget: false },
      { label: '❤', isTarget: true },
      { label: '●', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q03`,
    instructionKey: 'brain.reaction.smoke.green',
    paceMs: 1200,
    stimuli: [
      { label: 'ROT', isTarget: false },
      { label: 'GRÜN', isTarget: true },
      { label: 'BLAU', isTarget: false },
      { label: 'GRÜN', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q04`,
    instructionKey: 'brain.reaction.tapTarget.circle',
    paceMs: 1100,
    stimuli: [
      { label: '○', isTarget: true },
      { label: '□', isTarget: false },
      { label: '○', isTarget: true },
      { label: '△', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q05`,
    instructionKey: 'brain.reaction.tapTarget.triangle',
    paceMs: 1100,
    stimuli: [
      { label: '▲', isTarget: true },
      { label: '○', isTarget: false },
      { label: '■', isTarget: false },
      { label: '▲', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q06`,
    instructionKey: 'brain.reaction.tapTarget.wordGreen',
    paceMs: 1000,
    stimuli: [
      { label: 'GELB', isTarget: false },
      { label: 'GRÜN', isTarget: true },
      { label: 'ROT', isTarget: false },
      { label: 'GRÜN', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q07`,
    instructionKey: 'brain.reaction.tapTarget.numberThree',
    paceMs: 950,
    stimuli: [
      { label: '1', isTarget: false },
      { label: '3', isTarget: true },
      { label: '2', isTarget: false },
      { label: '3', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q08`,
    instructionKey: 'brain.reaction.tapTarget.letterA',
    paceMs: 900,
    stimuli: [
      { label: 'B', isTarget: false },
      { label: 'A', isTarget: true },
      { label: 'C', isTarget: false },
      { label: 'A', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q09`,
    instructionKey: 'brain.reaction.tapTarget.bell',
    paceMs: 1200,
    stimuli: [
      { label: '🔔', isTarget: true },
      { label: '○', isTarget: false },
      { label: '🔔', isTarget: true },
      { label: '□', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q10`,
    instructionKey: 'brain.reaction.tapTarget.sun',
    paceMs: 1000,
    stimuli: [
      { label: '☀', isTarget: true },
      { label: '☁', isTarget: false },
      { label: '☀', isTarget: true },
      { label: '☂', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q11`,
    instructionKey: 'brain.reaction.tapTarget.heart',
    paceMs: 1050,
    stimuli: [
      { label: '❤', isTarget: true },
      { label: '✳', isTarget: false },
      { label: '❤', isTarget: true },
      { label: '★', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q12`,
    instructionKey: 'brain.reaction.tapTarget.hand',
    paceMs: 1150,
    stimuli: [
      { label: '✋', isTarget: true },
      { label: '🤚', isTarget: true },
      { label: '👊', isTarget: false },
      { label: '☝', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q13`,
    instructionKey: 'brain.reaction.tapTarget.arrowLeft',
    paceMs: 950,
    stimuli: [
      { label: '←', isTarget: true },
      { label: '→', isTarget: false },
      { label: '←', isTarget: true },
      { label: '↓', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q14`,
    instructionKey: 'brain.reaction.tapTarget.greenCircle',
    paceMs: 900,
    stimuli: [
      { label: '🟢', isTarget: true },
      { label: '⚪', isTarget: false },
      { label: '🟡', isTarget: false },
      { label: '🟢', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q15`,
    instructionKey: 'brain.reaction.tapTarget.check',
    paceMs: 1000,
    stimuli: [
      { label: '✔', isTarget: true },
      { label: '✖', isTarget: false },
      { label: '✔', isTarget: true },
      { label: '?', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q16`,
    instructionKey: 'brain.reaction.tapTarget.numberFive',
    paceMs: 950,
    stimuli: [
      { label: '5', isTarget: true },
      { label: '2', isTarget: false },
      { label: '5', isTarget: true },
      { label: '1', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q17`,
    instructionKey: 'brain.reaction.tapTarget.wordStop',
    paceMs: 900,
    stimuli: [
      { label: 'GO', isTarget: false },
      { label: 'STOP', isTarget: true },
      { label: 'LOS', isTarget: false },
      { label: 'STOP', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q18`,
    instructionKey: 'brain.reaction.tapTarget.cat',
    paceMs: 1000,
    stimuli: [
      { label: '🐱', isTarget: true },
      { label: '🐶', isTarget: false },
      { label: '🐱', isTarget: true },
      { label: '🐦', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q19`,
    instructionKey: 'brain.reaction.tapTarget.clock',
    paceMs: 1100,
    stimuli: [
      { label: '⏰', isTarget: true },
      { label: '⌚', isTarget: true },
      { label: '📱', isTarget: false },
      { label: '📻', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q20`,
    instructionKey: 'brain.reaction.tapTarget.leaf',
    paceMs: 1000,
    stimuli: [
      { label: '🍁', isTarget: true },
      { label: '🍂', isTarget: true },
      { label: '🍃', isTarget: true },
      { label: '🌸', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q21`,
    instructionKey: 'brain.reaction.tapTarget.musicNote',
    paceMs: 900,
    stimuli: [
      { label: '♪', isTarget: true },
      { label: '♬', isTarget: false },
      { label: '♪', isTarget: true },
      { label: '♫', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q22`,
    instructionKey: 'brain.reaction.tapTarget.blueSquare',
    paceMs: 950,
    stimuli: [
      { label: '🟦', isTarget: true },
      { label: '⬜', isTarget: false },
      { label: '🟥', isTarget: false },
      { label: '🟦', isTarget: true },
    ],
  },
  {
    id: `${BANK_ID}::q23`,
    instructionKey: 'brain.reaction.tapTarget.starGold',
    paceMs: 1050,
    stimuli: [
      { label: '★', isTarget: true },
      { label: '☆', isTarget: false },
      { label: '★', isTarget: true },
      { label: '◇', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q24`,
    instructionKey: 'brain.reaction.tapTarget.wordGo',
    paceMs: 900,
    stimuli: [
      { label: 'GO', isTarget: true },
      { label: 'NO', isTarget: false },
      { label: 'GO', isTarget: true },
      { label: 'WAIT', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q25`,
    instructionKey: 'brain.reaction.tapTarget.drop',
    paceMs: 1000,
    stimuli: [
      { label: '💧', isTarget: true },
      { label: '🔥', isTarget: false },
      { label: '💧', isTarget: true },
      { label: '🌱', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q26`,
    instructionKey: 'brain.reaction.tapTarget.smile',
    paceMs: 950,
    stimuli: [
      { label: '☺', isTarget: true },
      { label: '☹', isTarget: false },
      { label: '☺', isTarget: true },
      { label: '😐', isTarget: false },
    ],
  },
  {
    id: `${BANK_ID}::q27`,
    instructionKey: 'brain.reaction.tapTarget.bellWord',
    paceMs: 900,
    stimuli: [
      { label: 'KLINGEL', isTarget: true },
      { label: 'PAUSE', isTarget: false },
      { label: 'KLINGEL', isTarget: true },
      { label: 'STOP', isTarget: false },
    ],
  },
];

