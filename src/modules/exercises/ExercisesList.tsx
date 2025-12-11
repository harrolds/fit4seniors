import React from 'react';
import { Card } from '../../shared/ui/Card';
import { List, ListItem } from '../../shared/ui/List';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import {
  filterPhysicalExercisesByCategory,
  formatDuration,
  getCategoryLabel,
  getPositionLabel,
  type CategoryFilter,
} from '../../shared/lib/fit4seniors/physicalExercises';
import type {
  ExerciseCategory,
  PhysicalExercise,
} from '../../domain/fit4seniors/exercises';

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'balance', label: 'Balance' },
  { id: 'strength', label: 'Kraft' },
  { id: 'mobility', label: 'Mobilität' },
];

const CATEGORY_DESCRIPTIONS: Record<ExerciseCategory, string> = {
  balance: 'Für mehr Stabilität im Alltag',
  strength: 'Zur Stärkung der Muskulatur',
  mobility: 'Übungen für bessere Beweglichkeit',
};

const LEVEL_LABELS: Record<PhysicalExercise['level'], string> = {
  1: 'Leicht',
  2: 'Mittel',
  3: 'Anspruchsvoll',
};

const CATEGORY_CLASS: Record<ExerciseCategory, string> = {
  balance: 'f4s-exercises__card--balance',
  strength: 'f4s-exercises__card--kraft',
  mobility: 'f4s-exercises__card--mobilitaet',
};

export const ExercisesList: React.FC = () => {
  const { goTo } = useNavigation();
  const [filter, setFilter] = React.useState<CategoryFilter>('all');

  const filteredExercises = React.useMemo(
    () => filterPhysicalExercisesByCategory(filter),
    [filter]
  );

  const handleOpenDetail = (exerciseId: string) => {
    goTo(`/exercises/${exerciseId}`);
  };

  return (
    <div className="f4s-exercises">
      <header className="f4s-exercises__header">
        <h1>Übungen</h1>
        <p className="f4s-exercises__description">
          Wähle eine Kategorie, um Übungen zu finden.
        </p>
      </header>

      <div className="f4s-exercises__filters" aria-label="Übungskategorien">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`f4s-exercises__filter-button ${
              filter === category.id ? 'f4s-exercises__filter-button--active' : ''
            }`}
            onClick={() => setFilter(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <List className="f4s-exercises__list">
        {filteredExercises.map((exercise) => (
          <ListItem key={exercise.id} className="f4s-exercises__list-item">
            <Card
              className={`f4s-exercises__card ${
                CATEGORY_CLASS[exercise.category] ?? ''
              }`}
              role="button"
              tabIndex={0}
              onClick={() => handleOpenDetail(exercise.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleOpenDetail(exercise.id);
                }
              }}
            >
              <div className="f4s-exercises__card-body">
                <div className="f4s-exercises__card-top">
                  <h3 className="f4s-exercises__card-title">{exercise.title}</h3>
                  <span className="f4s-exercises__badge">
                    {LEVEL_LABELS[exercise.level]}
                  </span>
                </div>
                <p className="f4s-exercises__card-description">
                  {CATEGORY_DESCRIPTIONS[exercise.category]}
                </p>
                <p className="f4s-exercises__card-duration">
                  Dauer: {formatDuration(exercise.durationSeconds)}
                </p>
                <div className="f4s-exercises__card-meta">
                  <span>{getCategoryLabel(exercise.category)}</span>
                  <span>{getPositionLabel(exercise.position)}</span>
                </div>
              </div>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

