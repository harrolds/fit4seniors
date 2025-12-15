import React, { useCallback, useMemo } from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { usePanels } from '../../../shared/lib/panels';
import { useSettingsState } from '../settingsStorage';
import { SETTINGS_BOTTOM_TOAST_ID, SettingsToastKind } from '../bottomToast/SettingsBottomToastHost';

type OverviewItem = {
  key: string;
  icon: string;
  tone: 'blue' | 'orange' | 'red' | 'green';
  titleKey: string;
  subtitle: string;
  onClick: () => void;
};

export const SettingsOverviewScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const { openBottomSheet } = usePanels();
  const preferences = useSettingsState();

  const openToast = useCallback(
    (toast: SettingsToastKind) => {
      openBottomSheet(SETTINGS_BOTTOM_TOAST_ID, { activeToast: toast });
    },
    [openBottomSheet],
  );

  const overviewItems: OverviewItem[] = useMemo(
    () => {
      const textScaleLabel = t(`settings.values.textScale.${preferences.textScale}`);
      const contrastLabel = preferences.highContrast
        ? t('settings.values.contrast.on')
        : t('settings.values.contrast.off');
      const accessibilitySubtitle = t('settings.overview.items.accessibility.value', {
        textSize: textScaleLabel,
        contrast: contrastLabel,
      });

      const soundLabel = preferences.soundEnabled ? t('settings.values.sound.on') : t('settings.values.sound.off');
      const hapticsLabel = preferences.hapticsEnabled
        ? t('settings.values.haptics.on')
        : t('settings.values.haptics.off');
      const soundSubtitle = t('settings.overview.items.sound.value', {
        sound: soundLabel,
        haptics: hapticsLabel,
      });

      const languageSubtitle =
        preferences.language === 'en'
          ? t('settings.values.language.en')
          : t('settings.values.language.de');

      return [
        {
          key: 'accessibility',
          icon: 'text_fields',
          tone: 'blue',
          titleKey: 'settings.overview.items.accessibility.title',
          subtitle: accessibilitySubtitle,
          onClick: () => openToast('text'),
        },
        {
          key: 'sound',
          icon: 'volume_up',
          tone: 'orange',
          titleKey: 'settings.overview.items.sound.title',
          subtitle: soundSubtitle,
          onClick: () => openToast('sound'),
        },
        {
          key: 'notifications',
          icon: 'notifications_active',
          tone: 'red',
          titleKey: 'settings.overview.items.notifications.title',
          subtitle: t('settings.overview.items.notifications.subtitle'),
          onClick: () => goTo('/reminders'),
        },
        {
          key: 'language',
          icon: 'language',
          tone: 'green',
          titleKey: 'settings.overview.items.language.title',
          subtitle: languageSubtitle,
          onClick: () => openToast('language'),
        },
      ];
    },
    [
      goTo,
      openToast,
      preferences.highContrast,
      preferences.hapticsEnabled,
      preferences.language,
      preferences.soundEnabled,
      preferences.textScale,
      t,
    ],
  );

  return (
    <div className="settings-page">
      <p className="settings-subtitle">{t('settings.overview.subtitle')}</p>

      <div className="settings-list">
        {overviewItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className="settings-card-button"
            onClick={item.onClick}
            aria-label={t(item.titleKey)}
          >
            <div className="settings-card-button__content">
              <span className={`settings-icon settings-icon--${item.tone}`}>
                <Icon name={item.icon} size={28} />
              </span>
              <div>
                <h3 className="settings-tile__title">{t(item.titleKey)}</h3>
                <p className="settings-tile__subtitle">{item.subtitle}</p>
              </div>
            </div>
            <Icon name="chevron_right" size={26} className="settings-card-button__chevron" />
          </button>
        ))}
      </div>

      <p className="settings-version">{t('settings.overview.version')}</p>
    </div>
  );
};
