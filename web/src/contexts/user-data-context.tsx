'use client';

import { createContext, useContext } from 'react';
import type { RouterOutputs } from '~/trpc/react';

export type UserData = Omit<NonNullable<RouterOutputs['userData']['getUserData']>, 'userId'>;

const UserDataContext = createContext<UserData | undefined>(undefined);

export const UserDataProvider: React.FC<{
  value: UserData;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);

  if (!ctx) throw new Error('useUserData must be used within a UserDataProvider');

  return ctx;
};
