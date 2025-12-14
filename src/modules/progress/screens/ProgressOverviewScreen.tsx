import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { CompletedSessionRecord, PROGRESS_STORAGE_EVENT_KEY, loadCompletedSessions } from '../progressStorage';

const createWeekdayFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { weekday: 'short' });

const getStartOfWeek = (now: Date): Date => {
  const result = new Date(now);
  const day = result.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // move to Monday
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + diff);
  return result;
};

const getEndOfWeek = (start: Date): Date => {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const ProgressOverviewScreen: React.FC = () => {
  const { t, locale } = useI18n();
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

  const weekdayFormatter = useMemo(() => createWeekdayFormatter(locale), [locale]);

  const startOfWeek = useMemo(() => getStartOfWeek(new Date()), []);
  const endOfWeek = useMemo(() => getEndOfWeek(startOfWeek), [startOfWeek]);

  const { activeDaysThisWeek, sessionsThisWeek, weeklyBrainSessions } = useMemo(() => {
    const uniqueDays = new Set<string>();
    let weeklySessions = 0;
    let weeklyBrainSessions = 0;
    sessions.forEach((session) => {
      const date = new Date(session.completedAt);
      if (date >= startOfWeek && date <= endOfWeek) {
        weeklySessions += 1;
        if (session.moduleId === 'brain') {
          weeklyBrainSessions += 1;
        }
        uniqueDays.add(date.toDateString());
      }
    });
    return { activeDaysThisWeek: uniqueDays.size, sessionsThisWeek: weeklySessions, weeklyBrainSessions };
  }, [sessions, startOfWeek, endOfWeek]);

  const totalMinutes = useMemo(() => {
    const totalSeconds = sessions.reduce((acc, session) => acc + (session.durationSecActual || 0), 0);
    return Math.round(totalSeconds / 60);
  }, [sessions]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const label = weekdayFormatter.format(date);
      const isActive = sessions.some((session) => {
        const sessionDate = new Date(session.completedAt);
        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      });
      return { label, isActive };
    });
  }, [startOfWeek, sessions, weekdayFormatter]);

  const progressClass = `po-ring__shell po-ring__shell--${activeDaysThisWeek}`;

  return (
    <div className="po-wrap">
      <p className="po-subtitle">{t('progress.subtitle')}</p>

      <Card variant="elevated" className="po-weekCard">
        <h2>{t('progress.kpi.activeDays')}</h2>
        <div className="po-ring">
          <div className={progressClass}>
            <div className="po-ring__inner">
              <div className="po-ring__value">
                {activeDaysThisWeek}/7
              </div>
              <div className="po-ring__label">{t('progress.activeDaysLabel')}</div>
            </div>
          </div>
        </div>

        <div className="po-days">
          {weekDays.map((day, index) => {
            const circleClass = day.isActive
              ? 'po-chip__circle po-chip__circle--active'
              : index === 5
                ? 'po-chip__circle po-chip__circle--outline'
                : 'po-chip__circle po-chip__circle--inactive';
            return (
              <div className="po-chip" key={day.label}>
                <div className={circleClass} aria-label={day.isActive ? t('progress.dayActive') : t('progress.dayInactive')}>
                  {day.isActive ? <Icon name="check" size={18} /> : null}
                </div>
                <span className="po-chip__label">{day.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="po-kpis">
        <Card className="po-kpiCard">
          <div className="po-kpiCard__left">
            <div className="po-kpiCard__icon po-kpiCard__icon--green">
              <Icon name="fitness_center" size={26} />
            </div>
            <div className="po-kpiCard__meta">
              <p className="po-kpiCard__label">{t('progress.kpi.totalTrainings')}</p>
              <p className="po-kpiCard__value">{sessions.length}</p>
            </div>
          </div>
          <span className="po-kpiCard__badge po-kpiCard__badge--green">
            {`${sessionsThisWeek} ${t('progress.kpi.weekDelta')}`}
          </span>
        </Card>

        <Card className="po-kpiCard">
          <div className="po-kpiCard__left">
            <div className="po-kpiCard__icon po-kpiCard__icon--blue">
              <Icon name="watch_later" size={26} />
            </div>
            <div className="po-kpiCard__meta">
              <p className="po-kpiCard__label">{t('progress.kpi.totalMinutes')}</p>
              <p className="po-kpiCard__value">{totalMinutes}</p>
            </div>
          </div>
          <span className="po-kpiCard__badge po-kpiCard__badge--blue">{t('progress.kpi.target')}</span>
        </Card>

        <Card className="po-kpiCard po-kpiCard--brain">
          <div className="po-kpiCard__left">
            <div className="po-kpiCard__icon po-kpiCard__icon--brain">
              <Icon name="psychology" size={26} />
            </div>
            <div className="po-kpiCard__meta">
              <p className="po-kpiCard__label">{t('progress.brain.title')}</p>
              <p className="po-kpiCard__value">{weeklyBrainSessions}</p>
            </div>
          </div>
          <span className="po-kpiCard__badge po-kpiCard__badge--brain">
            {t('progress.brain.weeklyCount', { count: weeklyBrainSessions })}
          </span>
        </Card>
      </div>

      <Card className="po-motivation">
        <div className="po-motivation__icon">
          <Icon name="emoji_events" size={26} />
        </div>
        <div className="po-motivation__text">
          <p className="po-motivation__title">{t('progress.highlight.title')}</p>
          <p className="po-motivation__body">{t('progress.highlight.body')}</p>
        </div>
      </Card>

      <div className="po-historyLink">
        <button type="button" className="po-historyLink__btn" onClick={() => (window.location.href = '/progress/history')}>
          <Icon name="history" size={18} />
          {t('progress.cta.viewHistory')}
        </button>
      </div>
    </div>
  );
};
