import React from 'react';
import type { DurationBucket, TrainingIntensity } from './catalog';
import './trainieren.css';

type FilterSheetProps = {
  intensities: TrainingIntensity[];
  durations: DurationBucket[];
  onToggleIntensity: (value: TrainingIntensity) => void;
  onToggleDuration: (value: DurationBucket) => void;
  onReset: () => void;
  onApply: () => void;
};

const intensityOptions: { value: TrainingIntensity; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'flight' },
  { value: 'medium', label: 'Middel', icon: 'fitness_center' },
  { value: 'heavy', label: 'Zwaar', icon: 'whatshot' },
];

const durationOptions: { value: DurationBucket; label: string }[] = [
  { value: 'short', label: '0-10' },
  { value: 'medium', label: '10-20' },
  { value: 'long', label: '20+' },
];

export const FilterSheet: React.FC<FilterSheetProps> = ({
  intensities,
  durations,
  onToggleIntensity,
  onToggleDuration,
  onReset,
  onApply,
}) => {
  const [localIntensities, setLocalIntensities] = React.useState<TrainingIntensity[]>(intensities);
  const [localDurations, setLocalDurations] = React.useState<DurationBucket[]>(durations);

  React.useEffect(() => {
    setLocalIntensities(intensities);
    setLocalDurations(durations);
  }, [intensities, durations]);

  const isIntensityActive = (value: TrainingIntensity) => localIntensities.includes(value);
  const isDurationActive = (value: DurationBucket) => localDurations.includes(value);

  const handleToggleIntensity = (value: TrainingIntensity) => {
    setLocalIntensities((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    onToggleIntensity(value);
  };

  const handleToggleDuration = (value: DurationBucket) => {
    setLocalDurations((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    onToggleDuration(value);
  };

  const handleReset = () => {
    onReset();
    setLocalIntensities(['light', 'medium', 'heavy']);
    setLocalDurations(['short', 'medium', 'long']);
  };

  const handleApply = () => {
    onApply();
  };

  return (
    <div className="trainieren-filter-sheet">
      <header className="trainieren-filter-sheet__header">
        <h3 className="trainieren-filter-sheet__title">Filters</h3>
      </header>

      <section className="trainieren-filter-sheet__section">
        <p className="trainieren-filter-sheet__label">HOE ZWAAR</p>
        <div className="filter-card-group">
          {intensityOptions.map((option) => {
            const active = isIntensityActive(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={`filter-card ${active ? 'filter-card--active' : ''}`}
                onClick={() => handleToggleIntensity(option.value)}
              >
                <div className={`filter-card__icon filter-card__icon--${option.value}`}>
                  <span className="material-symbols-outlined">{option.icon}</span>
                </div>
                <span className="filter-card__label">{option.label}</span>
                <span
                  className={`material-symbols-outlined filter-card__check${active ? ' filter-card__check--active' : ''}`}
                  aria-hidden="true"
                >
                  {active ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="trainieren-filter-sheet__section">
        <p className="trainieren-filter-sheet__label">HOE LANG</p>
        <div className="filter-duration-grid">
          {durationOptions.map((option) => {
            const active = isDurationActive(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={`filter-duration ${active ? 'filter-duration--active' : ''}`}
                onClick={() => handleToggleDuration(option.value)}
              >
                <span className="filter-duration__value">{option.label}</span>
                <span className="filter-duration__unit">min</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="trainieren-filter-sheet__footer">
        <button type="button" className="filter-apply" onClick={handleApply}>
          Anwenden
        </button>
        <button type="button" className="filter-reset" onClick={handleReset}>
          Zurücksetzen
        </button>
      </div>
    </div>
  );
};


