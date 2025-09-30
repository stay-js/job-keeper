import type { UserData } from '~/contexts/user-data-context';

export const currencyFormatter = (userData: UserData) => {
  return new Intl.NumberFormat(userData.locale, {
    style: 'currency',
    currency: userData.currency,
    useGrouping: true,
    maximumFractionDigits: userData.precision,
  });
};
