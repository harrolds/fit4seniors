import React from 'react';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { BRAIN_CATEGORIES } from '../brainCatalog';

export const BrainOverviewScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  const handleStart = () => {
    goTo('/brain/session/wordpuzzle');
  };

  const handleCategoryClick = (categoryId: string) => {
    goTo(`/brain/category/${categoryId}`);
  };

  return (
    <div className="brain-page">
      <section className="brain-hero">
        <SectionHeader as="h1" className="page-title" title={t('brain.header.title')} />
        <div className="brain-hero__actions">
          <Button variant="primary" onClick={handleStart}>
            {t('brain.overview.quickStart')}
          </Button>
        </div>
      </section>

      <section className="brain-section" aria-label={t('brain.overview.title')}>
        <SectionHeader as="h2" title={t('brain.overview.categoriesTitle')} />
        <div className="brain-category-grid">
          {BRAIN_CATEGORIES.map((category) => (
            <Card key={category.id} className="brain-category-card" variant="elevated">
              <button type="button" className="brain-category-card__body" onClick={() => handleCategoryClick(category.id)}>
                <div className="brain-card__header">
                  <div className="brain-card__icon">
                    <Icon name={category.icon} size={32} />
                  </div>
                  <div className="brain-card__copy">
                    <h3 className="brain-card__title">{t(category.titleKey)}</h3>
                    <p className="brain-card__subtitle">{t(category.subtitleKey)}</p>
                  </div>
                </div>
                <div className="brain-category-card__footer">
                  <span>{t('brain.overview.openCategory')}</span>
                  <Icon name="chevron_right" size={20} />
                </div>
              </button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};



