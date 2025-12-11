import React, { createContext, useContext, useMemo, useState } from 'react';
import de from '../../../locales/de.json';
import en from '../../../locales/en.json';

type Locale = 'de' | 'en';

type LanguagePreference = 'system' | Locale;

type Messages = Record<string, string>;

interface I18nContextValue {
  locale: Locale;
  preference: LanguagePreference;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
  setPreference: (preference: LanguagePreference) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const messagesByLocale: Record<Locale, Messages> = {
  de,
  en,
};

const getInitialPreference = (): LanguagePreference => {
  return 'de';
};

const resolveEffectiveLocale = (preference: LanguagePreference): Locale => {
  if (preference === 'de' || preference === 'en') {
    return preference;
  }
  return 'de';
};

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [preference, setPreferenceState] = useState<LanguagePreference>(getInitialPreference);
  const locale = useMemo(() => resolveEffectiveLocale(preference), [preference]);

  const value = useMemo<I18nContextValue>(() => {
    const messages = messagesByLocale[locale] ?? messagesByLocale.de;

    const t = (key: string): string => {
      return messages[key] ?? key;
    };

    const setPreference = (next: LanguagePreference): void => {
      setPreferenceState(next);
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
