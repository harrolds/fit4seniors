import React from 'react';
import '../../shared/panels/bottom-sheet.css';
import { useI18n } from '../../shared/lib/i18n';
import type { BrainType, DurationBucket, TrainingIntensity } from './catalog';
import { brainTypesAll, getIntensityLabel } from './catalog';
import './trainieren.css';

type FilterSheetProps = {
  moduleId?: string;
  intensities: TrainingIntensity[];
  durations: DurationBucket[];
  brainTypes?: BrainType[];
  onToggleIntensity: (value: TrainingIntensity) => void;
  onToggleDuration: (value: DurationBucket) => void;
  onToggleBrainType?: (value: BrainType) => void;
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

const brainTypeOptions: { value: BrainType; labelKey: string }[] = [
  { value: 'memory', labelKey: 'brain.types.memory' },
  { value: 'language', labelKey: 'brain.types.language' },
  { value: 'patterns', labelKey: 'brain.types.patterns' },
];

export const FilterSheet: React.FC<FilterSheetProps> = ({
  moduleId,
  intensities,
  durations,
  brainTypes,
  onToggleIntensity,
  onToggleDuration,
  onToggleBrainType,
  onReset,
  onApply,
}) => {
  const { t } = useI18n();
  const [localIntensities, setLocalIntensities] = React.useState<TrainingIntensity[]>(intensities);
  const [localDurations, setLocalDurations] = React.useState<DurationBucket[]>(durations);
  const [localBrainTypes, setLocalBrainTypes] = React.useState<BrainType[]>(brainTypes ?? brainTypesAll);
  const isBrainModule = moduleId === 'brain';

  React.useEffect(() => {
    setLocalIntensities(intensities);
    setLocalDurations(durations);
    setLocalBrainTypes(brainTypes ?? brainTypesAll);
  }, [brainTypes, durations, intensities]);

  const isIntensityActive = (value: TrainingIntensity) => localIntensities.includes(value);
  const isDurationActive = (value: DurationBucket) => localDurations.includes(value);
  const isBrainTypeActive = (value: BrainType) => localBrainTypes.includes(value);

  const handleToggleIntensity = (value: TrainingIntensity) => {
    setLocalIntensities((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    onToggleIntensity(value);
  };

  const handleToggleDuration = (value: DurationBucket) => {
    setLocalDurations((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    onToggleDuration(value);
  };

  const handleToggleBrainType = (value: BrainType) => {
    setLocalBrainTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    onToggleBrainType?.(value);
  };

  const handleReset = () => {
    onReset();
    setLocalIntensities(['light', 'medium', 'heavy']);
    setLocalDurations(['short', 'medium', 'long']);
    setLocalBrainTypes(brainTypesAll);
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

        {isBrainModule ? (
          <section className="trainieren-filter-sheet__section">
            <p className="trainieren-filter-sheet__label">{t('brain.filter.label')}</p>
            <div className="filter-duration-grid">
              {brainTypeOptions.map((option) => {
                const active = isBrainTypeActive(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`filter-duration ${active ? 'filter-duration--active' : ''}`}
                    onClick={() => handleToggleBrainType(option.value)}
                  >
                    <span className="filter-duration__value">{t(option.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
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
        )}
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


