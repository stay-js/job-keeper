'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils/cn';

export function DatePicker({
  date,
  setDate,
  locale,
  className,
  defaultMonth,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defaultMonth: Date | undefined;
  locale?: string;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('justify-start text-left font-normal', className)}>
          <CalendarIcon size={18} />
          <span>{date ? date.toLocaleDateString(locale) : 'Select date'}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          ISOWeek
          captionLayout="label"
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={defaultMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
