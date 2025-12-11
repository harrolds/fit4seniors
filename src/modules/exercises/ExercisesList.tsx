import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import {
  filterPhysicalExercisesByCategory,
  formatDuration,
  getCategoryLabel,
  getPositionLabel,
  type CategoryFilter,
} from '../../shared/lib/fit4seniors/physicalExercises';
import type { ExerciseCategory, PhysicalExercise } from '../../domain/fit4seniors/exercises';

const LEVEL_LABELS: Record<PhysicalExercise['level'], string> = {
  1: 'Leicht',
  2: 'Mittel',
  3: 'Anspruchsvoll',
};

const CATEGORY_CARDS: {
  id: ExerciseCategory;
  title: string;
  description: string;
  className: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'balance',
    title: 'Balance',
    description: 'Für mehr Stabilität im Alltag',
    className: 'f4s-category-card--balance',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path
          d="M18.5 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm-5 14.5 4-4 4 4-2.5 3.5 3.5 6h-3l-2.5-4-2.5 4h-3l3.5-6-2.5-3.5Z"
          stroke="#1b3a57"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'strength',
    title: 'Kraft',
    description: 'Zur Stärkung der Muskulatur',
    className: 'f4s-category-card--kraft',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path
          d="M13 22c0-2.5 2-4.5 4.5-4.5H21v-4a3 3 0 0 1 3-3h1.5v5H28l-1 4c0 3.5-2.5 6-6 6H18a5 5 0 0 1-5-5Z"
          stroke="#1b3a57"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'mobility',
    title: 'Mobilität',
    description: 'Übungen für bessere Beweglichkeit',
    className: 'f4s-category-card--mobilitaet',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
        <path
          d="M19 6c2 0 3.5 1.5 3.5 3.5S21 13 19 13s-3.5-1.5-3.5-3.5S17 6 19 6Zm-5 10.5 2-2.5 3.5 3.5 3.5-3.5 2 2.5-3.5 4.5V31h-4v-10l-3.5-4.5Z"
          stroke="#1b3a57"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export const ExercisesList: React.FC = () => {
  const { goTo } = useNavigation();
  const [selectedCategory, setSelectedCategory] = React.useState<ExerciseCategory | null>(null);

  const filteredExercises = React.useMemo(() => {
    if (!selectedCategory) return [];
    return filterPhysicalExercisesByCategory(selectedCategory as CategoryFilter);
  }, [selectedCategory]);
  const selectedCategoryInfo = React.useMemo(
    () => CATEGORY_CARDS.find((item) => item.id === selectedCategory),
    [selectedCategory]
  );

  const handleOpenDetail = (exerciseId: string) => {
    goTo(`/exercises/${exerciseId}`);
  };

  const CategorySelection = () => (
    <div className="f4s-exercises">
      <header className="f4s-exercises__header">
        <h1>Übungen</h1>
        <p className="f4s-exercises__description">Wähle eine Kategorie, um Übungen zu finden.</p>
      </header>

      <div className="f4s-category-list">
        {CATEGORY_CARDS.map((category) => (
          <Card
            key={category.id}
            className={`f4s-category-card ${category.className}`}
            role="button"
            tabIndex={0}
            icon={category.icon}
            iconBackground="rgba(255, 255, 255, 0.35)"
            onClick={() => setSelectedCategory(category.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedCategory(category.id);
              }
            }}
          >
            <div className="f4s-category-card__body">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <Badge variant="accent">Leicht</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const ExerciseCardsForCategory = () => (
    <div className="f4s-exercises">
      <header className="f4s-exercises__header">
        <div>
          <p className="f4s-exercises__eyebrow">Übungen</p>
          <h1>{getCategoryLabel(selectedCategory ?? 'balance')}</h1>
          <p className="f4s-exercises__description">
            {selectedCategoryInfo?.description ?? 'Stärke deine Fitness mit unterhaltsamen Übungen.'}
          </p>
        </div>
        <button
          type="button"
          className="f4s-exercises__back"
          onClick={() => setSelectedCategory(null)}
        >
          Kategorie wechseln
        </button>
      </header>

      <div className="f4s-exercise-cards">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            className={`f4s-exercise-card f4s-exercise-card--${exercise.category}`}
            role="button"
            tabIndex={0}
            icon={<span className="f4s-exercise-card__icon">✤</span>}
            iconBackground="rgba(255, 255, 255, 0.14)"
            onClick={() => handleOpenDetail(exercise.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpenDetail(exercise.id);
              }
            }}
          >
            <div className="f4s-exercise-card__body">
              <div className="f4s-exercise-card__header">
                <h3>{exercise.title}</h3>
                <Badge variant="level">{LEVEL_LABELS[exercise.level]}</Badge>
              </div>
              <p className="f4s-exercise-card__description">
                {getCategoryLabel(exercise.category)} · {getPositionLabel(exercise.position)}
              </p>
              <p className="f4s-exercise-card__meta">
                Dauer {formatDuration(exercise.durationSeconds)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  if (!selectedCategory) return <CategorySelection />;

  return <ExerciseCardsForCategory />;
};

