import React, { useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { TextInput } from '../../../shared/ui/TextInput';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { ProfileState, saveProfile, useProfileState } from '../profileStorage';

type SelectOption<T extends string> = { value: T; labelKey: string };

const goalOptions: SelectOption<ProfileState['moveGoal']>[] = [
  { value: 'condition', labelKey: 'profile.goal.condition' },
  { value: 'strength', labelKey: 'profile.goal.strength' },
  { value: 'balance', labelKey: 'profile.goal.balance' },
  { value: 'social', labelKey: 'profile.goal.social' },
];

const levelOptions: SelectOption<ProfileState['fitnessLevel']>[] = [
  { value: 'starter', labelKey: 'profile.level.starter' },
  { value: 'intermediate', labelKey: 'profile.level.intermediate' },
  { value: 'advanced', labelKey: 'profile.level.advanced' },
];

const focusOptions: SelectOption<ProfileState['focusPreference']>[] = [
  { value: 'balance_strength', labelKey: 'profile.focus.balanceStrength' },
  { value: 'endurance', labelKey: 'profile.focus.endurance' },
  { value: 'mobility', labelKey: 'profile.focus.mobility' },
  { value: 'overall', labelKey: 'profile.focus.overall' },
];

export const ProfileEditScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const profile = useProfileState();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [moveGoal, setMoveGoal] = useState<ProfileState['moveGoal']>(profile.moveGoal);
  const [focusPreference, setFocusPreference] = useState<ProfileState['focusPreference']>(profile.focusPreference);

  const handleSave = () => {
    saveProfile({
      displayName: displayName.trim(),
      moveGoal,
      focusPreference,
    });
    goTo('/profile');
  };

  const handleCancel = () => {
    goTo('/profile');
  };

  return (
    <div className="profile-page">
      <SectionHeader
        as="h1"
        className="page-title"
        title={t('profile.edit.title')}
        subtitle={t('profile.edit.subtitle')}
      />

      <form
        className="profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
      >
        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon profile-icon--sage">
              <Icon name="person" size={24} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.name.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.name.subtitle')}</p>
            </div>
          </div>
          <div className="profile-field-label">{t('profile.edit.name.label')}</div>
          <TextInput
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t('profile.displayName.placeholder')}
            aria-label={t('profile.edit.name.label')}
          />
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon profile-icon--amber">
              <Icon name="flag" size={22} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.goal.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.goal.subtitle')}</p>
            </div>
          </div>
          <select className="profile-select" value={moveGoal} onChange={(e) => setMoveGoal(e.target.value as ProfileState['moveGoal'])}>
            {goalOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon profile-icon--indigo">
              <Icon name="insights" size={22} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.focus.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.focus.subtitle')}</p>
            </div>
          </div>
          <select className="profile-select" value={focusPreference} onChange={(e) => setFocusPreference(e.target.value as ProfileState['focusPreference'])}>
            {focusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon profile-icon--mint">
              <Icon name="fitness_center" size={22} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.level.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.level.subtitle')}</p>
            </div>
          </div>
          <div className="profile-section__subtitle">{t(levelOptions.find((option) => option.value === profile.fitnessLevel)?.labelKey || levelOptions[0].labelKey)}</div>
          <div className="profile-section__subtitle">{t('profile.edit.level.hint')}</div>
        </Card>

        <div className="profile-actions">
          <Button type="submit" variant="primary">
            <Icon name="save" />
            {t('profile.actions.save')}
          </Button>
          <Button type="button" variant="ghost" className="profile-actions__secondary" onClick={handleCancel}>
            {t('profile.actions.cancel')}
          </Button>
        </div>
      </form>

      <p className="profile-footer">{t('profile.version')}</p>
    </div>
  );
};
