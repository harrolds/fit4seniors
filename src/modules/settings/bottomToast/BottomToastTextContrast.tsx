import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { getDefaultPreferences, saveSettings, useSettingsState } from '../settingsStorage';

type Props = {
  onClose: () => void;
};

const scaleOrder: Array<'small' | 'default' | 'large'> = ['small', 'default', 'large'];
const scalePreview: Record<(typeof scaleOrder)[number], number> = {
  small: 0.95,
  default: 1,
  large: 1.12,
};

export const BottomToastTextContrast: React.FC<Props> = ({ onClose }) => {
  const { t } = useI18n();
  const prefs = useSettingsState();
  const [textScale, setTextScale] = useState<(typeof scaleOrder)[number]>(prefs.textScale);
  const [highContrast, setHighContrast] = useState<boolean>(prefs.highContrast);

  useEffect(() => {
    setTextScale(prefs.textScale);
    setHighContrast(prefs.highContrast);
  }, [prefs.highContrast, prefs.textScale]);

  const previewStyle = useMemo(
    () => ({
      transform: `scale(${scalePreview[textScale]})`,
    }),
    [textScale],
  );

  const handleReset = () => {
    const defaults = getDefaultPreferences();
    setTextScale(defaults.textScale);
    setHighContrast(defaults.highContrast);
  };

  const handleApply = () => {
    saveSettings({ textScale, highContrast });
    onClose();
  };

  const handleCancel = () => {
    setTextScale(prefs.textScale);
    setHighContrast(prefs.highContrast);
    onClose();
  };

  return (
    <div className="settings-bottom-toast">
      <div className="settings-bottom-toast__header">
        <div>
          <p className="settings-bottom-toast__eyebrow">{t('settings.bottomToast.text.eyebrow')}</p>
          <h2 className="settings-bottom-toast__title">{t('settings.bottomToast.text.title')}</h2>
        </div>
        <button type="button" className="settings-bottom-toast__reset" onClick={handleReset}>
          {t('settings.bottomToast.actions.reset')}
        </button>
      </div>

      <div className="settings-bottom-toast__body">
        <section className="settings-bottom-toast__section">
          <div className="settings-bottom-toast__section-head">
            <h3>{t('settings.bottomToast.text.section.textSize')}</h3>
            <span className="settings-bottom-toast__pill">
              {t(`settings.values.textScale.${textScale}`)}
            </span>
          </div>

          <div className="settings-bottom-toast__card">
            <p className="settings-bottom-toast__preview" style={previewStyle}>
              {t('settings.bottomToast.text.preview')}
            </p>
            <div className="settings-bottom-toast__slider">
              <Icon name="text_fields" size={20} className="settings-bottom-toast__slider-icon" />
              <input
                type="range"
                min={0}
                max={scaleOrder.length - 1}
                step={1}
                value={scaleOrder.indexOf(textScale)}
                onChange={(event) => {
                  const index = Number(event.target.value);
                  const next = scaleOrder[index] ?? 'default';
                  setTextScale(next);
                }}
              />
              <Icon name="text_fields" size={26} className="settings-bottom-toast__slider-icon settings-bottom-toast__slider-icon--large" />
            </div>
            <div className="settings-bottom-toast__chip-row">
              {scaleOrder.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  className={`settings-bottom-toast__chip ${textScale === scale ? 'is-active' : ''}`}
                  onClick={() => setTextScale(scale)}
                >
                  {t(`settings.values.textScale.${scale}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="settings-bottom-toast__section">
          <div className="settings-bottom-toast__section-head">
            <h3>{t('settings.bottomToast.text.section.contrast')}</h3>
          </div>
          <div className="settings-bottom-toast__option-grid">
            <button
              type="button"
              className={`settings-bottom-toast__option ${!highContrast ? 'is-active' : ''}`}
              onClick={() => setHighContrast(false)}
            >
              <div className="settings-bottom-toast__option-icon settings-bottom-toast__option-icon--muted">
                <Icon name="brightness_5" size={24} />
              </div>
              <div className="settings-bottom-toast__option-copy">
                <span>{t('settings.bottomToast.text.contrast.standard.title')}</span>
                <small>{t('settings.bottomToast.text.contrast.standard.body')}</small>
              </div>
              {!highContrast && <Icon name="check" size={18} className="settings-bottom-toast__check" />}
            </button>
            <button
              type="button"
              className={`settings-bottom-toast__option ${highContrast ? 'is-active' : ''}`}
              onClick={() => setHighContrast(true)}
            >
              <div className="settings-bottom-toast__option-icon settings-bottom-toast__option-icon--accent">
                <Icon name="contrast" size={22} />
              </div>
              <div className="settings-bottom-toast__option-copy">
                <span>{t('settings.bottomToast.text.contrast.high.title')}</span>
                <small>{t('settings.bottomToast.text.contrast.high.body')}</small>
              </div>
              {highContrast && <Icon name="check" size={18} className="settings-bottom-toast__check" />}
            </button>
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

