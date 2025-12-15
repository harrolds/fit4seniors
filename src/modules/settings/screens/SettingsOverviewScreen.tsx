import React from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';

type OverviewItem = {
  key: string;
  icon: string;
  tone: 'blue' | 'orange' | 'red' | 'green';
  titleKey: string;
  subtitleKey: string;
  to: string;
};

const overviewItems: OverviewItem[] = [
  {
    key: 'accessibility',
    icon: 'text_fields',
    tone: 'blue',
    titleKey: 'settings.overview.items.accessibility.title',
    subtitleKey: 'settings.overview.items.accessibility.subtitle',
    to: '/settings/accessibility',
  },
  {
    key: 'sound',
    icon: 'volume_up',
    tone: 'orange',
    titleKey: 'settings.overview.items.sound.title',
    subtitleKey: 'settings.overview.items.sound.subtitle',
    to: '/settings/sound',
  },
  {
    key: 'notifications',
    icon: 'notifications_active',
    tone: 'red',
    titleKey: 'settings.overview.items.notifications.title',
    subtitleKey: 'settings.overview.items.notifications.subtitle',
    to: '/reminders',
  },
  {
    key: 'profile',
    icon: 'shield',
    tone: 'green',
    titleKey: 'settings.overview.items.profile.title',
    subtitleKey: 'settings.overview.items.profile.subtitle',
    to: '/profile',
  },
  {
    key: 'help',
    icon: 'help_center',
    tone: 'blue',
    titleKey: 'settings.overview.items.help.title',
    subtitleKey: 'settings.overview.items.help.subtitle',
    to: '/settings/help',
  },
];

export const SettingsOverviewScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <div className="settings-page">
      <p className="settings-subtitle">{t('settings.overview.subtitle')}</p>

      <div className="settings-list">
        {overviewItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className="settings-card-button"
            onClick={() => goTo(item.to)}
            aria-label={t(item.titleKey)}
          >
            <div className="settings-card-button__content">
              <span className={`settings-icon settings-icon--${item.tone}`}>
                <Icon name={item.icon} size={28} />
              </span>
              <div>
                <h3 className="settings-tile__title">{t(item.titleKey)}</h3>
                <p className="settings-tile__subtitle">{t(item.subtitleKey)}</p>
              </div>
            </div>
            <Icon name="chevron_right" size={26} className="settings-card-button__chevron" />
          </button>
        ))}
      </div>

      <div className="settings-support-card">
        <h3 className="settings-support-card__title">{t('settings.overview.support.title')}</h3>
        <p className="settings-support-card__text">{t('settings.overview.support.subtitle')}</p>
        <button
          type="button"
          className="settings-support-card__cta"
          onClick={() => goTo('/settings/help')}
        >
          <Icon name="support_agent" size={22} />
          {t('settings.overview.support.cta')}
        </button>
      </div>

      <p className="settings-version">{t('settings.overview.version')}</p>
    </div>
  );
};

