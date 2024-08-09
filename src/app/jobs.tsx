'use client';

import type { RouterOutputs } from '~/trpc/react';
import { useState } from 'react';
import { JobsTable } from '~/components/jobs-table';
import { Button } from '~/components/ui/button';

export const JobsPage: React.FC<{ data: RouterOutputs['job']['getAll'] }> = ({ data }) => {
  const [month, setMonth] = useState(new Date().getUTCMonth());
  const [year, setYear] = useState(new Date().getUTCFullYear());

  const current = data.filter(
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
        <Button onClick={decrementMonth} variant="outline">
          {'<'}
        </Button>

        <h1 className="text-4xl font-bold text-white">
          {year} / {month + 1}.
        </h1>

        <Button onClick={incrementMonth} variant="outline">
          {'>'}
        </Button>
      </div>

      <JobsTable data={current} />
    </div>
  );
};
