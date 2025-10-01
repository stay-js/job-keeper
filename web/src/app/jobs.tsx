'use client';

import type { RouterOutputs } from '~/trpc/react';
import { JobsTable } from '~/components/jobs-table';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { JobDialog } from '~/components/job-dialog';
import { useUserData } from '~/contexts/user-data-context';
import { getFormatters } from '~/utils/formatters';

export const JobsPage: React.FC<{
  jobs: RouterOutputs['job']['getAll'];
  positions: RouterOutputs['position']['getAll'];
}> = ({ jobs, positions }) => {
  const userData = useUserData();
  const { hours: hf } = getFormatters(userData);

  const [selected, setSelected] = useState<number | null>(null);

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

  const getDefaultValues = (id: number | null) => {
    const empty = {
      date: '',
      location: '',
      event: '',
      positionId: 'default',
      hours: '',
    };

    if (id === null) return empty;

    const item = jobs.find((item) => item.id === id);
    if (!item) return empty;

    return {
      date: item.date.toLocaleDateString(userData.locale),
      location: item.location,
      event: item.event,
      positionId: item.positionId.toString(),
      hours: hf.format(item.hours),
    };
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

      <JobsTable data={current} setSelected={setSelected} />
      <JobDialog
        positions={positions}
        selected={selected}
        setSelected={setSelected}
        getDefaultValues={getDefaultValues}
      />
    </div>
  );
};
