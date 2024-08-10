'use client';

import type { RouterOutputs } from '~/trpc/react';
import { JobsTable } from '~/components/jobs-table';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { JobDialog } from '~/components/job-dialog';

export const JobsPage: React.FC<{
  jobs: RouterOutputs['job']['getAll'];
  positions: RouterOutputs['wage']['getAll'];
}> = ({ jobs, positions }) => {
  const [month, setMonth] = useState(new Date().getUTCMonth());
  const [year, setYear] = useState(new Date().getUTCFullYear());

  const current = jobs.filter(
    (item) => item.date.getUTCMonth() === month && item.date.getUTCFullYear() === year,
  );

  const incrementMonth = () => {
    setMonth((value) => (value + 1) % 12);

    if (month === 11) setYear((value) => value + 1);
  };

  const decrementMonth = () => {
    setMonth((value) => (value + 11) % 12);

    if (month === 0) setYear((value) => value - 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between gap-2">
        <Button onClick={decrementMonth} variant="outline" size="icon">
          {'<'}
        </Button>

        <h1 className="text-4xl font-bold text-white">
          {year} / {month + 1}.
        </h1>

        <Button onClick={incrementMonth} variant="outline" size="icon">
          {'>'}
        </Button>
      </div>

      <JobsTable data={current} />
      <JobDialog positions={positions} />
    </div>
  );
};
