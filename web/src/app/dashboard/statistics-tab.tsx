'use client';

import { useEffect, useState } from 'react';

import { api } from '~/trpc/react';
import { DatePicker } from '~/components/ui/date-picker';
import { PositionsTable } from '~/components/positions-table';
import { useUserPreferences } from '~/contexts/user-preferences-context';

export const StatisticsTab: React.FC = () => {
  const userPreferences = useUserPreferences();

  const [fromDate, setFromDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() - 1);

    return d;
  });

  const [toDate, setToDate] = useState<Date | undefined>(() => new Date());

  const {
    data: positions,
    isPending,
    mutate,
  } = api.positions.getWithHoursWorkedFromTo.useMutation();

  useEffect(() => {
    if (!fromDate || !toDate) return;

    mutate({ from: fromDate, to: toDate });
  }, [fromDate, toDate, mutate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-6 gap-y-4 max-sm:flex-col">
        <div className="flex w-fit items-center gap-2">
          <span>From: </span>
          <DatePicker
            date={fromDate}
            setDate={setFromDate}
            defaultMonth={fromDate}
            locale={userPreferences.locale}
          />
        </div>

        <div className="flex w-fit items-center gap-2">
          <span>To: </span>
          <DatePicker
            date={toDate}
            setDate={setToDate}
            defaultMonth={toDate}
            locale={userPreferences.locale}
          />
        </div>
      </div>

      <PositionsTable positions={positions} isLoading={isPending} />
    </div>
  );
};
