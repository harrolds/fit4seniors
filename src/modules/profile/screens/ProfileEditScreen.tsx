import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../shared/lib/i18n';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { TextInput } from '../../../shared/ui/TextInput';
import { useNavigation } from '../../../shared/lib/navigation/useNavigation';
import { saveProfile, useProfileState } from '../profileStorage';
import { PreferredFocus, getLevelFromPoints, getProfile, setMovementGoal, setPreferredFocus } from '../../../app/services/profileMotor';
import { useUserSession } from '../../../core/user/userStore';
import { useNotifications } from '../../../shared/lib/notifications';

type FocusOption = { value: PreferredFocus; labelKey: string };

const focusOptions: FocusOption[] = [
  { value: 'cardio', labelKey: 'profile.focus.options.cardio' },
  { value: 'strength', labelKey: 'profile.focus.options.strength' },
  { value: 'balance', labelKey: 'profile.focus.options.balance' },
  { value: 'brain', labelKey: 'profile.focus.options.brain' },
];

const clampSessions = (value: number): number => Math.min(7, Math.max(1, Math.round(value || 0))) || 1;
const clampMinutesTarget = (value: number | undefined): number | undefined => {
  if (!Number.isFinite(value ?? NaN)) return undefined;
  const rounded = Math.round((value as number) / 10) * 10;
  if (rounded < 10) return undefined;
  return Math.min(600, rounded);
};

