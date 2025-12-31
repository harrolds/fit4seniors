import type { PatternToken, PatternsMatrixDataset } from '../types';

const matrixLegend: Record<string, PatternToken> = {
  R_CIRCLE: { glyph: '●', color: '#e53935', label_de: 'Roter Kreis', label_en: 'Red circle' },
  B_SQUARE: { glyph: '■', color: '#2563eb', label_de: 'Blaues Quadrat', label_en: 'Blue square' },
  G_TRIANGLE: { glyph: '▲', color: '#2e7d32', label_de: 'Grünes Dreieck', label_en: 'Green triangle' },
  Y_DIAMOND: { glyph: '◆', color: '#f6c344', label_de: 'Gelber Diamant', label_en: 'Yellow diamond' },
  O_STAR: { glyph: '★', color: '#f59e0b', label_de: 'Oranger Stern', label_en: 'Orange star' },
  P_CIRCLE: { glyph: '●', color: '#9333ea', label_de: 'Violetter Kreis', label_en: 'Purple circle' },
};

const shiftMatrixSets = [
  {
    grid: [
      ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE'],
      ['B_SQUARE', 'G_TRIANGLE', 'R_CIRCLE'],
      ['G_TRIANGLE', 'R_CIRCLE', null],
    ],
    options: ['B_SQUARE', 'G_TRIANGLE', 'Y_DIAMOND'],
    answerIndex: 0,
  },
  {
    grid: [
      ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE'],
      ['G_TRIANGLE', 'R_CIRCLE', 'B_SQUARE'],
      ['B_SQUARE', 'G_TRIANGLE', null],
    ],
    options: ['R_CIRCLE', 'P_CIRCLE', 'O_STAR'],
    answerIndex: 0,
  },
  {
    grid: [
      ['Y_DIAMOND', 'O_STAR', 'P_CIRCLE'],
      ['P_CIRCLE', 'Y_DIAMOND', 'O_STAR'],
      ['O_STAR', 'P_CIRCLE', null],
    ],
    options: ['Y_DIAMOND', 'B_SQUARE', 'G_TRIANGLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['B_SQUARE', 'G_TRIANGLE', 'R_CIRCLE'],
      ['G_TRIANGLE', 'R_CIRCLE', 'B_SQUARE'],
      ['R_CIRCLE', 'B_SQUARE', null],
    ],
    options: ['G_TRIANGLE', 'Y_DIAMOND', 'O_STAR'],
    answerIndex: 0,
  },
  {
    grid: [
      ['O_STAR', 'G_TRIANGLE', 'Y_DIAMOND'],
      ['G_TRIANGLE', 'Y_DIAMOND', 'O_STAR'],
      ['Y_DIAMOND', 'O_STAR', null],
    ],
    options: ['G_TRIANGLE', 'B_SQUARE', 'P_CIRCLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['P_CIRCLE', 'R_CIRCLE', 'B_SQUARE'],
      ['R_CIRCLE', 'B_SQUARE', 'G_TRIANGLE'],
      ['B_SQUARE', 'G_TRIANGLE', null],
    ],
    options: ['R_CIRCLE', 'P_CIRCLE', 'Y_DIAMOND'],
    answerIndex: 0,
  },
  {
    grid: [
      ['O_STAR', 'P_CIRCLE', 'R_CIRCLE'],
      ['P_CIRCLE', 'R_CIRCLE', 'O_STAR'],
      ['R_CIRCLE', 'O_STAR', null],
    ],
    options: ['P_CIRCLE', 'Y_DIAMOND', 'B_SQUARE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['G_TRIANGLE', 'G_TRIANGLE', 'B_SQUARE'],
      ['Y_DIAMOND', 'Y_DIAMOND', 'G_TRIANGLE'],
      ['B_SQUARE', 'B_SQUARE', null],
    ],
    options: ['R_CIRCLE', 'O_STAR', 'Y_DIAMOND'],
    answerIndex: 2,
  },
  {
    grid: [
      ['P_CIRCLE', 'B_SQUARE', 'B_SQUARE'],
      ['B_SQUARE', 'P_CIRCLE', 'P_CIRCLE'],
      ['P_CIRCLE', 'B_SQUARE', null],
    ],
    options: ['B_SQUARE', 'P_CIRCLE', 'O_STAR'],
    answerIndex: 0,
  },
  {
    grid: [
      ['Y_DIAMOND', 'B_SQUARE', 'G_TRIANGLE'],
      ['B_SQUARE', 'G_TRIANGLE', 'Y_DIAMOND'],
      ['G_TRIANGLE', 'Y_DIAMOND', null],
    ],
    options: ['B_SQUARE', 'G_TRIANGLE', 'R_CIRCLE'],
    answerIndex: 0,
  },
];

