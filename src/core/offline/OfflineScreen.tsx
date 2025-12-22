import React from 'react';
import { useI18n } from '../../shared/lib/i18n';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { SectionHeader } from '../../shared/ui/SectionHeader';

interface OfflineScreenProps {
  onRetry?: () => void;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ onRetry }) => {
  const { t } = useI18n();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '1rem 0',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 520,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <SectionHeader
          as="h1"
          className="page-title"
          title={t('core.offline.title')}
          subtitle={t('core.offline.body')}
          style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="button" onClick={handleRetry}>
            {t('core.offline.retry')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

