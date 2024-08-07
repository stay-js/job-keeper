'use client';

import type { RouterOutputs } from '~/trpc/react';
import { useState } from 'react';
import { JobsTable } from '~/components/jobs-table';
import { Button } from '~/components/ui/button';

export const JobsPage: React.FC<{ data: RouterOutputs['job']['getAll'] }> = ({ data }) => {
  const [month, setMonth] = useState(6);
  const [year, setYear] = useState(2024);

  const current = data.filter(
    (item) => item.date.getUTCMonth() === month && item.date.getUTCFullYear() === year,
  );

  const incrementMonth = () => {
    setMonth((prev) => (prev + 1) % 12);

    if (month === 11) setYear((prev) => prev + 1);
  };

  const decrementMonth = () => {
    setMonth((prev) => (prev - 1 + 12) % 12);

    if (month === 0) setYear((prev) => prev - 1);
  };

  current.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-4">
      <div className="flex w-full justify-between gap-2">
        <Button onClick={decrementMonth}>-</Button>

        <h1 className="text-4xl font-bold text-white">
          {year} / {month + 1}.
        </h1>

        <Button onClick={incrementMonth}>+</Button>
      </div>

      <JobsTable data={current} />
    </div>
  );
};
