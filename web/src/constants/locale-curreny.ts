export const LOCALE_TO_CURRENCY = {
  'en-GB': 'GBP',
  'en-IE': 'EUR',
  'en-US': 'USD',
  'hu-HU': 'HUF',
  'pl-PL': 'PLN',
  'cz-CZ': 'CZK',
  'sk-SK': 'EUR',
  'sl-SI': 'EUR',
  'hr-HR': 'EUR',
  'ro-RO': 'RON',
  'bg-BG': 'BGN',
  'rs-RS': 'RSD',
  'sv-SE': 'SEK',
  'no-NO': 'NOK',
  'da-DK': 'DKK',
  'fi-FI': 'EUR',
  'is-IS': 'ISK',
  'de-DE': 'EUR',
  'nl-NL': 'EUR',
  'de-AT': 'EUR',
  'de-CH': 'CHF',
  'fr-FR': 'EUR',
  'es-ES': 'EUR',
  'it-IT': 'EUR',
  'pt-PT': 'EUR',
  'el-GR': 'EUR',
  'tr-TR': 'TRY',
  'ru-RU': 'RUB',
};

export const LOCALES = Object.keys(LOCALE_TO_CURRENCY);

export const CURRENCIES = Array.from(new Set(Object.values(LOCALE_TO_CURRENCY)));
