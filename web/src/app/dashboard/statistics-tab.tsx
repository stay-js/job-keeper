'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { api } from '~/trpc/react';
import { DateRangePicker } from '~/components/ui/date-range-picker';
import { PayoutChart } from '~/components/payout-chart';
import { HoursWorkedChart } from '~/components/hours-worked-chart';
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

  const { data: positions } = api.positions.getWithHoursWorkedFromTo.useQuery(deferredQueryInput);

  const colors = useMemo(
    () =>
      positions?.map(() => {
        const newRgb = {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        };

        return `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`;
      }) ?? [],
    [positions],
  );

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

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <HoursWorkedChart positions={positions} colors={colors} className="lg:order-2" />
        <PayoutChart positions={positions} colors={colors} className="lg:order-1" />
      </div>
    </div>
  );
}
