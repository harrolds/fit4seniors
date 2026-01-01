import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useI18n } from '../../shared/lib/i18n';
import { Icon } from '../../shared/ui/Icon';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { List } from '../../shared/ui/List';
import { getValue, setValue } from '../../shared/lib/storage';
import {
  useTrainingCatalog,
  findModule,
  listVariantItemsForModule,
  getIntensityLabel,
  type TrainingIntensity,
  type DurationBucket,
  type BrainType,
  brainTypesAll,
} from './catalog';
import { usePanels } from '../../shared/lib/panels';
import { useProfileMotorState, getRecommendationsForTrainingList } from '../../app/services/profileMotor';
import { loadCompletedSessions } from '../../modules/progress/progressStorage';
import { useUserSession } from '../../core/user/userStore';
import { requestStartTrainingWithGate } from '../../core/premium/premiumGateFlow';
import './trainieren.css';

const BRAIN_FILTERS_KEY = 'trainieren:brainFilters:v1';

type StoredBrainFilters = {
  intensities: TrainingIntensity[];
  brainTypes: BrainType[];
};

const allIntensities: TrainingIntensity[] = ['light', 'medium', 'heavy'];
const allDurations: DurationBucket[] = ['short', 'medium', 'long'];

const validateIntensities = (values?: TrainingIntensity[]): TrainingIntensity[] => {
  const filtered = Array.isArray(values)
    ? values.filter((value): value is TrainingIntensity => allIntensities.includes(value as TrainingIntensity))
    : [];
  return filtered.length ? Array.from(new Set(filtered)) : allIntensities;
};

const validateBrainTypes = (values?: BrainType[]): BrainType[] => {
  const filtered = Array.isArray(values)
    ? values.filter((value): value is BrainType => brainTypesAll.includes(value as BrainType))
    : [];
  return filtered.length ? Array.from(new Set(filtered)) : brainTypesAll;
};

const introKeyByModule: Record<string, string> = {
  cardio: 'trainieren.categories.cardio.intro',
  muskel: 'trainieren.categories.strength.intro',
  balance_flex: 'trainieren.categories.balance.intro',
};

type ModuleLandingProps = {
  moduleIdOverride?: string;
};

