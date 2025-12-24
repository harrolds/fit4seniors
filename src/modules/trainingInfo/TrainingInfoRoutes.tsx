import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useI18n } from '../../shared/lib/i18n';
import { Card, CardBody, CardHeader } from '../../shared/ui/Card';
import { List, ListItem } from '../../shared/ui/List';
import { Icon } from '../../shared/ui/Icon';
import './trainingInfo.css';

const TrainingInfoScreen: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="training-info-panel__screen">
      <h1 className="training-info-panel__title-main">{t('trainingInfo.title')}</h1>
      <Card variant="elevated">
        <CardHeader>
          <Icon name="info" size={24} />
          <div>
            <p className="training-info-card__meta">{t('trainingInfo.panel.title')}</p>
          </div>
        </CardHeader>
        <CardBody>
          <List>
            <ListItem
              title={t('trainingInfo.panel.section.about')}
              subtitle={t('trainingInfo.panel.section.how')}
            />
            <ListItem
              title={t('trainingInfo.panel.section.intensity')}
              subtitle={t('trainingInfo.panel.section.duration')}
            />
            <ListItem
              title={t('trainingInfo.panel.section.media')}
              subtitle={t('trainingInfo.panel.section.pace')}
            />
          </List>
        </CardBody>
      </Card>
    </div>
  );
};

export const TrainingInfoRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TrainingInfoScreen />} />
      <Route path="*" element={<Navigate to="/training-info" replace />} />
    </Routes>
  );
};


