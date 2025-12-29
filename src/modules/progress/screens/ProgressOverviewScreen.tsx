import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { CompletedSessionRecord, PROGRESS_STORAGE_EVENT_KEY, loadCompletedSessions } from '../progressStorage';
import {
  BRAIN_SESSIONS_STORAGE_EVENT_KEY,
  type BrainSession,
  loadBrainSessions,
} from '../../../state/brainSessions';
import { getGoalStatus, getLevelFromPoints, useProfileMotorState } from '../../../app/services/profileMotor';

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
  const profile = useProfileMotorState();
  const [sessions, setSessions] = useState<CompletedSessionRecord[]>(() => loadCompletedSessions());
  const [brainSessions, setBrainSessions] = useState<BrainSession[]>(() => loadBrainSessions());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PROGRESS_STORAGE_EVENT_KEY) {
        setSessions(loadCompletedSessions());
      }
      if (event.key === BRAIN_SESSIONS_STORAGE_EVENT_KEY) {
        setBrainSessions(loadBrainSessions());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setSessions(loadCompletedSessions());
    setBrainSessions(loadBrainSessions());
  }, []);

  const weekdayFormatter = useMemo(() => createWeekdayFormatter(locale), [locale]);

  const startOfWeek = useMemo(() => getStartOfWeek(new Date()), []);
  const endOfWeek = useMemo(() => getEndOfWeek(startOfWeek), [startOfWeek]);

  const { activeDaysThisWeek, sessionsThisWeek } = useMemo(() => {
    const uniqueDays = new Set<string>();
    let weeklySessions = 0;
    sessions.forEach((session) => {
      const date = new Date(session.completedAt);
      if (date >= startOfWeek && date <= endOfWeek) {
        weeklySessions += 1;
        uniqueDays.add(date.toDateString());
      }
    });
    return { activeDaysThisWeek: uniqueDays.size, sessionsThisWeek: weeklySessions };
  }, [sessions, startOfWeek, endOfWeek]);

  const weeklyBrainSessions = useMemo(() => {
    return brainSessions.filter((session) => {
      if (!session.completed) return false;
      const date = new Date(session.timestamp);
      return date >= startOfWeek && date <= endOfWeek;
    }).length;
  }, [brainSessions, endOfWeek, startOfWeek]);

  const goalStatus = useMemo(() => getGoalStatus(sessions, profile), [sessions, profile]);
  const goalStatusLabel = useMemo(() => {
    if (goalStatus.status === 'onTrack') return t('profileMotor.onTrack');
    if (goalStatus.status === 'near') return t('profileMotor.almostThere');
    return t('profileMotor.sessionsLeft', { n: goalStatus.remainingSessions });
  }, [goalStatus.remainingSessions, goalStatus.status, t]);

  const activeMinutesThisWeek = useMemo(() => {
    const totalSeconds = sessions.reduce((acc, session) => {
      const date = new Date(session.completedAt);
      if (date >= startOfWeek && date <= endOfWeek) {
        return acc + (session.durationSecActual || 0);
      }
      return acc;
    }, 0);
    return Math.round(totalSeconds / 60);
  }, [endOfWeek, sessions, startOfWeek]);

  const levelInfo = useMemo(() => getLevelFromPoints(profile.totalPoints ?? 0), [profile.totalPoints]);
  const levelLabel = t(levelInfo.labelKey);
  const levelProgressText =
    levelInfo.pointsToNext === null || !levelInfo.nextLevelLabelKey
      ? null
      : t('completion.levelProgress', { n: levelInfo.pointsToNext, next: t(levelInfo.nextLevelLabelKey) });

  const minutesPerWeekTarget = profile.movementGoal.minutesPerWeekTarget;
  const remainingMinutesToGoal =
    minutesPerWeekTarget !== undefined ? Math.max(minutesPerWeekTarget - activeMinutesThisWeek, 0) : null;

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
      <SectionHeader as="h1" className="page-title" title={t('pageTitles.progress')} subtitle={t('progress.subtitle')} />

      <Card className="po-goalCard" variant="elevated">
        <div className="po-goalCard__row">
          <div>
            <p className="po-goalCard__eyebrow">{t('profileMotor.weeklyGoal')}</p>
            <p className="po-goalCard__value">
              {goalStatus.weekSessions} / {goalStatus.goalSessions}
            </p>
          </div>
          <div className="po-goalCard__status">{goalStatusLabel}</div>
        </div>
      </Card>

      <Card className="po-goalCard" variant="elevated">
        <div className="po-goalCard__row">
          <div>
            <p className="po-goalCard__eyebrow">{t('progress.levelLabel')}</p>
            <p className="po-goalCard__value">{levelLabel}</p>
          </div>
        </div>
        {levelProgressText ? <p className="po-goalCard__status">{levelProgressText}</p> : null}
      </Card>

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
              <p className="po-kpiCard__label">{t('progress.activeMinutesThisWeek')}</p>
              <p className="po-kpiCard__value">{activeMinutesThisWeek}</p>
            </div>
          </div>
          {minutesPerWeekTarget !== undefined ? (
            <span className="po-kpiCard__badge po-kpiCard__badge--blue">
              {t('progress.minutesTargetLabel')}: {activeMinutesThisWeek} / {minutesPerWeekTarget}
            </span>
          ) : null}
        </Card>
        {minutesPerWeekTarget !== undefined && remainingMinutesToGoal !== null && remainingMinutesToGoal > 0 ? (
          <p className="po-helper">{t('progress.minutesToGoal', { n: remainingMinutesToGoal })}</p>
        ) : null}

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
