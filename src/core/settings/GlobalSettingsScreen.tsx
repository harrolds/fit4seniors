import React, { useState } from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useI18n } from '../../shared/lib/i18n';
import { useNavigation } from '../../shared/lib/navigation/useNavigation';
import { useThemeController } from '../theme/themeContext';
import { isTelemetryEnabled, setTelemetryEnabled as setTelemetryEnabledFlag, } from '../../shared/lib/telemetry';

export const GlobalSettingsScreen: React.FC = () => {
  const { goBack } = useNavigation();
  const {
    t,
    preference: languagePreference,
    setPreference: setLanguagePreference,
  } = useI18n();
  const {
    preference: themePreference,
    resolvedMode,
    setPreference: setThemePreference,
  } = useThemeController();
  const [telemetryEnabled, setTelemetryEnabled] = useState<boolean>(
    isTelemetryEnabled(),
  );

  const themeOptions: Array<{ value: 'system' | 'light' | 'dark'; label: string }> = [
    { value: 'system', label: t('settings.theme.system') },
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
  ];

  return (
    <>
      <Card>
        <div className="settings-section">
          <div>
            <h2 className="settings-layout__title">{t('settings.title')}</h2>
            <p className="settings-layout__description">
              {t('settings.global.description')}
            </p>
          </div>
          <div className="settings-actions">
            <Button type="button" variant="secondary" onClick={goBack}>
              {t('settings.back')}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="settings-section">
          <div className="settings-field">
            <h3 className="settings-layout__section-title">
              {t('settings.theme.title')}
            </h3>
            <p className="settings-layout__description">
              {t('settings.theme.description')}
            </p>
          </div>

          <div
            className="settings-field"
            role="radiogroup"
            aria-label={t('settings.theme.title')}
          >
            {themeOptions.map((option) => (
              <label key={option.value} className="settings-radio">
                <input
                  type="radio"
                  name="themePreference"
                  value={option.value}
                  checked={themePreference === option.value}
                  onChange={() => setThemePreference(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <p className="settings-layout__muted">
            {`${t('settings.theme.active')}: ${
              resolvedMode === 'dark' ? t('settings.theme.dark') : t('settings.theme.light')
            }`}
          </p>
        </div>
      </Card>

      <Card>
        <div className="settings-section">
          <div className="settings-field">
            <h3 className="settings-layout__section-title">
              {t('settings.language.title')}
            </h3>
            <p className="settings-layout__description">
              {t('settings.language.description')}
            </p>
          </div>

          <div
            className="settings-field"
            role="radiogroup"
            aria-label={t('settings.language.title')}
          >
            <label className="settings-radio">
              <input
                type="radio"
                name="languagePreference"
                value="system"
                checked={languagePreference === 'system'}
                onChange={() => setLanguagePreference('system')}
              />
              <span>{t('settings.language.system')}</span>
            </label>
            <label className="settings-radio">
              <input
                type="radio"
                name="languagePreference"
                value="de"
                checked={languagePreference === 'de'}
                onChange={() => setLanguagePreference('de')}
              />
              <span>{t('settings.language.de')}</span>
            </label>
            <label className="settings-radio">
              <input
                type="radio"
                name="languagePreference"
                value="en"
                checked={languagePreference === 'en'}
                onChange={() => setLanguagePreference('en')}
              />
              <span>{t('settings.language.en')}</span>
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <section className="settings-section">
          <h2 className="settings-section__title">
            {t('settings.telemetry.title')}
          </h2>
          <p className="settings-section__description">
            {t('settings.telemetry.description')}
          </p>

          <div className="settings-section__row">
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={telemetryEnabled}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setTelemetryEnabled(enabled);
                  setTelemetryEnabledFlag(enabled);
                }}
              />
              <span>{t('settings.telemetry.toggleLabel')}</span>
            </label>
          </div>
        </section>
      </Card>
    </>
  );
};
