// Contract: Registry for modules (id/labelKey/routeBase/component) toggling hasHomeWidget/hasSettings and wiring header actions.
import React, { type ComponentType } from 'react';
import type { ScreenAction } from '../core/screenConfig';
import { TrainierenModule } from '../features/trainieren';
import { useNavigation } from '../shared/lib/navigation/useNavigation';
import { useI18n } from '../shared/lib/i18n';
import { Icon } from '../shared/ui/Icon';

export interface ModuleDefinition {
  id: string;
  labelKey: string;
  routeBase: string;
  hasHomeWidget: boolean;
  hasSettings: boolean;
  settingsRoute?: string;
  component: ComponentType;
  headerActions?: {
    primaryActions?: ScreenAction[];
    menuActions?: ScreenAction[];
  };
}

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

const HomeHeroWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <button
      type="button"
      className="home-hero"
      style={{ backgroundColor: 'var(--color-card-accent)' }}
      onClick={() => goTo('/trainieren')}
    >
      <div className="home-hero__media">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwmV24fPEWuUgxh8SzFgajk_cwXc6hIK1N9JTzex_7bTohw7F85EbAMVuBrHEgBmH6ccH3B2NFAeXW7GfhYcKe_s7uXKXrvc7B_BTgrLA7iTbI3nasaGD7A7FBChX3oB1vG-yFlQuG_CgHrsIYnTxZy4o92G76dCHF0fwFSn4VuFHfj37QGj2jBFhwTwTSKLkWBzx894ONEkeoekl5s4S2J8oigMtJ_2G6-GbyLA44Y5w617n46pIiL4uqmw5mA-l1CgEkJAXhNR8I"
          alt={t('home.hero.imageAlt')}
          className="home-hero__image"
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

const BrainTrainingWidget: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <HomeTile
      icon="psychology"
      title={t('home.widgets.brainTraining.title')}
      subtitle={t('home.widgets.brainTraining.subtitle')}
      backgroundVar="var(--color-card-module-1)"
      onClick={() => goTo('/trainieren/brain')}
    />
  );
};

const CardioWidget: React.FC = () => {
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

const MuscleWidget: React.FC = () => {
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

const BalanceWidget: React.FC = () => {
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

const RecentTrainingWidget: React.FC = () => {
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

export const moduleRegistry: ModuleDefinition[] = [
  {
    id: 'home-start',
    labelKey: 'home.hero.title',
    routeBase: '/home/start',
    hasHomeWidget: true,
    hasSettings: false,
    component: HomeHeroWidget,
  },
  {
    id: 'home-brain',
    labelKey: 'home.widgets.brainTraining.title',
    routeBase: '/home/brain',
    hasHomeWidget: true,
    hasSettings: false,
    component: BrainTrainingWidget,
  },
  {
    id: 'home-cardio',
    labelKey: 'home.widgets.cardio.title',
    routeBase: '/home/cardio',
    hasHomeWidget: true,
    hasSettings: false,
    component: CardioWidget,
  },
  {
    id: 'home-muscle',
    labelKey: 'home.widgets.muscle.title',
    routeBase: '/home/muscle',
    hasHomeWidget: true,
    hasSettings: false,
    component: MuscleWidget,
  },
  {
    id: 'home-balance',
    labelKey: 'home.widgets.balance.title',
    routeBase: '/home/balance',
    hasHomeWidget: true,
    hasSettings: false,
    component: BalanceWidget,
  },
  {
    id: 'home-recent',
    labelKey: 'home.widgets.recent.title',
    routeBase: '/home/recent',
    hasHomeWidget: true,
    hasSettings: false,
    component: RecentTrainingWidget,
  },
  {
    id: 'trainieren',
    labelKey: 'trainieren.title',
    routeBase: '/trainieren/*',
    hasHomeWidget: false,
    hasSettings: false,
    component: TrainierenModule,
  },
];

