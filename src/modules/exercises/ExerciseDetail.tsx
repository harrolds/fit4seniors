import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import {
  formatDuration,
  getCategoryLabel,
  getPhysicalExerciseById,
  getPositionLabel,
} from '../../shared/lib/fit4seniors/physicalExercises';

export const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { goTo } = useNavigation();
  const exercise = React.useMemo(() => getPhysicalExerciseById(id), [id]);
  const [imageError, setImageError] = React.useState(false);
  React.useEffect(() => {
    setImageError(false);
  }, [id]);

  if (!exercise) {
    return (
      <div className="f4s-exercise-detail">
        <Card>
          <h1>Übung nicht gefunden.</h1>
          <p>Bitte gehe zurück zur Übersicht und wähle eine verfügbare Übung aus.</p>
          <div className="f4s-exercise-detail__actions">
            <Button variant="secondary" onClick={() => goTo('/exercises')}>
              Zurück zur Übersicht
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const imageSrc = exercise.imageName
    ? `/images/fit4seniors/exercises/${exercise.imageName}.png`
    : null;
  const shouldShowImage = Boolean(imageSrc && !imageError);

  return (
    <div className="f4s-exercise-detail">
      <Card className="f4s-exercise-detail__card">
        {imageSrc && (
          <div className="f4s-exercise-detail__image-wrapper">
            {shouldShowImage ? (
              <img
                src={imageSrc}
                alt={exercise.title}
                className="f4s-exercise-detail__image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="f4s-exercise-detail__image-placeholder">
                <span>Bild folgt</span>
              </div>
            )}
          </div>
        )}

        <header className="f4s-exercise-detail__header">
          <h1>{exercise.title}</h1>
          <p className="f4s-exercise-detail__subtitle">
            {getCategoryLabel(exercise.category)} · {getPositionLabel(exercise.position)} ·{' '}
            {formatDuration(exercise.durationSeconds)}
          </p>
        </header>

        <section className="f4s-exercise-detail__section">
          <h2 className="f4s-exercise-detail__section-title">Details</h2>
          <ul className="f4s-exercise-detail__meta">
            <li>
              <strong>Kategorie:</strong> {getCategoryLabel(exercise.category)}
            </li>
            <li>
              <strong>Dauer:</strong> {formatDuration(exercise.durationSeconds)}
            </li>
            <li>
              <strong>Position:</strong> {getPositionLabel(exercise.position)}
            </li>
          </ul>
        </section>

        <section className="f4s-exercise-detail__section">
          <h2 className="f4s-exercise-detail__section-title">Sicherheits-Hinweis</h2>
          <p className="f4s-exercise-detail__safety">{exercise.safetyNote}</p>
        </section>

        <section className="f4s-exercise-detail__section">
          <h2 className="f4s-exercise-detail__section-title">Schritt-für-Schritt</h2>
          <ol className="f4s-exercise-detail__steps">
            {exercise.steps.map((step, index) => (
              <li key={step + index}>{step}</li>
            ))}
          </ol>
        </section>

        <div className="f4s-exercise-detail__actions">
          <Button variant="secondary" onClick={() => goTo('/exercises')}>
            Zurück zur Übersicht
          </Button>
        </div>
      </Card>
    </div>
  );
};

