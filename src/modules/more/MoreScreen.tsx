import React from 'react';
import { Icon } from '../../shared/ui/Icon';
import { SectionHeader } from '../../shared/ui/SectionHeader';
import { usePanels } from '../../shared/lib/panels';
import { useI18n } from '../../shared/lib/i18n';

type MoreItem = {
  id: 'help' | 'privacy' | 'safety' | 'about';
  icon: string;
  titleKey: string;
  subtitleKey: string;
  onClick: () => void;
};

export const MoreScreen: React.FC = () => {
  const { t } = useI18n();
  const { openRightPanel } = usePanels();

  const items: MoreItem[] = [
    {
      id: 'help',
      icon: 'help_center',
      titleKey: 'more.items.help.title',
      subtitleKey: 'more.items.help.subtitle',
      onClick: () => openRightPanel('more-help'),
    },
    {
      id: 'privacy',
      icon: 'lock',
      titleKey: 'more.items.privacy.title',
      subtitleKey: 'more.items.privacy.subtitle',
      onClick: () => openRightPanel('more-privacy'),
    },
    {
      id: 'safety',
      icon: 'health_and_safety',
      titleKey: 'more.items.safety.title',
      subtitleKey: 'more.items.safety.subtitle',
      onClick: () => openRightPanel('more-safety'),
    },
    {
      id: 'about',
      icon: 'info',
      titleKey: 'more.items.about.title',
      subtitleKey: 'more.items.about.subtitle',
      onClick: () => openRightPanel('more-about'),
    },
  ];

  return (
    <div className="more-page">
      <SectionHeader as="h1" className="page-title" title={t('pageTitles.more')} subtitle={t('more.subtitle')} />

      <div className="more-list">
        {items.map((item) => (
          <button key={item.id} type="button" className="more-item" onClick={item.onClick}>
            <span className={`more-item__icon more-item__icon--${item.id}`}>
              <Icon name={item.icon} size={24} />
            </span>
            <span className="more-item__text">
              <span className="more-item__title">{t(item.titleKey)}</span>
              <span className="more-item__subtitle">{t(item.subtitleKey)}</span>
            </span>
            <Icon name="chevron_right" size={22} className="more-item__chevron" />
          </button>
        ))}
      </div>
    </div>
  );
};

