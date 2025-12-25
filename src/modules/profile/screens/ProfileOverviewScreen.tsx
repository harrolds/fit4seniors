import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { Button } from '../../../shared/ui/Button';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { useProfileState } from '../profileStorage';
import { getLevelFromPoints, getProfile as getMotorProfile } from '../../../app/services/profileMotor';
import { PROGRESS_STORAGE_EVENT_KEY, getCompletedSessions } from '../../progress/progressStorage';

const focusLabels: Record<string, string> = {
  cardio: 'profile.focus.options.cardio',
  strength: 'profile.focus.options.strength',
  balance: 'profile.focus.options.balance',
  brain: 'profile.focus.options.brain',
};

const coercePoints = (value: unknown): number => {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.round(numeric));
};

const isoWeekKey = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-${weekNum}`;
};

export const ProfileOverviewScreen: React.FC = () => {
  const { t, locale } = useI18n();
  const { goTo } = useNavigation();
  const profile = useProfileState();
  const motorProfile = getMotorProfile();

  const [completedSessions, setCompletedSessions] = useState(getCompletedSessions());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PROGRESS_STORAGE_EVENT_KEY) return;
      setCompletedSessions(getCompletedSessions());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setCompletedSessions(getCompletedSessions());
  }, []);

  const stats = useMemo(() => {
    const sessionCount = completedSessions.length;
    const totalSeconds = completedSessions.reduce((acc, session) => acc + (session.durationSecActual || 0), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const weeks = new Set<string>();
    completedSessions.forEach((session) => {
      if (!session.completedAt) return;
      weeks.add(isoWeekKey(new Date(session.completedAt)));
    });
    const totalPoints = completedSessions.reduce(
      (acc, session) => acc + coercePoints(session.pointsEarned ?? session.points),
      0,
    );
    return { sessionCount, minutes, weeksActive: sessionCount === 0 ? 0 : weeks.size, totalPoints };
  }, [completedSessions]);

  const levelInfo = useMemo(() => getLevelFromPoints(stats.totalPoints), [stats.totalPoints]);

  const displayName = profile.displayName.trim().length > 0 ? profile.displayName : t('profile.displayName.placeholder');
  const sessionsPerWeek = motorProfile.movementGoal.sessionsPerWeek ?? profile.sessionsPerWeek ?? 1;
  const preferredFocus = motorProfile.preferredFocus ?? profile.preferredFocus ?? 'cardio';

  const motorProfileHasUserData =
    motorProfile.totalPoints > 0 ||
    motorProfile.movementGoal.sessionsPerWeek !== 3 ||
    motorProfile.preferredFocus !== 'cardio';

  const createdAt =
    profile.localProfileCreatedAt ?? (motorProfileHasUserData ? motorProfile.localProfileCreatedAt : undefined);
  const formattedSince = useMemo(() => {
    if (!createdAt) return null;
    const parsed = Date.parse(createdAt);
    if (Number.isNaN(parsed)) return null;
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(parsed));
  }, [createdAt, locale]);

  return (
    <div className="profile-page">
      <SectionHeader as="h1" className="page-title" title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <Card className="profile-card">
        <div className="profile-avatar" aria-hidden>
          <div className="profile-avatar__circle">
            <Icon name="account_circle" size={64} />
          </div>
          <div className="profile-avatar__edit">
            <Icon name="edit" size={16} />
          </div>
        </div>
        <p className="profile-avatar__hint">{t('profile.avatar.hint')}</p>

        <div className="profile-card__identity">
          <h2 className="profile-card__title">{displayName}</h2>
          <p className="profile-card__metaTitle">{t('profile.member.localTitle')}</p>
          <p className="profile-card__meta">{t('profile.member.localStatus')}</p>
          {formattedSince ? <p className="profile-card__meta">{t('profile.member.since', { date: formattedSince })}</p> : null}
        </div>

        <div className="profile-card__divider" />

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__value">{stats.sessionCount}</span>
            <span className="profile-stat__label">{t('profile.stats.trainings')}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{stats.minutes}</span>
            <span className="profile-stat__label">{t('profile.stats.minutes')}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{stats.weeksActive}</span>
            <span className="profile-stat__label">{t('profile.stats.weeks')}</span>
          </div>
        </div>
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon profile-icon--goal">
            <Icon name="flag" size={28} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.sessionsPerWeek.title')}</h3>
            <p className="profile-tile__value">{sessionsPerWeek}</p>
            <p>{t('profile.sessionsPerWeek.helper')}</p>
          </div>
        </div>
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon profile-icon--focus">
            <Icon name="fitness_center" size={28} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.focus.title')}</h3>
            <p className="profile-tile__value">{t(focusLabels[preferredFocus])}</p>
            <p>{t('profile.focus.helper')}</p>
          </div>
        </div>
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon profile-icon--mint">
            <Icon name="insights" size={28} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.level.title')}</h3>
            <p className="profile-tile__value">{t(levelInfo.labelKey)}</p>
            <p>
              {`${t(levelInfo.descriptionKey)} ${
                levelInfo.pointsToNext !== null && levelInfo.nextLevelLabelKey
                  ? t('profile.level.progressToNextNamed', {
                      points: levelInfo.pointsToNext,
                      level: t(levelInfo.nextLevelLabelKey),
                    })
                  : t('profile.level.max')
              }`}
            </p>
          </div>
        </div>
      </Card>

      <Button type="button" variant="primary" className="profile-primary-cta" onClick={() => goTo('/profile/edit')}>
        <Icon name="edit_note" />
        {t('profile.actions.edit')}
      </Button>

      <p className="profile-footer">{t('profile.version')}</p>
    </div>
  );
};
