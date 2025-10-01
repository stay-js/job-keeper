import type { UserData } from '~/contexts/user-data-context';

export const getCurrencyFormatter = (userData: UserData) => {
  return new Intl.NumberFormat(userData.locale, {
    style: 'currency',
    currency: userData.currency,
    useGrouping: true,
    maximumFractionDigits: userData.precision,
  });
};

export const getHourFormatter = (locale: string) => {
  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    maximumFractionDigits: 1,
  });
};

export const getFormatters = (userData: UserData) => {
  return {
    currency: getCurrencyFormatter(userData),
    hours: getHourFormatter(userData.locale),
  };
};
