'use client';

import { useDeferredValue, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { api } from '~/trpc/react';
import { DateRangePicker } from '~/components/ui/date-range-picker';
import { PositionsTable } from '~/components/positions-table';
import { PayoutChart } from '~/components/payout-chart';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { createDateOnlyString } from '~/lib/create-date-only-string';

function createQueryInput(range: DateRange | undefined) {
  if (!range?.from || !range?.to) return {};

  return {
    from: createDateOnlyString(range.from),
    to: createDateOnlyString(range.to),
  };
}

export function StatisticsTab() {
  const userPreferences = useUserPreferences();

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const deferredQueryInput = useDeferredValue(createQueryInput(range));

  const { data: positions, isLoading } =
    api.positions.getWithHoursWorkedFromTo.useQuery(deferredQueryInput);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Range:</span>

        <DateRangePicker
          range={range}
          setRange={setRange}
          defaultMonth={range?.from ?? new Date()}
          locale={userPreferences.locale}
        />
      </div>

      <PositionsTable positions={positions} isLoading={isLoading} />

      <PayoutChart positions={positions} />
    </div>
  );
}
