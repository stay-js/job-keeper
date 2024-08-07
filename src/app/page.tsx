import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const jobs = await api.job.getAll();

  void api.job.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="grid min-h-screen place-content-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex flex-col items-center gap-2">
          {jobs.map((job) => (
            <div key={job.id}>
              {job.location}, {job.event}, {job.hours}, {job.wage} Ft,
              {job.hours * job.wage} Ft
            </div>
          ))}
        </div>
      </main>
    </HydrateClient>
  );
}
