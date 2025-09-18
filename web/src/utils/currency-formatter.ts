export const currencyFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  useGrouping: true,
  maximumFractionDigits: 0,
});
