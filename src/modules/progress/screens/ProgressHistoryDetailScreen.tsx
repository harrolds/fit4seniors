import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useTrainingCatalog, findModule } from '../../../features/trainieren/catalog';
import { CompletedSessionRecord, PROGRESS_STORAGE_EVENT_KEY, getSessionById } from '../progressStorage';
import { getValue, setValue } from '../../../shared/lib/storage';
import { useDisplayName } from '../../profile';

const createDateFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
const createTimeFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { timeStyle: 'short' });

type MoodValue = 'poor' | 'ok' | 'good' | 'great';

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
  const [mood, setMood] = useState<MoodValue>('good');
  const [showToast, setShowToast] = useState(false);

  const moodKey = id ? `progress:mood:${id}` : null;

  useEffect(() => {
    if (moodKey) {
      const stored = getValue<MoodValue | null>(moodKey, null);
      if (stored) setMood(stored);
    }
  }, [moodKey]);

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

  const handleMood = (value: MoodValue) => {
    setMood(value);
    if (moodKey) {
      setValue<MoodValue>(moodKey, value);
    }
  };

  const handleShare = () => {
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2000);
  };

  const moodOptions: { value: MoodValue; emoji: string; label: string }[] = [
    { value: 'poor', emoji: '🙁', label: t('progress.history.detail.mood.poor') },
    { value: 'ok', emoji: '😐', label: t('progress.history.detail.mood.ok') },
    { value: 'good', emoji: '🙂', label: t('progress.history.detail.mood.good') },
    { value: 'great', emoji: '😃', label: t('progress.history.detail.mood.great') },
  ];

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
      <Button onClick={goBack} variant="ghost" className="hd-back">
        <Icon name="arrow_back" size={20} />
        {t('common.back')}
      </Button>

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
          <div>
            <p className="hd-stat__label">{t('progress.history.detail.fields.calories')}</p>
            <p className="hd-stat__value">—</p>
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

      <Card className="hd-card hd-mood">
        <h3>{t('progress.history.detail.mood.title')}</h3>
        <div className="hd-mood__options">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`hd-mood__option ${mood === option.value ? 'hd-mood__option--active' : ''}`}
              onClick={() => handleMood(option.value)}
            >
              <span className="hd-mood__emoji">{option.emoji}</span>
              <span className="hd-mood__label">{option.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Button className="hd-cta" variant="primary" onClick={handleShare}>
        <Icon name="share" size={20} />
        {t('progress.history.detail.share')}
      </Button>

      {showToast ? <div className="hd-toast">{t('progress.history.detail.shareToast')}</div> : null}
    </div>
  );
};