export const ProfileEditScreen: React.FC = () => {
  const { t } = useI18n();
  const { goTo } = useNavigation();
  const navigate = useNavigate();
  const profile = useProfileState();
  const motorProfile = getProfile();
  const session = useUserSession();
  const { showToast } = useNotifications();

  const initialSessions = clampSessions(motorProfile.movementGoal.sessionsPerWeek ?? profile.sessionsPerWeek ?? 3);
  const initialMinutesTarget = motorProfile.movementGoal.minutesPerWeekTarget;
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [sessionsPerWeekInput, setSessionsPerWeekInput] = useState<string>(String(initialSessions));
  const [minutesPerWeekTargetInput, setMinutesPerWeekTargetInput] = useState<string>(
    initialMinutesTarget !== undefined ? String(initialMinutesTarget) : '',
  );
  const [preferredFocus, setPreferredFocusState] = useState<PreferredFocus>(
    motorProfile.preferredFocus ?? profile.preferredFocus ?? 'cardio',
  );

  const levelInfo = useMemo(() => getLevelFromPoints(motorProfile.totalPoints ?? 0), [motorProfile.totalPoints]);

  const resolvedSessionsPerWeek = sessionsPerWeekInput === '' ? initialSessions : clampSessions(Number(sessionsPerWeekInput));
  const resolvedMinutesPerWeekTarget =
    minutesPerWeekTargetInput === '' ? undefined : clampMinutesTarget(Number(minutesPerWeekTargetInput));

  const handleSessionsChange = (nextValue: string) => {
    if (nextValue === '' || /^[1-7]$/.test(nextValue)) {
      setSessionsPerWeekInput(nextValue);
    }
  };

  const handleSessionsBlur = () => {
    setSessionsPerWeekInput(String(resolvedSessionsPerWeek));
  };

  const handleMinutesTargetChange = (nextValue: string) => {
    if (nextValue === '' || /^\d{1,3}$/.test(nextValue)) {
      setMinutesPerWeekTargetInput(nextValue);
    }
  };

  const handleMinutesTargetBlur = () => {
    if (resolvedMinutesPerWeekTarget === undefined) {
      setMinutesPerWeekTargetInput('');
      return;
    }
    setMinutesPerWeekTargetInput(String(resolvedMinutesPerWeekTarget));
  };

  const adjustSessions = (delta: number) => {
    const current = sessionsPerWeekInput === '' ? resolvedSessionsPerWeek : clampSessions(Number(sessionsPerWeekInput));
    const next = clampSessions(current + delta);
    setSessionsPerWeekInput(String(next));
  };

  const handleSave = () => {
    const sessionsPerWeek = resolvedSessionsPerWeek;
    saveProfile({
      displayName: displayName.trim(),
      sessionsPerWeek,
      preferredFocus,
    });
    setMovementGoal({ sessionsPerWeek, minutesPerWeekTarget: resolvedMinutesPerWeekTarget });
    setPreferredFocus(preferredFocus);
    goTo('/profile');
  };

  const handleCancel = () => {
    goTo('/profile');
  };

  useEffect(() => {
    if (session.auth.status === 'anonymous') {
      showToast('profile.edit.requiresLogin', { kind: 'info' });
      navigate('/login', { replace: true });
    }
  }, [navigate, session.auth.status, showToast]);

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
              <h2 className="profile-section__title">{t('profile.edit.sessions.title')}</h2>
              <p className="profile-section__subtitle">{t('profile.edit.sessions.subtitle')}</p>
            </div>
          </div>
          <div className="profile-stepper" role="group" aria-label={t('profile.edit.sessions.label')}>
            <Button
              type="button"
              variant="ghost"
              className="profile-stepper__button"
              onClick={() => adjustSessions(-1)}
              aria-label={t('profile.edit.sessions.decrease')}
            >
              <Icon name="remove" />
            </Button>
            <input
              className="profile-stepper__input"
              inputMode="numeric"
              pattern="[1-7]"
              min={1}
              max={7}
              step={1}
              value={sessionsPerWeekInput}
              onChange={(event) => handleSessionsChange(event.target.value)}
              onBlur={handleSessionsBlur}
              aria-label={t('profile.edit.sessions.label')}
            />
            <Button
              type="button"
              variant="ghost"
              className="profile-stepper__button"
              onClick={() => adjustSessions(1)}
              aria-label={t('profile.edit.sessions.increase')}
            >
              <Icon name="add" />
            </Button>
          </div>
          <p className="profile-helper">{t('profile.edit.sessions.helper')}</p>
          <p className="profile-field-label">{t('profile.minutesTarget.label')}</p>
          <div className="profile-stepper" role="group" aria-label={t('profile.minutesTarget.label')}>
            <Button
              type="button"
              variant="ghost"
              className="profile-stepper__button"
              onClick={() => {
                const current = resolvedMinutesPerWeekTarget ?? 0;
                const next = clampMinutesTarget((current || 0) - 10);
                setMinutesPerWeekTargetInput(next !== undefined ? String(next) : '');
              }}
              aria-label={t('profile.minutesTarget.label')}
            >
              <Icon name="remove" />
            </Button>
            <input
              className="profile-stepper__input"
              type="number"
              inputMode="numeric"
              min={10}
              max={600}
              step={10}
              value={minutesPerWeekTargetInput}
              onChange={(event) => handleMinutesTargetChange(event.target.value)}
              onBlur={handleMinutesTargetBlur}
              aria-label={t('profile.minutesTarget.label')}
              placeholder="—"
            />
            <Button
              type="button"
              variant="ghost"
              className="profile-stepper__button"
              onClick={() => {
                const next = clampMinutesTarget((resolvedMinutesPerWeekTarget ?? 0) + 10);
                setMinutesPerWeekTargetInput(next !== undefined ? String(next) : '');
              }}
              aria-label={t('profile.minutesTarget.label')}
            >
              <Icon name="add" />
            </Button>
          </div>
          <p className="profile-helper">{t('profile.minutesTarget.helper')}</p>
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
          <label className="profile-field-label" htmlFor="preferredFocus-select">
            {t('profile.edit.focus.title')}
          </label>
          <select
            id="preferredFocus-select"
            className="profile-select profile-select--full"
            value={preferredFocus}
            onChange={(event) => setPreferredFocusState(event.target.value as PreferredFocus)}
          >
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
          <div className="profile-level-pill">{t(levelInfo.labelKey)}</div>
          <p className="profile-helper">
            {`${t(levelInfo.descriptionKey)} ${
              levelInfo.pointsToNext !== null
                ? t('profile.level.progressToNext', { points: levelInfo.pointsToNext })
                : t('profile.level.max')
            }`}
          </p>
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