export const ModuleLanding: React.FC<ModuleLandingProps> = ({ moduleIdOverride }) => {
  const { moduleId: moduleIdFromRoute } = useParams<{ moduleId: string }>();
  const { pathname } = useLocation();
  const moduleId = moduleIdOverride ?? moduleIdFromRoute;
  const { goBack, goTo } = useNavigation();
  const { t } = useI18n();
  const { openBottomSheet, closePanel } = usePanels();
  const { data, isLoading, error } = useTrainingCatalog();
  const session = useUserSession();

  const [activeIntensities, setActiveIntensities] = useState<TrainingIntensity[]>(allIntensities);
  const [activeDurations, setActiveDurations] = useState<DurationBucket[]>(allDurations);
  const [activeBrainTypes, setActiveBrainTypes] = useState<BrainType[]>(brainTypesAll);
  const [brainFiltersHydrated, setBrainFiltersHydrated] = useState(false);

  const moduleDef = findModule(data, moduleId);
  const variantItems = listVariantItemsForModule(data, moduleId);
  const history = useMemo(() => loadCompletedSessions(), []);
  const motorProfile = useProfileMotorState();

  const isBrainModule = moduleId === 'brain';

  const recommendation = useMemo(() => {
    return getRecommendationsForTrainingList(variantItems, motorProfile, history);
  }, [variantItems, history, motorProfile]);

  const visibleItems = useMemo(() => {
    const intensityFiltered = recommendation.items.filter((item) => activeIntensities.includes(item.intensity));

    const filtered = isBrainModule
      ? intensityFiltered.filter((item) =>
        item.brainType ? activeBrainTypes.includes(item.brainType) : activeBrainTypes.length > 0,
      )
      : intensityFiltered.filter((item) => activeDurations.includes(item.durationBucket));

    const isLocked = (item: typeof recommendation.items[number]) =>
      item.requiresPremium && !session.entitlements.isPremium && !session.admin.isAdmin;

    return [...filtered].sort((a, b) => {
      const aLocked = isLocked(a);
      const bLocked = isLocked(b);
      if (aLocked === bLocked) return 0;
      return aLocked ? 1 : -1;
    });
  }, [
    activeDurations,
    activeBrainTypes,
    activeIntensities,
    isBrainModule,
    recommendation.items,
    session.admin.isAdmin,
    session.entitlements.isPremium,
  ]);

  const applyStoredBrainFilters = useCallback(() => {
    const stored = getValue<StoredBrainFilters | null>(BRAIN_FILTERS_KEY, null);
    const nextIntensities = validateIntensities(stored?.intensities);
    const nextBrainTypes = validateBrainTypes(stored?.brainTypes);
    setActiveIntensities(nextIntensities);
    setActiveBrainTypes(nextBrainTypes);
    setBrainFiltersHydrated(true);
  }, []);

  useEffect(() => {
    setActiveDurations(allDurations);

    if (moduleId === 'brain') {
      applyStoredBrainFilters();
      return;
    }

    setActiveIntensities(allIntensities);
    setActiveBrainTypes(brainTypesAll);
    setBrainFiltersHydrated(false);
  }, [applyStoredBrainFilters, moduleId]);

  useEffect(() => {
    if (!isBrainModule) return;
    if (pathname === '/trainieren/brain') {
      applyStoredBrainFilters();
    }
  }, [applyStoredBrainFilters, isBrainModule, pathname]);

  useEffect(() => {
    if (!isBrainModule || !brainFiltersHydrated) return;
    const payload: StoredBrainFilters = {
      intensities: validateIntensities(activeIntensities),
      brainTypes: validateBrainTypes(activeBrainTypes),
    };
    setValue<StoredBrainFilters>(BRAIN_FILTERS_KEY, payload);
  }, [activeIntensities, activeBrainTypes, brainFiltersHydrated, isBrainModule]);

  if (isLoading) {
    return <p className="trainieren-status">{t('trainieren.module.loading')}</p>;
  }

  if (error || !data || !moduleDef) {
    return (
      <div className="trainieren-status">
        <p>{t('trainieren.module.notFound')}</p>
        <Button variant="secondary" onClick={goBack}>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const focusToModule: Record<string, string> = {
    cardio: 'cardio',
    strength: 'muskel',
    balance: 'balance_flex',
  };
  const isProfileMatchModule = focusToModule[motorProfile.preferredFocus] === moduleDef.id;

  const handleNavigateToTraining = (trainingId: string, intensity: TrainingIntensity) => {
    goTo(`/trainieren/${moduleDef.id}/${trainingId}/${intensity}`);
  };

  const handleOpenTraining = (item: ReturnType<typeof listVariantItemsForModule>[number]) => {
    requestStartTrainingWithGate(
      {
        id: item.trainingId,
        title: item.title,
        moduleId: item.moduleId,
        categoryId: moduleDef?.categoryId,
        requiresPremium: item.requiresPremium,
      },
      () => handleNavigateToTraining(item.trainingId, item.intensity),
    );
  };

  const toggleIntensity = (value: TrainingIntensity) => {
    setActiveIntensities((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const toggleDuration = (value: DurationBucket) => {
    setActiveDurations((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  };

  const toggleBrainType = (value: BrainType) => {
    setActiveBrainTypes((prev) => (prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]));
  };

  const resetFilters = () => {
    setActiveIntensities(allIntensities);
    setActiveDurations(allDurations);
    setActiveBrainTypes(brainTypesAll);
    if (isBrainModule) {
      setValue<StoredBrainFilters>(BRAIN_FILTERS_KEY, {
        intensities: allIntensities,
        brainTypes: brainTypesAll,
      });
    }
  };

  const openFilterSheet = () => {
    openBottomSheet('trainieren-filter', {
      moduleId,
      intensities: activeIntensities,
      durations: activeDurations,
      brainTypes: activeBrainTypes,
      onToggleIntensity: toggleIntensity,
      onToggleDuration: toggleDuration,
      onToggleBrainType: toggleBrainType,
      onReset: resetFilters,
      onApply: closePanel,
    });
  };

  const introKey = introKeyByModule[moduleDef.id];
  const introText = introKey ? t(introKey) : '';

  return (
    <div className="trainieren-page trainieren-module-page" data-category={moduleDef.categoryId}>
      <section className="trainieren-module-hero">
        <h1 className="trainieren-module-hero__title">{moduleDef.title}</h1>
        <p className="trainieren-module-hero__intro">
          {introText || moduleDef.description}
        </p>
      </section>

      <div className="trainieren-filter-row">
        <button type="button" className="trainieren-filter-button" onClick={openFilterSheet}>
          <Icon name="tune" size={22} />
          <span>{t('trainieren.module.filterCta')}</span>
        </button>
      </div>

      <div className="trainieren-training-list">
        {visibleItems.length === 0 ? (
          <p className="trainieren-status">{t('trainieren.trainingList.empty')}</p>
        ) : (
          <List className="trainieren-training-list__grid">
            {visibleItems.map((item) => {
              const isRecommended = isProfileMatchModule && recommendation.recommendedIds.has(item.id);
              const isLocked = item.requiresPremium && !session.entitlements.isPremium && !session.admin.isAdmin;

              return (
                <li
                  key={item.id}
                  className={`training-variant-card${isRecommended ? ' training-variant-card--has-recommend' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenTraining(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleOpenTraining(item);
                    }
                  }}
                >
                  {isRecommended ? (
                    <Badge variant="accent" className="training-variant-card__recommend">
                      {t('profileMotor.recommendedForYou')}
                    </Badge>
                  ) : null}
                  <div className="training-variant-card__body">
                    <div className="training-variant-card__icon-tile">
                      <Icon name={moduleDef.icon ?? 'fitness_center'} size={28} />
                    </div>
                    <div className="training-variant-card__content">
                      <div className="training-variant-card__meta">
                        <Badge
                          variant="neutral"
                          className={`training-variant-card__badge training-variant-card__badge--${item.intensity}`}
                        >
                          {getIntensityLabel(t, item.intensity)}
                        </Badge>
                        <div className="training-variant-card__time">
                          <Icon name="schedule" size={18} />
                          <span>
                            {item.durationMin} {t('trainieren.minutes')}
                          </span>
                        </div>
                      </div>
                      <p className="training-variant-card__title">{item.title}</p>
                      <p className="training-variant-card__description">{item.shortDesc}</p>
                      {isLocked ? (
                        <div className="training-variant-card__lock" aria-label={t('premium.gate.locked')}>
                          <Icon name="lock" size={16} />
                          <span>{t('premium.gate.locked')}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    className="training-variant-card__cta"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenTraining(item);
                    }}
                  >
                    {t('trainieren.detail.startCta')}
                  </Button>
                </li>
              );
            })}
          </List>
        )}
      </div>
    </div>
  );
};


