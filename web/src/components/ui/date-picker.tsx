'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';

export function DatePicker({
  id,
  date,
  setDate,
  locale,
  className,
  defaultMonth,
  invalid,
}: {
  id?: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defaultMonth: Date | undefined;
  locale?: string;
  className?: string;
  invalid?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id ?? 'date'}
          className={cn(
            'justify-start text-left font-normal',
            !date && !invalid && 'text-muted-foreground',
            className,
          )}
        >
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
