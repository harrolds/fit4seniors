import React, { useEffect, useState } from 'react';
import { Icon } from '../../../shared/ui/Icon';
import { useI18n } from '../../../shared/lib/i18n';
import { getDefaultPreferences, saveSettings, useSettingsState } from '../settingsStorage';

type Props = {
  onClose: () => void;
};

type LanguageOption = {
  value: 'de' | 'en';
  flag: string;
  titleKey: string;
  subtitleKey: string;
};

const languageOptions: LanguageOption[] = [
  { value: 'de', flag: '🇩🇪', titleKey: 'settings.bottomToast.language.de.title', subtitleKey: 'settings.bottomToast.language.de.subtitle' },
  { value: 'en', flag: '🇬🇧', titleKey: 'settings.bottomToast.language.en.title', subtitleKey: 'settings.bottomToast.language.en.subtitle' },
];

export const BottomToastSprache: React.FC<Props> = ({ onClose }) => {
  const { t, setPreference } = useI18n();
  const prefs = useSettingsState();
  const [language, setLanguage] = useState<'de' | 'en'>(prefs.language);

  useEffect(() => {
    setLanguage(prefs.language);
  }, [prefs.language]);

  const handleReset = () => {
    const defaults = getDefaultPreferences();
    setLanguage(defaults.language);
  };

  const handleApply = () => {
    saveSettings({ language });
    setPreference(language);
    onClose();
  };

  const handleCancel = () => {
    setLanguage(prefs.language);
    onClose();
  };

  return (
    <div className="settings-bottom-toast">
      <div className="settings-bottom-toast__header">
        <div>
          <p className="settings-bottom-toast__eyebrow">{t('settings.bottomToast.language.eyebrow')}</p>
          <h2 className="settings-bottom-toast__title">{t('settings.bottomToast.language.title')}</h2>
        </div>
        <button type="button" className="settings-bottom-toast__reset" onClick={handleReset}>
          {t('settings.bottomToast.actions.reset')}
        </button>
      </div>

      <div className="settings-bottom-toast__body">
        <section className="settings-bottom-toast__section">
          <div className="settings-bottom-toast__section-head">
            <h3>{t('settings.bottomToast.language.section.title')}</h3>
          </div>
          <div className="settings-bottom-toast__radio-grid">
            {languageOptions.map((option) => (
              <label
                key={option.value}
                className={`settings-bottom-toast__radio ${language === option.value ? 'is-active' : ''}`}
              >
                <div className="settings-bottom-toast__radio-flag" aria-hidden="true">
                  {option.flag}
                </div>
                <div className="settings-bottom-toast__radio-copy">
                  <span>{t(option.titleKey)}</span>
                  <small>{t(option.subtitleKey)}</small>
                </div>
                <input
                  type="radio"
                  name="settings-language"
                  value={option.value}
                  checked={language === option.value}
                  onChange={() => setLanguage(option.value)}
                  aria-label={t(option.titleKey)}
                />
                {language === option.value ? (
                  <Icon name="radio_button_checked" size={20} className="settings-bottom-toast__radio-icon" />
                ) : (
                  <Icon name="radio_button_unchecked" size={20} className="settings-bottom-toast__radio-icon" />
                )}
              </label>
            ))}
          </div>
        </section>

        <div className="settings-bottom-toast__info">
          <Icon name="info" size={18} />
          <p>{t('settings.bottomToast.language.hint')}</p>
        </div>
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

