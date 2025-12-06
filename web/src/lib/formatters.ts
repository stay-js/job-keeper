import type { UserPreferences } from '~/contexts/user-preferences-context';

export const getCurrencyFormatter = (userPreferences: UserPreferences) => {
  return new Intl.NumberFormat(userPreferences.locale, {
    style: 'currency',
    currency: userPreferences.currency,
    useGrouping: true,
    maximumFractionDigits: userPreferences.precision,
  });
};

export const getHourFormatter = (locale: string) => {
  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    maximumFractionDigits: 1,
  });
};

export const getFormatters = (userPreferences: UserPreferences) => {
  return {
    currency: getCurrencyFormatter(userPreferences),
    hours: getHourFormatter(userPreferences.locale),
  };
};
