// Zentrale Typen für Fit4Seniors-Übungen

export type ExerciseCategory = 'balance' | 'strength' | 'mobility';

export type ExercisePosition = 'chair' | 'standing' | 'seated';

export type ExerciseMediaType = 'image';

export interface ExerciseMedia {
  type: ExerciseMediaType;
  /** Pfad zu einer statischen Bildressource, z.B. /media/exercises/b1_seitenbalance.png */
  src: string;
  /** Alt-Text für Screenreader */
  alt: string;
}

export interface PhysicalExercise {
  /** Eindeutige ID, z.B. B1, K3, M5 */
  id: string;
  /** Kurzer Titel, in Deutsch */
  title: string;
  /** Kategorie der Übung: Balance, Kraft oder Mobilität */
  category: ExerciseCategory;
  /** Schwierigkeitsgrad 1 (sehr leicht) bis 3 (etwas anspruchsvoller) */
  level: 1 | 2 | 3;
  /** Position: im Sitzen, Stehen oder mit Stuhlunterstützung */
  position: ExercisePosition;
  /** Empfohlene Dauer in Sekunden */
  durationSeconds: number;
  /** Visuelle Darstellung der Übung */
  media: ExerciseMedia;
  /** Optionaler Bildname ohne Pfad/Extension, z.B. "seitenbalance-mit-stuhl" */
  imageName?: string;
  /** Schritt-für-Schritt-Anleitung in Deutsch */
  steps: string[];
  /** Wichtiger Sicherheitshinweis für Senioren */
  safetyNote: string;
  /** Optionale Tags für spätere Filter (z.B. 'wärmung', 'beine') */
  tags?: string[];
}

export interface CognitiveExercise {
  id: string;
  /** Typ des Gehirntrainings – wird in späteren Phasen genutzt */
  type: 'memory' | 'pairs' | 'reaction';
  difficulty: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
}

export interface TodayProgramRecommendation {
  id: string;
  /** z.B. "Sanft aktiv heute" */
  title: string;
  /** IDs der empfohlenen körperlichen Übungen */
  physicalExerciseIds: string[];
  /** IDs der empfohlenen kognitiven Übungen (optional für spätere Phasen) */
  cognitiveExerciseIds?: string[];
  /** Empfohlene Gesamtdauer in Minuten */
  recommendedMinutes: number;
  /** Gesamtintensität des Tagesprogramms */
  intensity: 'gentle' | 'moderate' | 'active';
}

