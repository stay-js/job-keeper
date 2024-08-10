import { api, HydrateClient } from '~/trpc/server';
import { JobsPage } from '~/app/jobs';
import { WagesPage } from './wages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

const Jobs = async () => {
  const jobs = await api.job.getAll();

  void api.job.getAll.prefetch();

  return <JobsPage data={jobs} />;
};

const Wages = async () => {
  const wages = await api.wage.getAllWithHoursWorked();

  void api.job.getAll.prefetch();

  return <WagesPage data={wages} />;
};

const Page: React.FC = () => (
  <HydrateClient>
    <main className="p-6 text-white md:py-24">
      <Tabs defaultValue="jobs" className="mx-auto flex max-w-5xl flex-col gap-6">
        <TabsList className="w-full">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="wages">Wages</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Jobs />
        </TabsContent>
        <TabsContent value="wages">
          <Wages />
        </TabsContent>
      </Tabs>
    </main>
  </HydrateClient>
);

export default Page;
