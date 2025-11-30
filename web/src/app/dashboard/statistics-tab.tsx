'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { DatePicker } from '~/components/ui/date-picker';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { PositionsTable } from '~/components/positions-table';

export const StatisticsTab: React.FC = () => {
  const userPreferences = useUserPreferences();

  const from = new Date();
  from.setUTCMonth(from.getUTCMonth() - 1);

  const to = new Date();

  const [fromDate, setFromDate] = useState<Date | undefined>(from);
  const [toDate, setToDate] = useState<Date | undefined>(to);

  const { data: positions } = api.position.getWihtHoursWorkedFromTo.useQuery({
    from: fromDate ?? from,
    to: toDate ?? to,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <span>From: </span>
          <DatePicker
            date={fromDate}
            setDate={setFromDate}
            defaultMonth={fromDate}
            locale={userPreferences.locale}
          />
        </div>

        <div className="flex items-center gap-2">
          <span>To: </span>
          <DatePicker
            date={toDate}
            setDate={setToDate}
            defaultMonth={toDate}
            locale={userPreferences.locale}
          />
        </div>
      </div>

      <PositionsTable data={positions ?? []} />
    </div>
  );
};
