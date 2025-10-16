import Image from 'next/image';

export const DashboardPreview: React.FC = () => (
  <section id="dashboard" className="bg-neutral-900 py-20 sm:py-32">
    <div className="container flex flex-col items-center gap-16">
      <div className="flex max-w-2xl flex-col gap-4 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          A powerful dashboard at your fingertips
        </h2>
        <p className="text-pretty text-lg leading-relaxed text-neutral-400">
          Manage all your jobs, track positions, and monitor earnings with our intuitive interface
        </p>
      </div>

      <div className="flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-sky-500" />
            <h3 className="text-xl font-semibold">Jobs Overview</h3>
          </div>

          <p className="max-w-2xl leading-relaxed text-neutral-400">
            View all your previous shifts in a clean, organized table. Track dates, locations,
            events, positions, wages, work hours, and total payouts at a glance.
          </p>

          <div className="overflow-hidden rounded-xl border bg-black shadow-2xl">
            <Image
              src="/jobs.png"
              alt="JobKeeper Jobs Dashboard showing a table with job entries including dates, locations, events, positions, wages, hours worked, and payouts"
              width={2048}
              height={1152}
              className="aspect-video w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-yellow-500" />
            <h3 className="text-xl font-semibold">Positions Management</h3>
          </div>

          <p className="max-w-2xl leading-relaxed text-neutral-400">
            Keep track of all your different positions across various employers. See total hours
            worked and earnings for each role with automatic calculations.
          </p>

          <div className="overflow-hidden rounded-xl border bg-black shadow-2xl">
            <Image
              src="/positions.png"
              alt="JobKeeper Positions Dashboard displaying a paginated table of different positions with wages, hours worked, and total payouts"
              width={2048}
              height={1152}
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
