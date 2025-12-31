import type { PatternsSequenceDataset, PatternToken } from '../types';

const sequenceLegend: Record<string, PatternToken> = {
  R_CIRCLE: { glyph: '●', color: '#e53935', label_de: 'Roter Kreis', label_en: 'Red circle' },
  B_SQUARE: { glyph: '■', color: '#2563eb', label_de: 'Blaues Quadrat', label_en: 'Blue square' },
  G_TRIANGLE: { glyph: '▲', color: '#2e7d32', label_de: 'Grünes Dreieck', label_en: 'Green triangle' },
  Y_DIAMOND: { glyph: '◆', color: '#f6c344', label_de: 'Gelber Diamant', label_en: 'Yellow diamond' },
  O_STAR: { glyph: '★', color: '#f59e0b', label_de: 'Oranger Stern', label_en: 'Orange star' },
  P_CIRCLE: { glyph: '●', color: '#9333ea', label_de: 'Violetter Kreis', label_en: 'Purple circle' },
  T_SQUARE: { glyph: '■', color: '#0ea5e9', label_de: 'Türkises Quadrat', label_en: 'Teal square' },
  GR_TRIANGLE: { glyph: '▲', color: '#6b7280', label_de: 'Graues Dreieck', label_en: 'Gray triangle' },
};

const colorsSeqSets = [
  {
    sequence: ['R_CIRCLE', 'B_SQUARE', 'R_CIRCLE', 'B_SQUARE', '?'],
    options: ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE'],
    answerIndex: 0,
  },
  {
    sequence: ['G_TRIANGLE', 'G_TRIANGLE', 'Y_DIAMOND', 'G_TRIANGLE', 'G_TRIANGLE', '?'],
    options: ['G_TRIANGLE', 'O_STAR', 'Y_DIAMOND'],
    answerIndex: 2,
  },
  {
    sequence: ['R_CIRCLE', 'R_CIRCLE', 'B_SQUARE', 'B_SQUARE', 'R_CIRCLE', '?'],
    options: ['Y_DIAMOND', 'B_SQUARE', 'R_CIRCLE'],
    answerIndex: 1,
  },
  {
    sequence: ['Y_DIAMOND', 'O_STAR', 'Y_DIAMOND', 'O_STAR', '?'],
    options: ['O_STAR', 'Y_DIAMOND', 'R_CIRCLE'],
    answerIndex: 1,
  },
  {
    sequence: ['B_SQUARE', 'G_TRIANGLE', 'B_SQUARE', 'G_TRIANGLE', 'B_SQUARE', '?'],
    options: ['R_CIRCLE', 'G_TRIANGLE', 'B_SQUARE'],
    answerIndex: 1,
  },
  {
    sequence: ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE', 'R_CIRCLE', 'B_SQUARE', '?'],
    options: ['P_CIRCLE', 'Y_DIAMOND', 'G_TRIANGLE'],
    answerIndex: 2,
  },
  {
    sequence: ['O_STAR', 'O_STAR', 'Y_DIAMOND', 'O_STAR', 'O_STAR', '?'],
    options: ['O_STAR', 'Y_DIAMOND', 'G_TRIANGLE'],
    answerIndex: 1,
  },
  {
    sequence: ['P_CIRCLE', 'B_SQUARE', 'Y_DIAMOND', 'P_CIRCLE', 'B_SQUARE', '?'],
    options: ['P_CIRCLE', 'Y_DIAMOND', 'R_CIRCLE'],
    answerIndex: 1,
  },
  {
    sequence: ['G_TRIANGLE', 'Y_DIAMOND', 'O_STAR', 'G_TRIANGLE', 'Y_DIAMOND', '?'],
    options: ['R_CIRCLE', 'O_STAR', 'G_TRIANGLE'],
    answerIndex: 1,
  },
  {
    sequence: ['B_SQUARE', 'B_SQUARE', 'R_CIRCLE', 'B_SQUARE', 'B_SQUARE', '?'],
    options: ['B_SQUARE', 'R_CIRCLE', 'Y_DIAMOND'],
    answerIndex: 1,
  },
];

