'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';

export function DateRangePicker({
  range,
  setRange,
  locale,
  className,
  defaultMonth,
}: {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  defaultMonth: Date | undefined;
  locale?: string;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('justify-start text-left font-normal', className)}>
          <CalendarIcon size={18} />
          <span>
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString(locale)} - ${range.to.toLocaleDateString(locale)}`
              : 'Select range'}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          ISOWeek
          captionLayout="dropdown"
          mode="range"
          selected={range}
          onSelect={setRange}
          defaultMonth={defaultMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
