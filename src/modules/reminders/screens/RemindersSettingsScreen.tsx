import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { useNotifications } from '../../../shared/lib/notifications';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import {
  ReminderDay,
  ReminderRule,
  getRemindersState,
  removeRule,
  setRemindersState,
  useRemindersState,
} from '../remindersStorage';

const dayOrder: ReminderDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const dayLabels: Record<
  ReminderDay,
  { labelKey: string; shortKey: string; dateLabelKey: string }
> = {
  mon: { labelKey: 'reminders.days.mon', shortKey: 'reminders.days.monShort', dateLabelKey: 'reminders.days.monDate' },
  tue: { labelKey: 'reminders.days.tue', shortKey: 'reminders.days.tueShort', dateLabelKey: 'reminders.days.tueDate' },
  wed: { labelKey: 'reminders.days.wed', shortKey: 'reminders.days.wedShort', dateLabelKey: 'reminders.days.wedDate' },
  thu: { labelKey: 'reminders.days.thu', shortKey: 'reminders.days.thuShort', dateLabelKey: 'reminders.days.thuDate' },
  fri: { labelKey: 'reminders.days.fri', shortKey: 'reminders.days.friShort', dateLabelKey: 'reminders.days.friDate' },
  sat: { labelKey: 'reminders.days.sat', shortKey: 'reminders.days.satShort', dateLabelKey: 'reminders.days.satDate' },
  sun: { labelKey: 'reminders.days.sun', shortKey: 'reminders.days.sunShort', dateLabelKey: 'reminders.days.sunDate' },
};

const dayIndexToKey = (index: number): ReminderDay => {
  const mapping: ReminderDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return mapping[index] ?? 'mon';
};

const dayKeyToIndex = (key: ReminderDay): number => {
  const mapping: ReminderDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const idx = mapping.indexOf(key);
  return idx === -1 ? 1 : idx;
};