const shapesSeqSets = [
  {
    sequence: ['R_CIRCLE', 'R_CIRCLE', 'G_TRIANGLE', 'R_CIRCLE', 'R_CIRCLE', '?'],
    options: ['G_TRIANGLE', 'R_CIRCLE', 'B_SQUARE'],
    answerIndex: 0,
  },
  {
    sequence: ['B_SQUARE', 'G_TRIANGLE', 'O_STAR', 'B_SQUARE', 'G_TRIANGLE', '?'],
    options: ['P_CIRCLE', 'O_STAR', 'B_SQUARE'],
    answerIndex: 1,
  },
  {
    sequence: ['Y_DIAMOND', 'Y_DIAMOND', 'R_CIRCLE', 'Y_DIAMOND', 'Y_DIAMOND', '?'],
    options: ['Y_DIAMOND', 'G_TRIANGLE', 'R_CIRCLE'],
    answerIndex: 2,
  },
  {
    sequence: ['G_TRIANGLE', 'B_SQUARE', 'G_TRIANGLE', 'B_SQUARE', '?'],
    options: ['B_SQUARE', 'R_CIRCLE', 'G_TRIANGLE'],
    answerIndex: 2,
  },
  {
    sequence: ['O_STAR', 'P_CIRCLE', 'O_STAR', 'P_CIRCLE', '?'],
    options: ['P_CIRCLE', 'O_STAR', 'B_SQUARE'],
    answerIndex: 1,
  },
  {
    sequence: ['R_CIRCLE', 'G_TRIANGLE', 'B_SQUARE', 'R_CIRCLE', 'G_TRIANGLE', '?'],
    options: ['B_SQUARE', 'Y_DIAMOND', 'R_CIRCLE'],
    answerIndex: 0,
  },
  {
    sequence: ['P_CIRCLE', 'P_CIRCLE', 'B_SQUARE', 'P_CIRCLE', '?'],
    options: ['B_SQUARE', 'G_TRIANGLE', 'P_CIRCLE'],
    answerIndex: 2,
  },
  {
    sequence: ['G_TRIANGLE', 'Y_DIAMOND', 'G_TRIANGLE', 'Y_DIAMOND', 'G_TRIANGLE', '?'],
    options: ['Y_DIAMOND', 'G_TRIANGLE', 'O_STAR'],
    answerIndex: 0,
  },
  {
    sequence: ['R_CIRCLE', 'B_SQUARE', 'R_CIRCLE', 'G_TRIANGLE', 'R_CIRCLE', '?'],
    options: ['B_SQUARE', 'G_TRIANGLE', 'R_CIRCLE'],
    answerIndex: 0,
  },
  {
    sequence: ['O_STAR', 'G_TRIANGLE', 'B_SQUARE', 'O_STAR', 'G_TRIANGLE', '?'],
    options: ['B_SQUARE', 'O_STAR', 'R_CIRCLE'],
    answerIndex: 0,
  },
];

const dualRuleSeqSets = [
  {
    sequence: ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE', 'R_CIRCLE', 'B_SQUARE', '?'],
    options: ['Y_DIAMOND', 'G_TRIANGLE', 'R_CIRCLE'],
    answerIndex: 1,
  },
  {
    sequence: ['R_CIRCLE', 'R_CIRCLE', 'B_SQUARE', 'B_SQUARE', 'G_TRIANGLE', '?'],
    options: ['B_SQUARE', 'G_TRIANGLE', 'P_CIRCLE'],
    answerIndex: 1,
  },
  {
    sequence: ['Y_DIAMOND', 'O_STAR', 'Y_DIAMOND', 'P_CIRCLE', 'Y_DIAMOND', '?'],
    options: ['P_CIRCLE', 'O_STAR', 'Y_DIAMOND'],
    answerIndex: 1,
  },
  {
    sequence: ['B_SQUARE', 'G_TRIANGLE', 'B_SQUARE', 'Y_DIAMOND', 'B_SQUARE', '?'],
    options: ['G_TRIANGLE', 'B_SQUARE', 'O_STAR'],
    answerIndex: 0,
  },
  {
    sequence: ['O_STAR', 'G_TRIANGLE', 'P_CIRCLE', 'O_STAR', 'G_TRIANGLE', '?'],
    options: ['P_CIRCLE', 'O_STAR', 'Y_DIAMOND'],
    answerIndex: 0,
  },
  {
    sequence: ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE', 'B_SQUARE', 'R_CIRCLE', '?'],
    options: ['G_TRIANGLE', 'B_SQUARE', 'Y_DIAMOND'],
    answerIndex: 0,
  },
  {
    sequence: ['P_CIRCLE', 'O_STAR', 'Y_DIAMOND', 'P_CIRCLE', 'O_STAR', '?'],
    options: ['Y_DIAMOND', 'O_STAR', 'B_SQUARE'],
    answerIndex: 0,
  },
  {
    sequence: ['G_TRIANGLE', 'R_CIRCLE', 'G_TRIANGLE', 'B_SQUARE', 'G_TRIANGLE', '?'],
    options: ['R_CIRCLE', 'B_SQUARE', 'O_STAR'],
    answerIndex: 1,
  },
  {
    sequence: ['Y_DIAMOND', 'B_SQUARE', 'G_TRIANGLE', 'Y_DIAMOND', 'B_SQUARE', '?'],
    options: ['G_TRIANGLE', 'O_STAR', 'B_SQUARE'],
    answerIndex: 0,
  },
  {
    sequence: ['R_CIRCLE', 'P_CIRCLE', 'B_SQUARE', 'R_CIRCLE', 'P_CIRCLE', '?'],
    options: ['B_SQUARE', 'R_CIRCLE', 'P_CIRCLE'],
    answerIndex: 0,
  },
];

export const patternsSequenceDatasets: Record<string, PatternsSequenceDataset> = {
  colors_seq: {
    puzzleType: 'patterns-sequence',
    datasetKey: 'colors_seq',
    legend: sequenceLegend,
    sets: colorsSeqSets,
  },
  shapes_seq: {
    puzzleType: 'patterns-sequence',
    datasetKey: 'shapes_seq',
    legend: sequenceLegend,
    sets: shapesSeqSets,
  },
  dualrule_seq: {
    puzzleType: 'patterns-sequence',
    datasetKey: 'dualrule_seq',
    legend: sequenceLegend,
    sets: dualRuleSeqSets,
  },
};


