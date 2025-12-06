'use client';

import { createContext, useContext } from 'react';

import type { RouterOutputs } from '~/trpc/react';

export type UserPreferences = Omit<NonNullable<RouterOutputs['userPreferences']['get']>, 'userId'>;

const UserPreferencesContext = createContext<UserPreferences | undefined>(undefined);

const fallbackUserPreferences = {
  currency: 'GBP',
  locale: 'en-GB',
  precision: 2,
};

export function UserPreferencesProvider({
  value,
  children,
}: {
  value?: UserPreferences;
  children: React.ReactNode;
}) {
  return (
    <UserPreferencesContext.Provider value={value ?? fallbackUserPreferences}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);

  if (!ctx) throw new Error('useUserPreferences must be used within a UserPreferencesProvider');

  return ctx;
}
