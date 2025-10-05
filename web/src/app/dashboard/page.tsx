import { api, HydrateClient } from '~/trpc/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { JobsTab } from './jobs-tab';
import { PositionsTab } from './positions-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { CustomUserButton } from '~/components/custom-user-button';
import { SetInitialUserPreferences } from '~/components/set-initial-user-preferences';
import { createMetadata } from '~/utils/create-metadata';
import { UserDataProvider } from '~/contexts/user-data-context';

export const metadata = createMetadata({
  path: '/dashboard',
  title: 'Dashboard',
  noIndex: true,
});

const Jobs: React.FC = async () => {
  const jobs = await api.job.getAll();
  const positions = await api.position.getAll();

  void api.job.getAll.prefetch();
  void api.position.getAll.prefetch();

  return <JobsTab jobs={jobs} positions={positions} />;
};

const Positions: React.FC = async () => {
  const data = await api.position.getAllWithHoursWorked();

  void api.job.getAll.prefetch();

  return <PositionsTab data={data} />;
};

const Page: React.FC = async () => {
  const authObject = await auth();
  const user = await currentUser();

  if (!user) return authObject.redirectToSignIn();

  const userData = await api.userData.getUserData();

  const fallbackUserData = {
    currency: 'EUR',
    locale: 'en',
    precision: 2,
  };

  return (
    <HydrateClient>
      <UserDataProvider value={userData ?? fallbackUserData}>
        <main className="p-6 text-white md:py-24">
          <Tabs defaultValue="jobs" className="mx-auto flex max-w-5xl flex-col gap-6">
            <TabsList className="h-fit w-full items-center p-2">
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>

              <div className="ms-auto flex">
                <CustomUserButton />
              </div>
            </TabsList>

            <TabsContent value="jobs">
              <Jobs />
            </TabsContent>
            <TabsContent value="positions">
              <Positions />
            </TabsContent>
          </Tabs>

          {!userData && <SetInitialUserPreferences />}
        </main>
      </UserDataProvider>
    </HydrateClient>
  );
};

export default Page;
