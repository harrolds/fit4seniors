import React, { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { TextInput } from '../../../shared/ui/TextInput';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { ProfileState, saveProfile, useProfileState } from '../profileStorage';

type SelectOption<T extends string> = { value: T; labelKey: string };

const ageOptions: SelectOption<ProfileState['ageCategory']>[] = [
  { value: '60_65', labelKey: 'profile.age.60_65' },
  { value: '66_70', labelKey: 'profile.age.66_70' },
  { value: '71_75', labelKey: 'profile.age.71_75' },
  { value: '75_plus', labelKey: 'profile.age.75_plus' },
];

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

const healthOptions: SelectOption<ProfileState['healthFocus']>[] = [
  { value: 'heart_bp', labelKey: 'profile.health.heartBp' },
  { value: 'mobility', labelKey: 'profile.health.mobility' },
  { value: 'vitals', labelKey: 'profile.health.vitals' },
];

const genderOptions: SelectOption<ProfileState['gender']>[] = [
  { value: 'male', labelKey: 'profile.gender.male' },
  { value: 'female', labelKey: 'profile.gender.female' },
];

export const ProfileEditScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const profile = useProfileState();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [ageCategory, setAgeCategory] = useState<ProfileState['ageCategory']>(profile.ageCategory);
  const [moveGoal, setMoveGoal] = useState<ProfileState['moveGoal']>(profile.moveGoal);
  const [fitnessLevel, setFitnessLevel] = useState<ProfileState['fitnessLevel']>(profile.fitnessLevel);
  const [focusPreference, setFocusPreference] = useState<ProfileState['focusPreference']>(profile.focusPreference);
  const [healthFocus, setHealthFocus] = useState<ProfileState['healthFocus']>(profile.healthFocus);
  const [gender, setGender] = useState<ProfileState['gender']>(profile.gender);
  const [weeklyGoalFrequency] = useState<number>(profile.weeklyGoalFrequency);
  const [sessionDurationMinutes] = useState<number>(profile.sessionDurationMinutes);
  const [largeText, setLargeText] = useState<boolean>(profile.accessibility.largeText);
  const [highContrast, setHighContrast] = useState<boolean>(profile.accessibility.highContrast);
  const [reduceMotion, setReduceMotion] = useState<boolean>(profile.accessibility.reduceMotion);

  const handleSave = () => {
    saveProfile({
      displayName: displayName.trim(),
      ageCategory,
      moveGoal,
      fitnessLevel,
      focusPreference,
      healthFocus,
      gender,
      weeklyGoalFrequency,
      sessionDurationMinutes,
      accessibility: {
        largeText,
        highContrast,
        reduceMotion,
      },
    });
    goTo('/profile');
  };

  const handleCancel = () => {
    goTo('/profile');
  };

  const weeklyLabel = useMemo(
    () =>
      t('profile.goal.summary', {
        count: weeklyGoalFrequency,
        minutes: sessionDurationMinutes,
      }),
    [t, weeklyGoalFrequency, sessionDurationMinutes],
  );

  return (
    <div className="profile-page">
      <p className="profile-subtitle">{t('profile.edit.subtitle')}</p>

      <form
        className="profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
      >
        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon" style={{ background: '#E0E9DE' }}>
              <Icon name="person" size={24} style={{ color: '#0f2e45' }} />
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
            <div className="profile-section__icon" style={{ background: '#bfdbfe' }}>
              <Icon name="cake" size={22} style={{ color: '#1d4ed8' }} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.age.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.age.subtitle')}</p>
            </div>
          </div>
          <select className="profile-select" value={ageCategory} onChange={(e) => setAgeCategory(e.target.value as ProfileState['ageCategory'])}>
            {ageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon" style={{ background: '#fed7aa' }}>
              <Icon name="flag" size={22} style={{ color: '#c2410c' }} />
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
          <div className="profile-section__subtitle">{weeklyLabel}</div>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon" style={{ background: '#bbf7d0' }}>
              <Icon name="fitness_center" size={22} style={{ color: '#15803d' }} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.level.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.level.subtitle')}</p>
            </div>
          </div>
          <select className="profile-select" value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value as ProfileState['fitnessLevel'])}>
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon" style={{ background: '#e9d5ff' }}>
              <Icon name="wc" size={22} style={{ color: '#7e22ce' }} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.gender.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.gender.subtitle')}</p>
            </div>
          </div>
          <div className="profile-radio-group">
            {genderOptions.map((opt) => (
              <label key={opt.value} className="profile-radio">
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  checked={gender === opt.value}
                  onChange={() => setGender(opt.value)}
                />
                <span className="profile-radio__label">{t(opt.labelKey)}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon" style={{ background: '#c7d2fe' }}>
              <Icon name="insights" size={22} style={{ color: '#4338ca' }} />
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
            <div className="profile-section__icon" style={{ background: '#fecdd3' }}>
              <Icon name="favorite" size={22} style={{ color: '#be123c' }} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.health.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.health.subtitle')}</p>
            </div>
          </div>
          <select className="profile-select" value={healthFocus} onChange={(e) => setHealthFocus(e.target.value as ProfileState['healthFocus'])}>
            {healthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </Card>

        <Card className="profile-section">
          <div className="profile-section__header">
            <div className="profile-section__icon" style={{ background: '#fef3c7' }}>
              <Icon name="accessibility_new" size={22} style={{ color: '#92400e' }} />
            </div>
            <div>
              <h2 className="profile-section__title">{t('profile.edit.accessibility.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.accessibility.subtitle')}</p>
            </div>
          </div>

          <div className="profile-toggle">
            <div className="profile-toggle__meta">
              <p className="profile-toggle__title">{t('profile.accessibility.largeText')}</p>
              <p className="profile-toggle__subtitle">{t('profile.edit.accessibility.largeTextHint')}</p>
            </div>
            <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
          </div>

          <div className="profile-toggle">
            <div className="profile-toggle__meta">
              <p className="profile-toggle__title">{t('profile.accessibility.highContrast')}</p>
              <p className="profile-toggle__subtitle">{t('profile.edit.accessibility.highContrastHint')}</p>
            </div>
            <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
          </div>

          <div className="profile-toggle">
            <div className="profile-toggle__meta">
              <p className="profile-toggle__title">{t('profile.accessibility.reduceMotion')}</p>
              <p className="profile-toggle__subtitle">{t('profile.edit.accessibility.reduceMotionHint')}</p>
            </div>
            <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
          </div>
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
