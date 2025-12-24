import React, { useEffect, useState } from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { getDefaultPreferences, saveSettings, useSettingsState } from '../settingsStorage';
import { playFeedback } from '../../../app/services/feedbackService';

type Props = {
  onClose: () => void;
};

export const BottomToastTonFeedback: React.FC<Props> = ({ onClose }) => {
  const { t } = useI18n();
  const prefs = useSettingsState();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(prefs.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(prefs.hapticsEnabled);
  const [volume, setVolume] = useState<number>(prefs.soundVolume);

  useEffect(() => {
    setSoundEnabled(prefs.soundEnabled);
    setHapticsEnabled(prefs.hapticsEnabled);
    setVolume(prefs.soundVolume);
  }, [prefs.soundEnabled, prefs.hapticsEnabled, prefs.soundVolume]);

  const preview = (next: { sound?: boolean; haptics?: boolean; volume?: number }) => {
    const nextPrefs = {
      soundEnabled: next.sound ?? soundEnabled,
      hapticsEnabled: next.haptics ?? hapticsEnabled,
      soundVolume: next.volume ?? volume,
    };
    playFeedback('notify', nextPrefs);
  };

  const handleReset = () => {
    const defaults = getDefaultPreferences();
    setSoundEnabled(defaults.soundEnabled);
    setHapticsEnabled(defaults.hapticsEnabled);
    setVolume(defaults.soundVolume);
    preview({ sound: defaults.soundEnabled, haptics: defaults.hapticsEnabled, volume: defaults.soundVolume });
  };

  const handleApply = () => {
    saveSettings({ soundEnabled, hapticsEnabled, soundVolume: volume });
    onClose();
  };

  const handleCancel = () => {
    setSoundEnabled(prefs.soundEnabled);
    setHapticsEnabled(prefs.hapticsEnabled);
    setVolume(prefs.soundVolume);
    onClose();
  };

  return (
    <div className="bottom-sheet settings-bottom-toast">
      <div className="bottom-sheet__header">
        <h2 className="bottom-sheet__title">{t('settings.bottomToast.sound.title')}</h2>
        <button type="button" className="bottom-sheet__reset" onClick={handleReset}>
          {t('settings.bottomToast.actions.reset')}
        </button>
      </div>

      <div className="bottom-sheet__body settings-bottom-toast__body">
        <section className="settings-bottom-toast__section">
          <div className="settings-bottom-toast__section-head">
            <h3>{t('settings.bottomToast.sound.section.volume')}</h3>
            <span className="settings-bottom-toast__pill">{`${volume}%`}</span>
          </div>
          <div className="settings-bottom-toast__card">
            <div className="settings-bottom-toast__slider settings-bottom-toast__slider--wide">
              <Icon name="volume_mute" size={20} className="settings-bottom-toast__slider-icon" />
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={volume}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setVolume(next);
                  preview({ volume: next });
                }}
                aria-label={t('settings.bottomToast.sound.section.volume')}
              />
              <Icon name="volume_up" size={24} className="settings-bottom-toast__slider-icon" />
            </div>
          </div>
        </section>

        <section className="settings-bottom-toast__section">
          <div className="settings-bottom-toast__section-head">
            <h3>{t('settings.bottomToast.sound.section.toggles')}</h3>
          </div>
          <div className="settings-bottom-toast__option-grid">
            <label className="settings-bottom-toast__toggle">
              <div className="settings-bottom-toast__option-icon settings-bottom-toast__option-icon--accent">
                <Icon name="volume_up" size={22} />
              </div>
              <div className="settings-bottom-toast__option-copy">
                <span>{t('settings.bottomToast.sound.sound.title')}</span>
                <small>{t('settings.bottomToast.sound.sound.body')}</small>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(event) => {
                  const next = event.target.checked;
                  setSoundEnabled(next);
                  if (next) {
                    preview({ sound: next });
                  }
                }}
                aria-label={t('settings.bottomToast.sound.sound.title')}
              />
              <span className={`settings-bottom-toast__switch ${soundEnabled ? 'is-on' : ''}`}>
                <span className="settings-bottom-toast__switch-handle" />
              </span>
            </label>

            <label className="settings-bottom-toast__toggle">
              <div className="settings-bottom-toast__option-icon settings-bottom-toast__option-icon--muted">
                <Icon name="vibration" size={20} />
              </div>
              <div className="settings-bottom-toast__option-copy">
                <span>{t('settings.bottomToast.sound.haptics.title')}</span>
                <small>{t('settings.bottomToast.sound.haptics.body')}</small>
              </div>
              <input
                type="checkbox"
                checked={hapticsEnabled}
                onChange={(event) => {
                  const next = event.target.checked;
                  setHapticsEnabled(next);
                  if (next) {
                    preview({ haptics: next });
                  }
                }}
                aria-label={t('settings.bottomToast.sound.haptics.title')}
              />
              <span className={`settings-bottom-toast__switch ${hapticsEnabled ? 'is-on' : ''}`}>
                <span className="settings-bottom-toast__switch-handle" />
              </span>
            </label>
          </div>
        </section>

        <section className="settings-bottom-toast__section">
          <button
            type="button"
            className="bottom-sheet__btn-secondary"
            onClick={() => preview({})}
            style={{ width: '100%' }}
          >
            <Icon name="play_circle" size={20} />
            {t('settings.bottomToast.sound.test')}
          </button>
        </section>
      </div>

      <div className="bottom-sheet__actions">
        <button type="button" className="bottom-sheet__btn-primary" onClick={handleApply}>
          <Icon name="check_circle" size={22} />
          {t('settings.bottomToast.actions.apply')}
        </button>
        <button type="button" className="bottom-sheet__btn-secondary" onClick={handleCancel}>
          {t('settings.bottomToast.actions.cancel')}
        </button>
      </div>
    </div>
  );
};


