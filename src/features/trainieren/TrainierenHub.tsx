import React, { useMemo, useState } from 'react';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { ModuleCard } from '../../shared/ui/ModuleCard';
import { Button } from '../../shared/ui/Button';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { useTrainingCatalog, toneToCssVar } from './catalog';
import { Badge } from '../../shared/ui/Badge';
import { useProfileMotorState } from '../../app/services/profileMotor';
import './trainieren.css';

export const TrainierenHub: React.FC = () => {
  const { goTo } = useNavigation();
  const { t, locale } = useI18n();
  const { data, isLoading, error } = useTrainingCatalog();
  const [showMore, setShowMore] = useState(false);
  const profile = useProfileMotorState();
  const preferredModuleId = useMemo(() => {
    const mapping: Record<string, string> = {
      cardio: 'cardio',
      strength: 'muskel',
      balance: 'balance_flex',
    };
    return mapping[profile.preferredFocus] ?? null;
  }, [profile.preferredFocus]);

  const orderedModules = useMemo(() => {
    if (!data?.modules) return [];
    const modules = [...data.modules];
    if (!preferredModuleId) return modules;
    return modules.sort((a, b) => {
      if (a.id === preferredModuleId) return -1;
      if (b.id === preferredModuleId) return 1;
      return 0;
    });
  }, [data?.modules, preferredModuleId]);

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.hub.loading')}</p>;
  }

  if (error || !data) {
    return <p className="trainieren-status">{t('trainieren.hub.error')}</p>;
  }

  const moduleImageMap: Record<string, string> = {
    cardio: '/assets/trainieren/cardio_excercise.webp',
    strength: '/assets/trainieren/strength_exercise.webp',
    muskelaufbau: '/assets/trainieren/strength_exercise.webp',
    muskel: '/assets/trainieren/strength_exercise.webp',
    balance: '/assets/trainieren/balance_excercise.webp',
    balance_flex: '/assets/trainieren/balance_excercise.webp',
  };

  return (
    <div className="trainieren-page">
      <>
        {/* Training Overview Intro */}
        <section className="training-intro" lang={locale} aria-labelledby="training-intro-title">
          <SectionHeader
            as="h1"
            className="page-title"
            title={t('trainierenHub.title')}
            subtitle={t('trainierenHub.intro.p1')}
          />

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
            </ul>

            <p className="training-intro-goal">{t('trainierenHub.intro.p2')}</p>
          </div>
        </section>
      </>

      <div className="trainieren-grid">
        {orderedModules.map((module) => (
          /* Media renders first via CSS order for Trainieren page */
          <ModuleCard
            key={module.id}
            tone={module.tone}
            title={module.title}
            subtitle={module.description}
            rightSlot={<Icon name={module.icon} size={28} />}
            role="button"
            tabIndex={0}
            onClick={() => goTo(`/trainieren/${module.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goTo(`/trainieren/${module.id}`);
              }
            }}
            className="trainieren-module-card"
            style={{ cursor: 'pointer', backgroundColor: toneToCssVar(module.tone) }}
            aria-label={module.title}
          >
            {preferredModuleId === module.id ? (
              <Badge variant="accent" className="trainieren-reco-badge">
                {t('profileMotor.recommendedForYou')}
              </Badge>
            ) : null}
            <div className="trainieren-card-media" aria-hidden="true">
              <img
                className="trainieren-card-media__img"
                src={moduleImageMap[module.id] ?? '/assets/trainieren/main_excercise.webp'}
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


