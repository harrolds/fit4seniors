import React from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { Button } from '../../../shared/ui/Button';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { useProfileState } from '../profileStorage';

const fitnessLevelLabels: Record<string, string> = {
  starter: 'profile.level.starter',
  intermediate: 'profile.level.intermediate',
  advanced: 'profile.level.advanced',
};

const goalLabels: Record<string, string> = {
  condition: 'profile.goal.condition',
  strength: 'profile.goal.strength',
  balance: 'profile.goal.balance',
  social: 'profile.goal.social',
};

const focusLabels: Record<string, string> = {
  balance_strength: 'profile.focus.balanceStrength',
  endurance: 'profile.focus.endurance',
  mobility: 'profile.focus.mobility',
  overall: 'profile.focus.overall',
};

export const ProfileOverviewScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const profile = useProfileState();

  const displayName = profile.displayName.trim().length > 0 ? profile.displayName : t('profile.displayName.placeholder');
  const fitnessLabel = t(fitnessLevelLabels[profile.fitnessLevel]);
  const memberMeta = t('profile.member.meta', { year: profile.memberSinceYear || '—', level: fitnessLabel });

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
          <div className="profile-tile__icon profile-icon--goal">
            <Icon name="flag" size={28} />
          </div>
          <div className="profile-tile__text">
            <h3>{t('profile.goal.title')}</h3>
            <p>{t(goalLabels[profile.moveGoal])}</p>
            <p>{t('profile.goal.hint')}</p>
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
            <p>{t(focusLabels[profile.focusPreference])}</p>
            <p>{t('profile.focus.hint')}</p>
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
            <p>{fitnessLabel}</p>
            <p>{t('profile.level.hint')}</p>
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
