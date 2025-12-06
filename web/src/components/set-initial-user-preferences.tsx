'use client';

import { useState } from 'react';

import { UserPreferencesDialog } from './user-preferences-dialog';

export function SetInitialUserPreferences() {
  const [isOpen, setIsOpen] = useState(true);

  return <UserPreferencesDialog isOpen={isOpen} setIsOpen={setIsOpen} type="initial" />;
}
