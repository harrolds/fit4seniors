import React from 'react';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';

export const BrainOverviewScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  const handleStart = () => {
    goTo('/brain/session/wordpuzzle');
  };

  return (
    <div className="brain-page">
      <section className="brain-hero">
        <p className="brain-hero__eyebrow">{t('brain.overview.title')}</p>
        <h2 className="brain-hero__title">{t('brain.header.title')}</h2>
      </section>

      <section className="brain-section" aria-label={t('brain.overview.title')}>
        <Card className="brain-card" variant="elevated">
          <div className="brain-card__header">
            <div className="brain-card__icon">
              <Icon name="psychology" size={32} />
            </div>
            <div className="brain-card__copy">
              <h3 className="brain-card__title">{t('brain.overview.card.wordpuzzle.title')}</h3>
              <p className="brain-card__subtitle">{t('brain.overview.card.wordpuzzle.subtitle')}</p>
            </div>
          </div>

          <div className="brain-card__cta">
            <Button variant="primary" fullWidth onClick={handleStart}>
              {t('brain.overview.start')}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

