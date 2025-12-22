import React from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { SectionHeader } from '../../../shared/ui/SectionHeader';

type HelpCard = {
  key: string;
  icon: string;
  tone: 'blue' | 'orange' | 'green' | 'purple';
  titleKey: string;
  subtitleKey: string;
};

const cards: HelpCard[] = [
  {
    key: 'faq',
    icon: 'help_outline',
    tone: 'blue',
    titleKey: 'settings.help.faq.title',
    subtitleKey: 'settings.help.faq.subtitle',
  },
  {
    key: 'safety',
    icon: 'health_and_safety',
    tone: 'orange',
    titleKey: 'settings.help.safety.title',
    subtitleKey: 'settings.help.safety.subtitle',
  },
  {
    key: 'privacy',
    icon: 'lock_outline',
    tone: 'green',
    titleKey: 'settings.help.privacy.title',
    subtitleKey: 'settings.help.privacy.subtitle',
  },
  {
    key: 'updates',
    icon: 'new_releases',
    tone: 'purple',
    titleKey: 'settings.help.updates.title',
    subtitleKey: 'settings.help.updates.subtitle',
  },
];

export const InfoAndHelpScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();

  return (
    <div className="settings-help">
      <SectionHeader
        as="h1"
        className="page-title"
        title={t('settings.help.title')}
        subtitle={t('settings.help.subtitle')}
      />

      <div className="settings-help__list">
        {cards.map((card) => (
          <div key={card.key} className="settings-help__card">
            <span className={`settings-icon settings-icon--${card.tone}`}>
              <Icon name={card.icon} size={24} />
            </span>
            <div className="settings-help__card-copy">
              <h3>{t(card.titleKey)}</h3>
              <p>{t(card.subtitleKey)}</p>
            </div>
            <Icon name="chevron_right" size={22} className="settings-help__chevron" />
          </div>
        ))}
      </div>

      <div className="settings-help__cta">
        <h3 className="settings-help__cta-title">{t('settings.help.contact.title')}</h3>
        <p className="settings-help__cta-text">{t('settings.help.contact.subtitle')}</p>
        <button type="button" className="settings-help__cta-button" onClick={() => goTo('/settings')}>
          <Icon name="support_agent" size={22} />
          {t('settings.help.contact.cta')}
        </button>
      </div>

      <p className="settings-help__version">{t('settings.overview.version')}</p>
    </div>
  );
};

