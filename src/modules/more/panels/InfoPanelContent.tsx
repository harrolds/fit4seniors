import React from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';

type InfoVariant = 'help' | 'privacy' | 'safety' | 'about';

type PanelContent = {
  titleKey: string;
  leadKey: string;
  sectionTitleKey: string;
  points: string[];
};

const PANEL_COPY: Record<InfoVariant, PanelContent> = {
  help: {
    titleKey: 'more.info.help.title',
    leadKey: 'more.info.help.lead',
    sectionTitleKey: 'more.info.help.sectionTitle',
    points: ['more.info.help.point1', 'more.info.help.point2', 'more.info.help.point3'],
  },
  privacy: {
    titleKey: 'more.info.privacy.title',
    leadKey: 'more.info.privacy.lead',
    sectionTitleKey: 'more.info.privacy.sectionTitle',
    points: ['more.info.privacy.point1', 'more.info.privacy.point2', 'more.info.privacy.point3'],
  },
  safety: {
    titleKey: 'more.info.safety.title',
    leadKey: 'more.info.safety.lead',
    sectionTitleKey: 'more.info.safety.sectionTitle',
    points: ['more.info.safety.point1', 'more.info.safety.point2', 'more.info.safety.point3'],
  },
  about: {
    titleKey: 'more.info.about.title',
    leadKey: 'more.info.about.lead',
    sectionTitleKey: 'more.info.about.sectionTitle',
    points: ['more.info.about.point1', 'more.info.about.point2', 'more.info.about.point3'],
  },
};

export const InfoPanelContent: React.FC<{ variant: InfoVariant; onClose?: () => void }> = ({
  variant,
  onClose,
}) => {
  const { t } = useI18n();
  const content = PANEL_COPY[variant];
  const handleClose = onClose ?? (() => undefined);

  return (
    <div className="info-panel">
      <div className="info-panel__header">
        <button type="button" className="info-panel__close" aria-label={t('common.close')} onClick={handleClose}>
          <Icon name="arrow_back" size={24} />
        </button>
        <div>
          <h1 className="ui-section-header__title info-panel__headline">{t(content.titleKey)}</h1>
        </div>
      </div>

      <div className="info-panel__body">
        <p className="info-panel__lead">{t(content.leadKey)}</p>

        <div className="info-panel__section" role="presentation">
          <p className="info-panel__section-title">{t(content.sectionTitleKey)}</p>
          {content.points.map((pointKey) => (
            <p key={pointKey} className="info-panel__section-text">
              {t(pointKey)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

