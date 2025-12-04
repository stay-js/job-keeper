'use client';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import { DatePicker } from '~/components/ui/date-picker';
import { PositionsTable } from '~/components/positions-table';
import { useUserPreferences } from '~/contexts/user-preferences-context';

export const StatisticsTab: React.FC = () => {
  const userPreferences = useUserPreferences();

  const [from, setFrom] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() - 1);

    return d;
  });

  const [to, setTo] = useState<Date | undefined>(() => new Date());

  const [queryInput, setQueryInput] = useState(() => ({ from: from as Date, to: to as Date }));

  useEffect(() => {
    if (!from || !to) return;

    const timeout = setTimeout(() => setQueryInput({ from, to }));

    return () => clearTimeout(timeout);
  }, [from, to]);

  const { data: positions, isLoading } =
    api.positions.getWithHoursWorkedFromTo.useQuery(queryInput);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-6 gap-y-4 max-sm:flex-col">
        <div className="flex w-fit items-center gap-2">
          <span>From: </span>
          <DatePicker
            date={from}
            setDate={setFrom}
            defaultMonth={from}
            locale={userPreferences.locale}
          />
        </div>
        <div className="flex w-fit items-center gap-2">
          <span>To: </span>
          <DatePicker date={to} setDate={setTo} defaultMonth={to} locale={userPreferences.locale} />
        </div>
      </div>
      <PositionsTable positions={positions} isLoading={isLoading} />
    </div>
  );
};
