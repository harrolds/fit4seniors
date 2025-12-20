import React from 'react';
import { useNavigation } from '../shared/lib/navigation/useNavigation';
import { useI18n } from '../shared/lib/i18n';
import { Icon } from '../shared/ui/Icon';

type TileTone = 'dark' | 'light';

type TileProps = {
  icon: string;
  title: string;
  subtitle: string;
  backgroundVar: string;
  tone?: TileTone;
  onClick?: () => void;
};

const HomeTile: React.FC<TileProps> = ({ icon, title, subtitle, backgroundVar, tone = 'dark', onClick }) => {
  const toneClass = tone === 'light' ? ' home-tile--light' : '';

  return (
    <button
      type="button"
      className={`home-tile${toneClass}`}
      style={{ backgroundColor: backgroundVar }}
      onClick={onClick}
    >
      <Icon name={icon} size={32} className="home-tile__icon" />
      <div className="home-tile__copy">
        <h3 className="home-tile__title">{title}</h3>
        <p className="home-tile__subtitle">{subtitle}</p>
      </div>
    </button>
  );
};

export const HomeHeroWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <button
      type="button"
      className="home-hero"
      style={{ backgroundColor: 'var(--color-card-accent)' }}
      onClick={() => goTo('/trainieren')}
    >
      <div
        className="home-hero__media"
        style={{
          padding: 'var(--spacing-md)',
          paddingBottom: 0,
          overflow: 'hidden',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          boxSizing: 'border-box',
        }}
      >
        <img
          src="/assets/trainieren/main_excercise.png"
          alt={t('home.hero.imageAlt')}
          className="home-hero__image"
          style={{
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)',
            objectFit: 'cover',
            aspectRatio: '16 / 9',
          }}
          loading="lazy"
        />
      </div>
      <div className="home-hero__content">
        <div className="home-hero__text">
          <div className="home-hero__title-row">
            <Icon name="play_circle" filled size={32} className="home-hero__icon" />
            <h3 className="home-hero__title">{t('home.hero.title')}</h3>
          </div>
          <p className="home-hero__subtitle">{t('home.hero.subtitle')}</p>
        </div>
        <div className="home-hero__action">
          <Icon name="arrow_forward" size={24} className="home-hero__action-icon" />
        </div>
      </div>
    </button>
  );
};

export const BrainTrainingWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <HomeTile
      icon="psychology"
      title={t('home.widgets.brainTraining.title')}
      subtitle={t('home.widgets.brainTraining.subtitle')}
      backgroundVar="var(--color-card-module-1)"
      onClick={() => goTo('/brain')}
    />
  );
};

export const CardioWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <HomeTile
      icon="monitor_heart"
      title={t('home.widgets.cardio.title')}
      subtitle={t('home.widgets.cardio.subtitle')}
      backgroundVar="var(--color-card-module-2)"
      tone="light"
      onClick={() => goTo('/trainieren/cardio')}
    />
  );
};

export const MuscleWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <HomeTile
      icon="fitness_center"
      title={t('home.widgets.muscle.title')}
      subtitle={t('home.widgets.muscle.subtitle')}
      backgroundVar="var(--color-card-module-3)"
      onClick={() => goTo('/trainieren/muskel')}
    />
  );
};

export const BalanceWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <HomeTile
      icon="accessibility_new"
      title={t('home.widgets.balance.title')}
      subtitle={t('home.widgets.balance.subtitle')}
      backgroundVar="var(--color-card-module-4)"
      onClick={() => goTo('/trainieren/balance_flex')}
    />
  );
};

export const RecentTrainingWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <div className="home-history__section">
      <div className="home-section-heading">
        <Icon name="history" size={22} />
        <h3 className="home-section-heading__title">{t('home.widgets.recent.heading')}</h3>
      </div>
      <button
        type="button"
        className="home-history"
        style={{ backgroundColor: 'var(--color-card-module-3)' }}
        onClick={() => goTo('/trainieren')}
      >
        <div className="home-history__icon">
          <Icon name="directions_walk" size={24} className="home-history__icon-symbol" />
        </div>
        <div className="home-history__copy">
          <p className="home-history__title">{t('home.widgets.recent.title')}</p>
          <p className="home-history__subtitle">{t('home.widgets.recent.subtitle')}</p>
        </div>
        <Icon name="chevron_right" size={22} className="home-history__chevron" />
      </button>
    </div>
  );
};



