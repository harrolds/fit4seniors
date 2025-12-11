import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import {
  filterPhysicalExercisesByCategory,
  formatDuration,
  getPositionLabel,
  type CategoryFilter,
} from '../../shared/lib/fit4seniors/physicalExercises';

type CategoryName = 'Balance' | 'Kraft' | 'Mobilität';

const CATEGORY_MAP: Record<CategoryName, CategoryFilter> = {
  Balance: 'balance',
  Kraft: 'strength',
  Mobilität: 'mobility',
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Leicht',
  2: 'Mittel',
  3: 'Anspruchsvoll',
};

const getExercisesForCategory = (category: CategoryName) => {
  const mappedCategory = CATEGORY_MAP[category];
  return filterPhysicalExercisesByCategory(mappedCategory).map((exercise) => ({
    ...exercise,
    description: `${getPositionLabel(exercise.position)} · Dauer ${formatDuration(
      exercise.durationSeconds,
    )}`,
    levelLabel: LEVEL_LABELS[exercise.level] ?? exercise.level,
  }));
};

export function ExercisesList() {
  const { goTo: navigate } = useNavigation();
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryName | null>(null);

  // STEP 1: CATEGORY SELECTION VIEW
  if (!selectedCategory) {
    return (
      <div className="f4s-ex-category-grid">
        <Card
          className="f4s-category-card f4s-category-card--balance"
          onClick={() => setSelectedCategory('Balance')}
        >
          <div className="f4s-category-card__body">
            <h3>Balance</h3>
            <p>Für mehr Stabilität im Alltag</p>
          </div>
          <Badge variant="accent">Leicht</Badge>
        </Card>

        <Card
          className="f4s-category-card f4s-category-card--kraft"
          onClick={() => setSelectedCategory('Kraft')}
        >
          <div className="f4s-category-card__body">
            <h3>Kraft</h3>
            <p>Zur Stärkung der Muskulatur</p>
          </div>
          <Badge variant="accent">Mittel</Badge>
        </Card>

        <Card
          className="f4s-category-card f4s-category-card--mobilitaet"
          onClick={() => setSelectedCategory('Mobilität')}
        >
          <div className="f4s-category-card__body">
            <h3>Mobilität</h3>
            <p>Übungen für bessere Beweglichkeit</p>
          </div>
          <Badge variant="accent">Leicht</Badge>
        </Card>
      </div>
    );
  }

  // STEP 2: EXERCISE LIST FOR SELECTED CATEGORY
  const exercises = getExercisesForCategory(selectedCategory);

  return (
    <div className="f4s-exercise-cards">
      <a className="f4s-category-back" onClick={() => setSelectedCategory(null)}>
        Kategorie wechseln
      </a>

      {exercises.map((ex) => (
        <Card key={ex.id} onClick={() => navigate(`/exercises/${ex.id}`)}>
          <div className="f4s-ex-card-header">
            <h2>{ex.title}</h2>
            <Badge variant="level">{ex.levelLabel}</Badge>
          </div>
          <p>{ex.description}</p>
        </Card>
      ))}
    </div>
  );
}
