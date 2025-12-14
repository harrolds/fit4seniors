import React from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { Button } from '../../../shared/ui/Button';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { useProfileState } from '../profileStorage';

const fitnessLevelLabels: Record<string, string> = {
  starter: 'profile.level.starter',
  intermediate: 'profile.level.intermediate',
  advanced: 'profile.level.advanced',
};

const focusLabels: Record<string, string> = {
  balance_strength: 'profile.focus.balanceStrength',
  endurance: 'profile.focus.endurance',
  mobility: 'profile.focus.mobility',
  overall: 'profile.focus.overall',
};

const healthLabels: Record<string, string> = {
  heart_bp: 'profile.health.heartBp',
  mobility: 'profile.health.mobility',
  vitals: 'profile.health.vitals',
};

const accessibilitySummary = (t: (k: string) => string, flags: { largeText: boolean; highContrast: boolean; reduceMotion: boolean }): string => {
  const active: string[] = [];
  if (flags.largeText) active.push(t('profile.accessibility.largeText'));
  if (flags.highContrast) active.push(t('profile.accessibility.highContrast'));
  if (flags.reduceMotion) active.push(t('profile.accessibility.reduceMotion'));
  if (active.length === 0) return t('profile.accessibility.none');
  return active.join(' • ');
};

export const ProfileOverviewScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const profile = useProfileState();

  const displayName = profile.displayName.trim().length > 0 ? profile.displayName : t('profile.displayName.placeholder');
  const fitnessLabel = t(fitnessLevelLabels[profile.fitnessLevel]);
  const memberMeta = t('profile.member.meta', { year: profile.memberSinceYear || '—', level: fitnessLabel });

  const goalSummary = t('profile.goal.summary', {
    count: profile.weeklyGoalFrequency,
    minutes: profile.sessionDurationMinutes,
  });

  return (
    <div className="profile-page">
      <p className="profile-subtitle">{t('profile.subtitle')}</p>

      <Card className="profile-card">
        <div className="profile-avatar" aria-hidden>
          <div className="profile-avatar__circle">
            <Icon name="account_circle" size={64} />
          </div>
          <div className="profile-avatar__edit">
            <Icon name="edit" size={16} />
          </div>
        </div>

        <div>
          <h2 className="profile-card__title">{displayName}</h2>
          <p className="profile-card__meta">{memberMeta}</p>
        </div>

        <div className="profile-card__divider" />

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__value">{profile.trainingsCompleted}</span>
            <span className="profile-stat__label">{t('profile.stats.trainings')}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{profile.minutesSpent}</span>
            <span className="profile-stat__label">{t('profile.stats.minutes')}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">{profile.weeksActive}</span>
            <span className="profile-stat__label">{t('profile.stats.weeks')}</span>
          </div>
        </div>
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon" style={{ background: '#FCEBD9' }}>
            <Icon name="flag" size={28} style={{ color: '#9a3412' }} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.goal.title')}</h3>
            <p>{goalSummary}</p>
          </div>
        </div>
        <Icon name="chevron_right" style={{ color: '#9ca3af' }} />
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon" style={{ background: '#D9E8FC' }}>
            <Icon name="fitness_center" size={28} style={{ color: '#1d4ed8' }} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.focus.title')}</h3>
            <p>{t(focusLabels[profile.focusPreference])}</p>
          </div>
        </div>
        <Icon name="chevron_right" style={{ color: '#9ca3af' }} />
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon" style={{ background: '#E9E0D9' }}>
            <Icon name="favorite" size={28} style={{ color: '#b91c1c' }} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.health.title')}</h3>
            <p>{t(healthLabels[profile.healthFocus])}</p>
          </div>
        </div>
        <Icon name="chevron_right" style={{ color: '#9ca3af' }} />
      </Card>

      <Card className="profile-tile">
        <div className="profile-tile__left">
          <div className="profile-tile__icon" style={{ background: '#E0E9DE' }}>
            <Icon name="visibility" size={28} style={{ color: '#0f2e45' }} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.accessibility.title')}</h3>
            <p>{accessibilitySummary(t, profile.accessibility)}</p>
          </div>
        </div>
        <Icon name="chevron_right" style={{ color: '#9ca3af' }} />
      </Card>

      <Button type="button" variant="primary" className="profile-primary-cta" onClick={() => goTo('/profile/edit')}>
        <Icon name="edit_note" />
        {t('profile.actions.edit')}
      </Button>

      <p className="profile-footer">{t('profile.version')}</p>
    </div>
  );
};
