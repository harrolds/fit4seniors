import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { saveSettings, useSettingsState } from '../settingsStorage';
import { SectionHeader } from '../../../shared/ui/SectionHeader';

const scaleSteps: Array<'small' | 'default' | 'large'> = ['small', 'default', 'large'];

const sectionPlaceholders: Record<
  string,
  { titleKey: string; bodyKey: string; ctaKey: string; icon: string; target: string }
> = {
  sound: {
    titleKey: 'settings.detail.sound.title',
    bodyKey: 'settings.detail.sound.body',
    ctaKey: 'settings.detail.sound.cta',
    icon: 'volume_up',
    target: '/trainieren',
  },
  profile: {
    titleKey: 'settings.detail.profile.title',
    bodyKey: 'settings.detail.profile.body',
    ctaKey: 'settings.detail.profile.cta',
    icon: 'person',
    target: '/profile',
  },
  default: {
    titleKey: 'settings.detail.generic.title',
    bodyKey: 'settings.detail.generic.body',
    ctaKey: 'settings.detail.generic.cta',
    icon: 'settings',
    target: '/settings/help',
  },
};

export const SettingsDetailScreen: React.FC = () => {
  const { section } = useParams();
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const preferences = useSettingsState();

  const sliderValue = scaleSteps.indexOf(preferences.textScale);
  const activeSliderValue = sliderValue >= 0 ? sliderValue : 1;
  const fillPercentage = useMemo(() => (activeSliderValue / (scaleSteps.length - 1)) * 100, [activeSliderValue]);
  const sectionKey = section || 'default';
  const sectionMeta = sectionPlaceholders[sectionKey] ?? sectionPlaceholders.default;
  const sectionTitle =
    sectionKey === 'accessibility' ? t('settings.detail.accessibility.title') : t(sectionMeta.titleKey);
  const sectionSubtitle =
    sectionKey === 'accessibility' ? t('settings.detail.accessibility.subtitle') : t(sectionMeta.bodyKey);

  const renderAccessibility = () => (
    <>
      <div className="settings-detail__header">
        <p className="settings-detail__intro">{t('settings.detail.accessibility.subtitle')}</p>
      </div>

      <div className="settings-detail__section">
        <div className="settings-detail__section-header">
          <span className="settings-icon settings-icon--orange">
            <Icon name="text_fields" size={28} />
          </span>
          <div>
            <h2 className="settings-detail__section-title">{t('settings.detail.accessibility.title')}</h2>
            <p className="settings-detail__section-subtitle">{t('settings.detail.accessibility.body')}</p>
          </div>
        </div>

        <div className="settings-slider">
          <div className="settings-slider__track">
            <div className="settings-slider__fill" style={{ width: `${fillPercentage}%` }} />
            <div className="settings-slider__thumb" style={{ left: `${fillPercentage}%` }}>
              <Icon name="unfold_more" size={18} />
            </div>
            <input
              type="range"
              min={0}
              max={scaleSteps.length - 1}
              step={1}
              value={activeSliderValue}
              onChange={(event) => {
                const index = Number(event.target.value);
                const next = scaleSteps[index] ?? 'default';
                saveSettings({ textScale: next });
              }}
              className="settings-slider__input"
              aria-label={t('settings.detail.accessibility.sliderLabel')}
            />
          </div>
          <div className="settings-slider__labels">
            <span>{t('settings.detail.accessibility.scale.small')}</span>
            <span>{t('settings.detail.accessibility.scale.default')}</span>
            <span>{t('settings.detail.accessibility.scale.large')}</span>
          </div>
        </div>

        <div className="settings-preview">
          <h3 className="settings-preview__title">{t('settings.detail.accessibility.preview.title')}</h3>
          <p className="settings-preview__text">{t('settings.detail.accessibility.preview.body')}</p>
          <div className="settings-preview__cta">
            <Icon name="play_circle" size={22} />
            {t('settings.detail.accessibility.preview.cta')}
          </div>
        </div>

        <button
          type="button"
          className={`settings-toggle ${preferences.highContrast ? 'settings-toggle--on' : ''}`}
          onClick={() => saveSettings({ highContrast: !preferences.highContrast })}
          aria-pressed={preferences.highContrast}
        >
          <span className="settings-toggle__control" />
          <span>{t('settings.detail.accessibility.highContrast')}</span>
        </button>
      </div>

      <div className="settings-callout">
        <div className="settings-callout__icon">
          <Icon name="info" size={22} />
        </div>
        <div>
          <h4 className="settings-callout__title">{t('settings.detail.accessibility.callout.title')}</h4>
          <p className="settings-callout__body">{t('settings.detail.accessibility.callout.body')}</p>
          <button type="button" className="settings-callout__link" onClick={() => goTo('/settings/help')}>
            {t('settings.detail.accessibility.callout.cta')}
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      </div>
    </>
  );

  const renderPlaceholder = () => {
    const key = sectionKey;
    const meta = sectionMeta;
    const iconTone = key === 'sound' ? 'orange' : key === 'profile' ? 'green' : 'blue';

    return (
      <div className="settings-placeholder">
        <div className="settings-detail__section-header">
          <span className={`settings-icon settings-icon--${iconTone}`}>
            <Icon name={meta.icon} size={26} />
          </span>
          <div>
            <h2 className="settings-placeholder__title">{t(meta.titleKey)}</h2>
            <p className="settings-detail__section-subtitle">{t('settings.detail.generic.subtitle')}</p>
          </div>
        </div>
        <p className="settings-placeholder__text">{t(meta.bodyKey)}</p>
        <button type="button" className="settings-placeholder__cta" onClick={() => goTo(meta.target)}>
          <Icon name="open_in_new" size={20} />
          {t(meta.ctaKey)}
        </button>
      </div>
    );
  };

  return (
    <div className="settings-detail">
      <SectionHeader as="h1" className="page-title" title={sectionTitle} subtitle={sectionSubtitle} />
      {section === 'accessibility' ? renderAccessibility() : renderPlaceholder()}
      <p className="settings-version">{t('settings.overview.version')}</p>
    </div>
  );
};

