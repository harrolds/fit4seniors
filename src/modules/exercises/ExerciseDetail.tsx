import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import {
  formatDuration,
  getCategoryLabel,
  getPhysicalExerciseById,
  getPositionLabel,
} from '../../shared/lib/fit4seniors/physicalExercises';

type ExerciseDetailView = {
  title: string;
  category: string;
  position: string;
  duration: string;
  safety: string;
  steps: string[];
};

const useExerciseFromRoute = (): ExerciseDetailView | null => {
  const { id } = useParams<{ id: string }>();

  return React.useMemo(() => {
    if (!id) return null;
    const exercise = getPhysicalExerciseById(id);
    if (!exercise) return null;

    return {
      title: exercise.title,
      category: getCategoryLabel(exercise.category),
      position: getPositionLabel(exercise.position),
      duration: formatDuration(exercise.durationSeconds),
      safety: exercise.safetyNote,
      steps: exercise.steps,
    };
  }, [id]);
};

export function ExerciseDetail() {
  const exercise = useExerciseFromRoute();

  if (!exercise) {
    return (
      <div className="f4s-ex-detail">
        <Card>
          <h1>Übung nicht gefunden</h1>
          <p>Bitte wähle eine verfügbare Übung aus der Liste.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="f4s-ex-detail">
      <div className="f4s-ex-media">Media Platzhalter</div>
      <Card>
        <h1>{exercise.title}</h1>
        <p className="f4s-ex-sub">
          {exercise.category} · {exercise.position} · {exercise.duration}
        </p>
        <h3>Sicherheits-Hinweis</h3>
        <p>{exercise.safety}</p>
        <h3>Schritt-für-Schritt</h3>
        <ol>
          {exercise.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <Button fullWidth variant="primary">
          Übung starten
        </Button>
        <div className="f4s-ex-buttons-row">
          <Button variant="secondary">Pause</Button>
          <Button variant="secondary">Stopp</Button>
        </div>
      </Card>
    </div>
  );
}
