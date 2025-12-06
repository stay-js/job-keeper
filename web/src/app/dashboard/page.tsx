import { auth, currentUser } from '@clerk/nextjs/server';

import { api, HydrateClient } from '~/trpc/server';
import { SetInitialUserPreferences } from '~/components/set-initial-user-preferences';
import { UserPreferencesProvider } from '~/contexts/user-preferences-context';
import { createMetadata } from '~/lib/create-metadata';
import { DashboardTabs } from './dashboard-tabs';

export const metadata = createMetadata({
  path: '/dashboard',
  title: 'Dashboard',
  noIndex: true,
});

export default async function DashboardPage() {
  const authObject = await auth();
  const user = await currentUser();

  if (!user) return authObject.redirectToSignIn();

  const userPreferences = await api.userPreferences.get();

  const fallbackUserPreferences = {
    currency: 'EUR',
    locale: 'en',
    precision: 2,
  };

  void api.jobs.getAll.prefetch();
  void api.expenses.getAll.prefetch();
  void api.positions.getAll.prefetch();
  void api.positions.getAllWithHoursWorked.prefetch();

  return (
    <HydrateClient>
      <UserPreferencesProvider value={userPreferences ?? fallbackUserPreferences}>
        <main className="container py-6 md:py-24">
          <DashboardTabs />

          {!userPreferences && <SetInitialUserPreferences />}
        </main>
      </UserPreferencesProvider>
    </HydrateClient>
  );
}
