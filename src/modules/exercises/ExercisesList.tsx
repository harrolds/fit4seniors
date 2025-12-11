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
      exercise.durationSeconds
    )}`,
    levelLabel: LEVEL_LABELS[exercise.level] ?? exercise.level,
  }));
};

export function ExercisesList() {
  const { goTo: navigate } = useNavigation();
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryName | null>(null);

  if (!selectedCategory) {
    return (
      <div className="f4s-ex-category-grid">
        <Card onClick={() => setSelectedCategory('Balance')}>
          <h2>Balance</h2>
          <p>Für mehr Stabilität im Alltag</p>
          <Badge variant="accent">Leicht</Badge>
        </Card>
        <Card onClick={() => setSelectedCategory('Kraft')}>
          <h2>Kraft</h2>
          <p>Zur Stärkung der Muskulatur</p>
          <Badge variant="accent">Mittel</Badge>
        </Card>
        <Card onClick={() => setSelectedCategory('Mobilität')}>
          <h2>Mobilität</h2>
          <p>Übungen für bessere Beweglichkeit</p>
          <Badge variant="accent">Leicht</Badge>
        </Card>
      </div>
    );
  }

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

