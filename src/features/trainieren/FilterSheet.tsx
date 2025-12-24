import React from 'react';
import '../../shared/panels/bottom-sheet.css';
import { useI18n } from '../../shared/lib/i18n';
import type { DurationBucket, TrainingIntensity } from './catalog';
import { getIntensityLabel } from './catalog';
import './trainieren.css';

type FilterSheetProps = {
  intensities: TrainingIntensity[];
  durations: DurationBucket[];
  onToggleIntensity: (value: TrainingIntensity) => void;
  onToggleDuration: (value: DurationBucket) => void;
  onReset: () => void;
  onApply: () => void;
};

const intensityOptions: { value: TrainingIntensity; icon: string }[] = [
  { value: 'light', icon: 'flight' },
  { value: 'medium', icon: 'fitness_center' },
  { value: 'heavy', icon: 'whatshot' },
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
  const { t } = useI18n();
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
    <div className="bottom-sheet trainieren-filter-sheet">
      <header className="bottom-sheet__header">
        <h2 className="bottom-sheet__title">{t('trainieren.filters.title')}</h2>
      </header>

      <div className="bottom-sheet__body">
        <section className="trainieren-filter-sheet__section">
          <p className="trainieren-filter-sheet__label">{t('trainieren.filters.intensityLabel')}</p>
          <div className="filter-card-group">
            {intensityOptions.map((option) => {
              const active = isIntensityActive(option.value);
              const label = getIntensityLabel(t, option.value);
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
                  <span className="filter-card__label">{label}</span>
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
          <p className="trainieren-filter-sheet__label">{t('trainieren.filters.durationLabel')}</p>
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
                  <span className="filter-duration__unit">{t('trainieren.filters.durationUnit')}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-primary" onClick={handleApply}>
          {t('trainieren.filters.apply')}
        </button>
        <button type="button" className="bottom-sheet__btn-secondary" onClick={handleReset}>
          {t('trainieren.filters.reset')}
        </button>
      </div>
    </div>
  );
};


