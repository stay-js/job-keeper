import { api, HydrateClient } from '~/trpc/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { JobsPage } from '~/app/jobs';
import { PositionsPage } from '~/app/positions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createMetadata } from '~/utils/create-metadata';

export const metadata = createMetadata({
  path: '/dashboard',
  title: 'Dashboard',
  noIndex: true,
});

const Jobs = async () => {
  const jobs = await api.job.getAll();
  const positions = await api.position.getAll();

  void api.job.getAll.prefetch();
  void api.position.getAll.prefetch();

  return <JobsPage jobs={jobs} positions={positions} />;
};

const Positions = async () => {
  const data = await api.position.getAllWithHoursWorked();

  void api.job.getAll.prefetch();

  return <PositionsPage data={data} />;
};

const Page: React.FC = async () => {
  const authObject = await auth();
  const user = await currentUser();

  if (!user) return authObject.redirectToSignIn();

  return (
    <HydrateClient>
      <main className="p-6 text-white md:py-24">
        <></>
        <Tabs defaultValue="jobs" className="mx-auto flex max-w-5xl flex-col gap-6">
          <TabsList className="h-fit w-full items-center p-2">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <div className="ms-auto flex">
              <UserButton />
            </div>
          </TabsList>

          <TabsContent value="jobs">
            <Jobs />
          </TabsContent>
          <TabsContent value="positions">
            <Positions />
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
};

export default Page;
