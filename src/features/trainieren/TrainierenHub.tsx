import React, { useState } from 'react';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { ModuleCard } from '../../shared/ui/ModuleCard';
import { Button } from '../../shared/ui/Button';
import { useTrainingCatalog, toneToCssVar } from './catalog';
import './trainieren.css';

export const TrainierenHub: React.FC = () => {
  const { goTo } = useNavigation();
  const { t, locale } = useI18n();
  const { data, isLoading, error } = useTrainingCatalog();
  const [showMore, setShowMore] = useState(false);

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.hub.loading')}</p>;
  }

  if (error || !data) {
    return <p className="trainieren-status">{t('trainieren.hub.error')}</p>;
  }

  const moduleImageMap: Record<string, string> = {
    cardio: '/assets/trainieren/cardio_excercise.png',
    strength: '/assets/trainieren/strength_exercise.png',
    muskelaufbau: '/assets/trainieren/strength_exercise.png',
    muskel: '/assets/trainieren/strength_exercise.png',
    balance: '/assets/trainieren/balance_excercise.png',
    balance_flex: '/assets/trainieren/balance_excercise.png',
    brain: '/assets/trainieren/brain_excercise.png',
  };

  return (
    <div className="trainieren-page">
      <>
        {/* Training Overview Intro */}
        <section className="training-intro" lang={locale} aria-labelledby="training-intro-title">
          <h2 id="training-intro-title">{t('trainierenHub.title')}</h2>

          <p>{t('trainierenHub.intro.p1')}</p>

          <Button
            variant="primary"
            className="training-intro-toggle"
            onClick={() => setShowMore((prev) => !prev)}
            aria-expanded={showMore}
            aria-controls="training-intro-details"
          >
            {showMore ? t('trainierenHub.toggle.less') : t('trainierenHub.toggle.more')}
          </Button>

          <div
            id="training-intro-details"
            style={{
              maxHeight: showMore ? 1600 : 0,
              overflow: 'hidden',
              transition: 'max-height var(--motion-duration-normal, 250ms) var(--motion-ease-standard, ease)',
            }}
            aria-hidden={!showMore}
          >
            <ul className="training-intro-list">
              <li>{t('trainierenHub.bullets.cardio')}</li>
              <li>{t('trainierenHub.bullets.strength')}</li>
              <li>{t('trainierenHub.bullets.balance')}</li>
              <li>{t('trainierenHub.bullets.brain')}</li>
            </ul>

            <p className="training-intro-goal">{t('trainierenHub.intro.p2')}</p>
          </div>
        </section>
      </>

      <div className="trainieren-grid">
        {data.modules.map((module) => (
          /* Media renders first via CSS order for Trainieren page */
          <ModuleCard
            key={module.id}
            tone={module.tone}
            title={module.title}
            subtitle={module.description}
            rightSlot={<Icon name={module.icon} size={28} />}
            role="button"
            tabIndex={0}
            onClick={() => (module.id === 'brain' ? goTo('/brain') : goTo(`/trainieren/${module.id}`))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (module.id === 'brain') {
                  goTo('/brain');
                } else {
                  goTo(`/trainieren/${module.id}`);
                }
              }
            }}
            className="trainieren-module-card"
            style={{ cursor: 'pointer', backgroundColor: toneToCssVar(module.tone) }}
            aria-label={module.title}
          >
            <div className="trainieren-card-media" aria-hidden="true">
              <img
                className="trainieren-card-media__img"
                src={moduleImageMap[module.id]}
                alt=""
                loading="lazy"
              />
            </div>
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};


