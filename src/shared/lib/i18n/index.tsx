import React, { createContext, useContext, useMemo, useState } from 'react';
import de from '../../../locales/de.json';
import en from '../../../locales/en.json';
import { getValue, setValue } from '../storage';

type Locale = 'de' | 'en';

type LanguagePreference = 'system' | Locale;

export type Messages = Record<string, string>;
export type TranslationParams = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  preference: LanguagePreference;
  t: (key: string, params?: TranslationParams) => string;
  setLocale: (locale: Locale) => void;
  setPreference: (preference: LanguagePreference) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const messagesByLocale: Record<Locale, Messages> = {
  de,
  en,
};

export const interpolateMessage = (template: string, params?: TranslationParams): string => {
  if (!params) return template;

  let result = template;
  for (const [key, value] of Object.entries(params)) {
    const stringValue = String(value);
    result = result.split(`{{${key}}}`).join(stringValue);
    result = result.split(`{${key}}`).join(stringValue);
  }

  return result;
};

export const createTranslator =
  (messages: Messages) =>
  (key: string, params?: TranslationParams): string => {
    const template = messages[key];
    if (!template) {
      return key;
    }

    return interpolateMessage(template, params);
  };

const LANGUAGE_PREFERENCE_STORAGE_KEY = 'language-preference';

const getInitialPreference = (): LanguagePreference => {
  const stored = getValue<LanguagePreference | null>(LANGUAGE_PREFERENCE_STORAGE_KEY, null);
  if (stored === 'system' || stored === 'de' || stored === 'en') {
    return stored;
  }
  return 'system';
};

const resolveEffectiveLocale = (preference: LanguagePreference): Locale => {
  if (preference === 'system') {
    if (typeof navigator !== 'undefined') {
      const languages = navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language];
      for (const lang of languages) {
        if (!lang) continue;
        const code = lang.toLowerCase().slice(0, 2) as Locale | string;
        if (code === 'de' || code === 'en') {
          return code;
        }
      }
    }
    return 'de';
  }
  return preference;
};

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [preference, setPreferenceState] = useState<LanguagePreference>(getInitialPreference);
  const locale = useMemo(() => resolveEffectiveLocale(preference), [preference]);

  const value = useMemo<I18nContextValue>(() => {
    const messages = messagesByLocale[locale] ?? messagesByLocale.de;

    const t = createTranslator(messages);

    const setPreference = (next: LanguagePreference): void => {
      setPreferenceState(next);
      setValue<LanguagePreference>(LANGUAGE_PREFERENCE_STORAGE_KEY, next);
    };

    const setLocale = (nextLocale: Locale): void => {
      setPreference(nextLocale);
    };

    return {
      locale,
      preference,
      t,
      setLocale,
      setPreference,
    };
  }, [locale, preference]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const { t } = useI18n();
  return { t };
};
