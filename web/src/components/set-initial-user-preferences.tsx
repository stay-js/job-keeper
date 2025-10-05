'use client';

import { useState } from 'react';
import { LocaleCurrencyDialog } from './locale-currency-dialog';

export const SetInitialUserPreferences = () => {
  const [isOpen, setIsOpen] = useState(true);

  return <LocaleCurrencyDialog isOpen={isOpen} setIsOpen={setIsOpen} type="initial" />;
};
