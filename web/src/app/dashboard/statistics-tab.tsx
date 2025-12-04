'use client';

import { useDeferredValue, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { api } from '~/trpc/react';
import { DateRangePicker } from '~/components/ui/date-range-picker';
import { PositionsTable } from '~/components/positions-table';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { createDateOnlyString } from '~/utils/create-date-only-string';

const createQueryInput = (range: DateRange | undefined) => {
  if (!range?.from || !range?.to) return {};

  return {
    from: createDateOnlyString(range.from),
    to: createDateOnlyString(range.to),
  };
};

export const StatisticsTab: React.FC = () => {
  const userPreferences = useUserPreferences();

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const deferredQueryInput = useDeferredValue(createQueryInput(range));

  const { data: positions, isLoading } =
    api.positions.getWithHoursWorkedFromTo.useQuery(deferredQueryInput);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-6 gap-y-4 max-sm:flex-col">
        <div className="flex items-center gap-2">
          <span>Range:</span>

          <DateRangePicker
            range={range}
            setRange={setRange}
            defaultMonth={range?.from ?? new Date()}
            locale={userPreferences.locale}
          />
        </div>
      </div>

      <PositionsTable positions={positions} isLoading={isLoading} />
    </div>
  );
};
