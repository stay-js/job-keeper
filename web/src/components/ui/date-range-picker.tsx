'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils/cn';
import type { DateRange, SelectRangeEventHandler } from 'react-day-picker';

export const DateRangePicker: React.FC<{
  range: DateRange;
  setRange: SelectRangeEventHandler;
  defaultMonth: Date | undefined;
  locale?: string;
  className?: string;
}> = ({ range, setRange, locale, className, defaultMonth }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          'flex w-full items-center justify-start gap-2 bg-transparent px-3 text-left font-normal',
          className,
        )}
      >
        <CalendarIcon size={18} />
        <span>
          {range
            ? `${range.from?.toLocaleDateString(locale)} - ${range.to?.toLocaleDateString(locale)}`
            : 'Select date'}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar defaultMonth={defaultMonth} mode="range" selected={range} onSelect={setRange} />
    </PopoverContent>
  </Popover>
);
