import { api, HydrateClient } from '~/trpc/server';
import { JobsPage } from '~/components/jobs-page';

export default async function Home() {
  const jobs = await api.job.getAll();

  void api.job.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-neutral-950 p-6 text-white md:py-24">
        <JobsPage data={jobs} />
      </main>
    </HydrateClient>
  );
}