const mirrorMatrixSets = [
  {
    grid: [
      ['R_CIRCLE', 'B_SQUARE', 'R_CIRCLE'],
      ['G_TRIANGLE', 'Y_DIAMOND', 'G_TRIANGLE'],
      ['B_SQUARE', 'R_CIRCLE', null],
    ],
    options: ['B_SQUARE', 'G_TRIANGLE', 'Y_DIAMOND'],
    answerIndex: 0,
  },
  {
    grid: [
      ['R_CIRCLE', 'Y_DIAMOND', 'R_CIRCLE'],
      ['B_SQUARE', 'O_STAR', 'B_SQUARE'],
      ['G_TRIANGLE', 'R_CIRCLE', null],
    ],
    options: ['G_TRIANGLE', 'O_STAR', 'Y_DIAMOND'],
    answerIndex: 0,
  },
  {
    grid: [
      ['P_CIRCLE', 'B_SQUARE', 'P_CIRCLE'],
      ['Y_DIAMOND', 'O_STAR', 'Y_DIAMOND'],
      ['P_CIRCLE', 'B_SQUARE', null],
    ],
    options: ['P_CIRCLE', 'R_CIRCLE', 'G_TRIANGLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['G_TRIANGLE', 'R_CIRCLE', 'G_TRIANGLE'],
      ['R_CIRCLE', 'Y_DIAMOND', 'R_CIRCLE'],
      ['G_TRIANGLE', 'R_CIRCLE', null],
    ],
    options: ['G_TRIANGLE', 'B_SQUARE', 'O_STAR'],
    answerIndex: 0,
  },
  {
    grid: [
      ['Y_DIAMOND', 'B_SQUARE', 'Y_DIAMOND'],
      ['P_CIRCLE', 'G_TRIANGLE', 'P_CIRCLE'],
      ['O_STAR', 'R_CIRCLE', null],
    ],
    options: ['O_STAR', 'Y_DIAMOND', 'G_TRIANGLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['R_CIRCLE', 'B_SQUARE', 'R_CIRCLE'],
      ['B_SQUARE', 'G_TRIANGLE', 'B_SQUARE'],
      ['R_CIRCLE', 'B_SQUARE', null],
    ],
    options: ['R_CIRCLE', 'G_TRIANGLE', 'P_CIRCLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['O_STAR', 'Y_DIAMOND', 'O_STAR'],
      ['G_TRIANGLE', 'B_SQUARE', 'G_TRIANGLE'],
      ['O_STAR', 'Y_DIAMOND', null],
    ],
    options: ['O_STAR', 'B_SQUARE', 'R_CIRCLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['B_SQUARE', 'P_CIRCLE', 'B_SQUARE'],
      ['P_CIRCLE', 'O_STAR', 'P_CIRCLE'],
      ['B_SQUARE', 'P_CIRCLE', null],
    ],
    options: ['B_SQUARE', 'O_STAR', 'R_CIRCLE'],
    answerIndex: 0,
  },
  {
    grid: [
      ['G_TRIANGLE', 'Y_DIAMOND', 'G_TRIANGLE'],
      ['Y_DIAMOND', 'R_CIRCLE', 'Y_DIAMOND'],
      ['G_TRIANGLE', 'Y_DIAMOND', null],
    ],
    options: ['G_TRIANGLE', 'B_SQUARE', 'O_STAR'],
    answerIndex: 0,
  },
  {
    grid: [
      ['P_CIRCLE', 'O_STAR', 'P_CIRCLE'],
      ['R_CIRCLE', 'B_SQUARE', 'R_CIRCLE'],
      ['P_CIRCLE', 'O_STAR', null],
    ],
    options: ['P_CIRCLE', 'G_TRIANGLE', 'Y_DIAMOND'],
    answerIndex: 0,
  },
];

export const patternsMatrixDatasets: Record<string, PatternsMatrixDataset> = {
  shift_matrix: {
    puzzleType: 'patterns-matrix',
    datasetKey: 'shift_matrix',
    legend: matrixLegend,
    sets: shiftMatrixSets,
  },
  mirror_matrix: {
    puzzleType: 'patterns-matrix',
    datasetKey: 'mirror_matrix',
    legend: matrixLegend,
    sets: mirrorMatrixSets,
  },
};


