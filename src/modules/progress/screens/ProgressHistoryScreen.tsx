import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { useTrainingCatalog, findModule, getIntensityLabel } from '../../../features/trainieren/catalog';
import { CompletedSessionRecord, PROGRESS_STORAGE_EVENT_KEY, loadCompletedSessions } from '../progressStorage';

const createDateFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' });
const createTimeFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });

export const ProgressHistoryScreen: React.FC = () => {
  const { t, locale } = useI18n();
  const { data: catalog } = useTrainingCatalog();
  const [sessions, setSessions] = useState<CompletedSessionRecord[]>(() => loadCompletedSessions());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PROGRESS_STORAGE_EVENT_KEY) return;
      setSessions(loadCompletedSessions());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setSessions(loadCompletedSessions());
  }, []);

  const dateFormatter = useMemo(() => createDateFormatter(locale), [locale]);
  const timeFormatter = useMemo(() => createTimeFormatter(locale), [locale]);

  const getModuleLabel = (moduleId: string): string => {
    const module = findModule(catalog, moduleId);
    return module?.title ?? moduleId;
  };

  const renderMetaRight = (session: CompletedSessionRecord) => {
    if (session.notes) {
      return { icon: 'local_fire_department', text: session.notes };
    }
    return { icon: 'check_circle', text: t('progress.history.status.done') };
  };

  const renderEmpty = () => <Card className="hl-empty">{t('progress.history.empty')}</Card>;

  const formatDuration = (seconds: number): string => {
    const safe = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(safe / 60)
      .toString()
      .padStart(2, '0');
    const secs = (safe % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div className="hl-wrap">
      <div className="hl-header">
        <h1>{t('progress.history.title')}</h1>
        {sessions.length > 0 ? <p>{t('progress.history.subtitleCount', { count: sessions.length })}</p> : null}
      </div>

      {sessions.length === 0 ? (
        renderEmpty()
      ) : (
        <div className="hl-list">
          {sessions.map((session) => {
            const rightMeta = renderMetaRight(session);
            return (
              <Link key={session.id} to={`/progress/history/${session.id}`} className="hl-link">
                <Card className="hl-item">
                  <div className="hl-item__top">
                    <div className="hl-item__left">
                      <div className="hl-item__icon">
                        <Icon name={session.moduleId === 'brain' ? 'psychology' : 'history'} size={26} />
                      </div>
                      <div className="hl-item__text">
                        <h3 className="hl-item__title">{session.trainingTitle}</h3>
                        <div className="hl-item__tags">
                          <span className={`hl-tag hl-tag--module${session.moduleId === 'brain' ? ' hl-tag--module-brain' : ''}`}>
                            {getModuleLabel(session.moduleId)}
                          </span>
                          <span className="hl-tag hl-tag--intensity">
                            {session.intensity ? getIntensityLabel(t, session.intensity) : t('training.intensity.medium')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hl-item__right">
                      {dateFormatter.format(new Date(session.completedAt))}
                      <span>{timeFormatter.format(new Date(session.completedAt))}</span>
                    </div>
                  </div>

                  <div className="hl-item__divider" />

                  <div className="hl-item__meta">
                    <div className="hl-meta__left">
                      <Icon name="schedule" size={18} />
                      {formatDuration(session.durationSecActual)}
                    </div>
                    <div className="hl-meta__right">
                      <Icon name={rightMeta.icon} size={18} />
                      {rightMeta.text}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
