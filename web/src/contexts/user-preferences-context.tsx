'use client';

import { createContext, useContext } from 'react';

import type { RouterOutputs } from '~/trpc/react';

export type UserPreferences = Omit<NonNullable<RouterOutputs['userPreferences']['get']>, 'userId'>;

const UserPreferencesContext = createContext<UserPreferences | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{
  value: UserPreferences;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const ctx = useContext(UserPreferencesContext);

  if (!ctx) throw new Error('useUserPreferences must be used within a UserPreferencesProvider');

  return ctx;
};