const createRuleId = (): string => `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;

type FormTimeSlot = { id: string; time: string; labelKey: string };

const isValidTime = (value: string): boolean => /^\d{2}:\d{2}$/.test(value);

const formatEndDate = (value: string | null, formatter: (date: Date) => string, fallback: string): string => {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return formatter(parsed);
};

export const RemindersSettingsScreen: React.FC = () => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const remindersState = useRemindersState();

  const [timeSlots, setTimeSlots] = useState<FormTimeSlot[]>([
    { id: createRuleId(), time: '', labelKey: 'reminders.defaults.additional' },
  ]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [allowDuringSilent, setAllowDuringSilent] = useState<boolean>(remindersState.allowDuringSilent);
  const [weekly, setWeekly] = useState<boolean>(true);
  const [endDateEnabled, setEndDateEnabled] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    setAllowDuringSilent(remindersState.allowDuringSilent);
  }, [remindersState.allowDuringSilent]);

  const handleTimeChange = (id: string, value: string) => {
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, time: value } : slot)),
    );
  };

  const handleAddTime = () => {
    setTimeSlots((prev) => [
      ...prev,
      {
        id: createRuleId(),
        labelKey: 'reminders.defaults.additional',
        time: '',
      },
    ]);
  };

  const toggleDay = (day: ReminderDay) => {
    const dayIndex = dayKeyToIndex(day);
    setSelectedDays((prev) => {
      if (prev.includes(dayIndex)) {
        return prev.filter((d) => d !== dayIndex);
      }
      return [...prev, dayIndex];
    });
  };

  const resetForm = () => {
    setTimeSlots([{ id: createRuleId(), time: '', labelKey: 'reminders.defaults.additional' }]);
    setSelectedDays([]);
    setWeekly(true);
    setEndDateEnabled(false);
    setEndDate('');
  };

  const handleSave = () => {
    const validSlots = timeSlots.filter((slot) => isValidTime(slot.time));
    if (selectedDays.length === 0 || validSlots.length === 0) {
      showToast('validation.required', { kind: 'info' });
      return;
    }

    const snapshot = getRemindersState();
    const endDateValue = endDateEnabled && endDate ? endDate : null;
    const newRules: ReminderRule[] = validSlots.map((slot) => ({
      id: createRuleId(),
      days: selectedDays,
      time: slot.time,
      weekly,
      endDate: endDateValue,
      lastFiredAt: null,
    }));

    const updatedRules = [...snapshot.rules, ...newRules];
    setRemindersState({
      rules: updatedRules,
      allowDuringSilent,
      permissionPrompted: snapshot.permissionPrompted,
    });
    showToast('reminders.toast.saved', { kind: 'success' });
    resetForm();
  };

  return (
    <div className="reminders-page">
      <SectionHeader as="h1" className="page-title" title={t('pageTitles.reminders')} subtitle={t('reminders.intro')} />

      <Card className="reminders-card">
        <div className="reminders-card__header">
          <div className="reminders-card__icon reminders-card__icon--calendar">
            <Icon name="list" size={24} />
          </div>
          <div>
            <h2 className="reminders-card__title">{t('reminders.list.title')}</h2>
          </div>
        </div>

        <div className="reminders-card__body">
          {remindersState.rules.length === 0 ? (
            <p className="reminders-description">{t('reminders.list.empty')}</p>
          ) : (
            remindersState.rules.map((rule) => {
              const dayLabelsText = rule.days
                .map((dayIndex) => t(dayLabels[dayIndexToKey(dayIndex)].shortKey))
                .join(', ');
              const endDateText = formatEndDate(
                rule.endDate,
                (date) => date.toLocaleDateString(),
                t('reminders.endDate.none'),
              );
              return (
                <div key={rule.id} className="reminders-time">
                  <div className="reminders-time__label">
                    <div>{dayLabelsText || '-'}</div>
                    <div className="reminders-time__meta">
                      <span>{rule.time}</span>
                      <span>• {t('reminders.repeat.label')}: {t(rule.weekly ? 'reminders.repeat.yes' : 'reminders.repeat.no')}</span>
                      <span>• {t('reminders.endDate.label')}: {endDateText}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      removeRule(rule.id);
                      showToast('reminders.toast.removed', { kind: 'success' });
                    }}
                  >
                    {t('reminders.actions.removeRule')}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card className="reminders-card">
        <div className="reminders-card__header">
          <div className="reminders-card__icon reminders-card__icon--alert">
            <Icon name="schedule" size={24} />
          </div>
          <div>
            <h2 className="reminders-card__title">{t('reminders.sections.time.title')}</h2>
          </div>
        </div>

        <div className="reminders-card__body">
          {timeSlots.map((slot) => (
            <div key={slot.id} className="reminders-time">
              <span className="reminders-time__label">{t(slot.labelKey)}</span>
              <label className="reminders-time__input">
                <input
                  type="time"
                  value={slot.time}
                  onChange={(event) => handleTimeChange(slot.id, event.target.value)}
                  aria-label={t('reminders.sections.time.editLabel', { label: t(slot.labelKey) })}
                />
                <Icon name="edit" size={18} className="reminders-time__icon" />
              </label>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            className="reminders-add"
            onClick={handleAddTime}
            disabled={timeSlots.length >= 6}
          >
            <Icon name="add_circle" size={20} />
            {t('reminders.actions.addTime')}
          </Button>
        </div>
      </Card>

      <Card className="reminders-card">
        <div className="reminders-card__header">
          <div className="reminders-card__icon reminders-card__icon--calendar">
            <Icon name="calendar_today" size={24} />
          </div>
          <div>
            <h2 className="reminders-card__title">{t('reminders.sections.days.title')}</h2>
          </div>
        </div>

        <p className="reminders-description">{t('reminders.sections.days.subtitle')}</p>

        <div className="reminders-days">
          {dayOrder.map((day) => {
            const labels = dayLabels[day];
            const isActive = selectedDays.includes(dayKeyToIndex(day));
            return (
              <button
                key={day}
                type="button"
                className={`reminders-day${isActive ? ' reminders-day--active' : ''}`}
                onClick={() => toggleDay(day)}
                aria-pressed={isActive}
                aria-label={t(labels.labelKey)}
              >
                <span className="reminders-day__short">{t(labels.shortKey)}</span>
              </button>
            );
          })}
        </div>

        <div className="reminders-toggle">
          <input
            id="reminders-weekly-toggle"
            type="checkbox"
            checked={weekly}
            onChange={(event) => setWeekly(event.target.checked)}
          />
          <label htmlFor="reminders-weekly-toggle" className="reminders-toggle__label">
            <span className="reminders-toggle__switch" aria-hidden />
            <span className="reminders-toggle__text">{t('reminders.repeat.label')}</span>
            <span className="reminders-toggle__badge">{t(weekly ? 'reminders.repeat.yes' : 'reminders.repeat.no')}</span>
          </label>
        </div>

        <div className="reminders-toggle">
          <input
            id="reminders-enddate-toggle"
            type="checkbox"
            checked={endDateEnabled}
            onChange={(event) => setEndDateEnabled(event.target.checked)}
          />
          <label htmlFor="reminders-enddate-toggle" className="reminders-toggle__label">
            <span className="reminders-toggle__switch" aria-hidden />
            <span className="reminders-toggle__text">{t('reminders.endDate.enable')}</span>
          </label>
        </div>

        {endDateEnabled ? (
          <div className="reminders-time">
            <span className="reminders-time__label">{t('reminders.endDate.label')}</span>
            <label className="reminders-time__input">
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                aria-label={t('reminders.endDate.label')}
              />
              <Icon name="edit" size={18} className="reminders-time__icon" />
            </label>
          </div>
        ) : null}

        <div className="reminders-toggle">
          <input
            id="reminders-silent-toggle"
            type="checkbox"
            checked={allowDuringSilent}
            onChange={(event) => setAllowDuringSilent(event.target.checked)}
          />
          <label htmlFor="reminders-silent-toggle" className="reminders-toggle__label">
            <span className="reminders-toggle__switch" aria-hidden />
            <span className="reminders-toggle__text">{t('reminders.sections.days.silent')}</span>
          </label>
        </div>
      </Card>

      <div className="reminders-actions">
        <Button type="button" variant="primary" onClick={handleSave}>
          <Icon name="save" size={20} />
          {t('reminders.actions.save')}
        </Button>
      </div>
    </div>
  );
};
