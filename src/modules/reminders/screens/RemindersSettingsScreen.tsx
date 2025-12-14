import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/lib/i18n';
import { useNotifications } from '../../../shared/lib/notifications';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import {
  ReminderDay,
  ReminderSettings,
  ReminderTimeSlot,
  updateReminderSettings,
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

const createSlotId = (): string => `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeTime = (value: string): string => {
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  return '09:00';
};

export const RemindersSettingsScreen: React.FC = () => {
  const { t } = useI18n();
  const { showToast } = useNotifications();
  const { settings } = useRemindersState();

  const [timeSlots, setTimeSlots] = useState<ReminderTimeSlot[]>(settings.times);
  const [selectedDays, setSelectedDays] = useState<ReminderDay[]>(settings.days);
  const [allowDuringSilent, setAllowDuringSilent] = useState<boolean>(settings.allowDuringSilent);

  useEffect(() => {
    setTimeSlots(settings.times);
    setSelectedDays(settings.days);
    setAllowDuringSilent(settings.allowDuringSilent);
  }, [settings.allowDuringSilent, settings.days, settings.times]);

  const handleTimeChange = (id: string, value: string) => {
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, time: normalizeTime(value) } : slot)),
    );
  };

  const handleAddTime = () => {
    const fallbackLabelKey = 'reminders.defaults.additional';
    const nextTime = timeSlots[timeSlots.length - 1]?.time ?? '08:00';
    setTimeSlots((prev) => [
      ...prev,
      {
        id: createSlotId(),
        labelKey: fallbackLabelKey,
        time: nextTime,
      },
    ]);
  };

  const toggleDay = (day: ReminderDay) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        const next = prev.filter((d) => d !== day);
        return next.length > 0 ? next : prev;
      }
      return [...prev, day];
    });
  };

  const mergedSettings: ReminderSettings = useMemo(() => {
    return {
      ...settings,
      allowDuringSilent,
      days: selectedDays,
      times: timeSlots.map((slot) => {
        const persisted = settings.times.find((item) => item.id === slot.id && item.time === slot.time);
        return {
          ...slot,
          labelKey: slot.labelKey || 'reminders.defaults.morning',
          lastFiredAt: persisted?.lastFiredAt,
        };
      }),
      permissionPrompted: allowDuringSilent ? settings.permissionPrompted : false,
    };
  }, [allowDuringSilent, selectedDays, settings, timeSlots]);

  const handleSave = () => {
    updateReminderSettings(mergedSettings);
    showToast('reminders.toast.settingsSaved', { kind: 'success' });
  };

  return (
    <div className="reminders-page">
      <p className="reminders-intro">{t('reminders.intro')}</p>

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
            const isActive = selectedDays.includes(day);
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
                <span className="reminders-day__date">{t(labels.dateLabelKey)}</span>
              </button>
            );
          })}
        </div>

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
