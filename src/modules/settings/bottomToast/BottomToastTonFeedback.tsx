import React, { useEffect, useState } from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { getDefaultPreferences, saveSettings, useSettingsState } from '../settingsStorage';

type Props = {
  onClose: () => void;
};

export const BottomToastTonFeedback: React.FC<Props> = ({ onClose }) => {
  const { t } = useI18n();
  const prefs = useSettingsState();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(prefs.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(prefs.hapticsEnabled);
  const [volume, setVolume] = useState<number>(80);

  useEffect(() => {
    setSoundEnabled(prefs.soundEnabled);
    setHapticsEnabled(prefs.hapticsEnabled);
  }, [prefs.hapticsEnabled, prefs.soundEnabled]);

  const handleReset = () => {
    const defaults = getDefaultPreferences();
    setSoundEnabled(defaults.soundEnabled);
    setHapticsEnabled(defaults.hapticsEnabled);
    setVolume(80);
  };

  const handleApply = () => {
    saveSettings({ soundEnabled, hapticsEnabled });
    onClose();
  };

  const handleCancel = () => {
    setSoundEnabled(prefs.soundEnabled);
    setHapticsEnabled(prefs.hapticsEnabled);
    setVolume(80);
    onClose();
  };

  return (
    <div className="settings-bottom-toast">
      <div className="settings-bottom-toast__header">
        <div>
          <p className="settings-bottom-toast__eyebrow">{t('settings.bottomToast.sound.eyebrow')}</p>
          <h2 className="settings-bottom-toast__title">{t('settings.bottomToast.sound.title')}</h2>
        </div>
        <button type="button" className="settings-bottom-toast__reset" onClick={handleReset}>
          {t('settings.bottomToast.actions.reset')}
        </button>
      </div>

      <div className="settings-bottom-toast__body">
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
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label={t('settings.bottomToast.sound.section.volume')}
              />
              <Icon name="volume_up" size={24} className="settings-bottom-toast__slider-icon" />
            </div>
            <p className="settings-bottom-toast__hint">{t('settings.bottomToast.sound.volumeHint')}</p>
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
                onChange={(event) => setSoundEnabled(event.target.checked)}
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
                onChange={(event) => setHapticsEnabled(event.target.checked)}
                aria-label={t('settings.bottomToast.sound.haptics.title')}
              />
              <span className={`settings-bottom-toast__switch ${hapticsEnabled ? 'is-on' : ''}`}>
                <span className="settings-bottom-toast__switch-handle" />
              </span>
            </label>
          </div>
        </section>
      </div>

      <div className="settings-bottom-toast__actions">
        <button type="button" className="settings-bottom-toast__primary" onClick={handleApply}>
          <Icon name="check_circle" size={22} />
          {t('settings.bottomToast.actions.apply')}
        </button>
        <button type="button" className="settings-bottom-toast__ghost" onClick={handleCancel}>
          {t('settings.bottomToast.actions.cancel')}
        </button>
      </div>
    </div>
  );
};

