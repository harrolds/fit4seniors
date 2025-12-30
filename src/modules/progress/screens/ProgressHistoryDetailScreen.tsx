import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useTrainingCatalog, findModule } from '../../../features/trainieren/catalog';
import { CompletedSessionRecord, PROGRESS_STORAGE_EVENT_KEY, getSessionById } from '../progressStorage';
import { useDisplayName } from '../../profile';

const createDateFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
const createTimeFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { timeStyle: 'short' });

export const ProgressHistoryDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const displayName = useDisplayName('');
  const nameSuffix = displayName ? `, ${displayName}` : '';
  const { data: catalog } = useTrainingCatalog();
  const [session, setSession] = useState<CompletedSessionRecord | null>(() =>
    id ? getSessionById(id) : null,
  );
  useEffect(() => {
    if (!id) return;
    setSession(getSessionById(id));
  }, [id]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PROGRESS_STORAGE_EVENT_KEY || !id) return;
      setSession(getSessionById(id));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [id]);

  const dateFormatter = useMemo(() => createDateFormatter(locale), [locale]);
  const timeFormatter = useMemo(() => createTimeFormatter(locale), [locale]);
  const goBack = () => navigate('/progress/history');

  const moduleLabel = useMemo(() => {
    if (!session) return '';
    const module = findModule(catalog, session.moduleId);
    return module?.title ?? session.moduleId;
  }, [catalog, session]);

  const durationActualMinutes = useMemo(
    () => (session ? Math.round(session.durationSecActual / 60) : 0),
    [session],
  );

  if (!session) {
    return (
      <div className="hd-wrap">
        <Card className="hd-card hd-empty">
          {t('progress.history.detail.notFound')}
        </Card>
        <Button onClick={goBack} variant="secondary">
          <Icon name="arrow_back" size={20} />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="hd-wrap">
      <SectionHeader
        as="h1"
        className="page-title hd-intro"
        title={t('progress.history.detail.heroTitle', { name: nameSuffix })}
        subtitle={t('progress.history.detail.heroSubtitle')}
      />

      <Card variant="elevated" className="hd-hero">
        <div className="hd-hero__icon">
          <Icon name="health_and_safety" size={34} />
        </div>
        <h2>{session.trainingTitle}</h2>
        <span className="hd-hero__status">
          <Icon name="check" size={18} />
          {t('progress.history.detail.status')}
        </span>
        <div className="hd-hero__divider" />
        <div className="hd-hero__stats">
          <div>
            <p className="hd-stat__label">{t('progress.history.detail.fields.durationActual')}</p>
            <p className="hd-stat__value">{durationActualMinutes} {t('trainieren.minutes')}</p>
          </div>
        </div>
      </Card>

      <Card className="hd-card">
        <div className="hd-info__row">
          <span className="hd-info__icon">
            <Icon name="category" size={22} />
          </span>
          <p className="hd-info__label">{t('progress.history.detail.fields.category')}</p>
          <p className="hd-info__value">{moduleLabel}</p>
        </div>
        <div className="hd-info__row">
          <span className="hd-info__icon">
            <Icon name="event" size={22} />
          </span>
          <p className="hd-info__label">{t('progress.history.detail.fields.date')}</p>
          <p className="hd-info__value">{dateFormatter.format(new Date(session.completedAt))}</p>
        </div>
        <div className="hd-info__row">
          <span className="hd-info__icon">
            <Icon name="schedule" size={22} />
          </span>
          <p className="hd-info__label">{t('progress.history.detail.fields.startTime')}</p>
          <p className="hd-info__value">{timeFormatter.format(new Date(session.completedAt))}</p>
        </div>
      </Card>
    </div>
  );
};
