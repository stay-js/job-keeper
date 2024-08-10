import { api, HydrateClient } from '~/trpc/server';
import { JobsPage } from '~/app/jobs';
import { PositionsTable } from '~/components/positions-table';
import { PositionDialog } from '~/components/position-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

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

  return (
    <div className="flex flex-col gap-4">
      <PositionsTable data={data} />
      <PositionDialog />
    </div>
  );
};

const Page: React.FC = () => (
  <HydrateClient>
    <main className="p-6 text-white md:py-24">
      <Tabs defaultValue="jobs" className="mx-auto flex max-w-5xl flex-col gap-6">
        <TabsList className="w-full">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
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

export default Page;
