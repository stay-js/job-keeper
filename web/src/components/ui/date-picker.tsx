'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils/cn';

export const DatePicker: React.FC<{
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defaultMonth: Date | undefined;
  locale?: string;
  className?: string;
}> = ({ date, setDate, locale, className, defaultMonth }) => (
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
        <span>{date ? date.toLocaleDateString(locale) : 'Select date'}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        defaultMonth={defaultMonth}
        mode="single"
        selected={date}
        onSelect={setDate}
        required
      />
    </PopoverContent>
  </Popover>
);
