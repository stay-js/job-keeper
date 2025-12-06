import type { UserPreferences } from '~/contexts/user-preferences-context';

export function getCurrencyFormatter(userPreferences: UserPreferences) {
  return new Intl.NumberFormat(userPreferences.locale, {
    style: 'currency',
    currency: userPreferences.currency,
    useGrouping: true,
    maximumFractionDigits: userPreferences.precision,
  });
}

export function getHourFormatter(locale: string) {
  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    maximumFractionDigits: 1,
  });
}

export function getFormatters(userPreferences: UserPreferences) {
  return {
    currency: getCurrencyFormatter(userPreferences),
    hours: getHourFormatter(userPreferences.locale),
  };
}
