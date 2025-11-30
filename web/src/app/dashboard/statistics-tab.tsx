'use client';

import { useState } from 'react';
import { DatePicker } from '~/components/ui/date-picker';
import { useUserPreferences } from '~/contexts/user-preferences-context';

export const StatisticsTab: React.FC = () => {
  const userPreferences = useUserPreferences();

  const from = new Date();
  from.setUTCMonth(from.getUTCMonth() - 1);

  const [fromDate, setFromDate] = useState<Date | undefined>(from);
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2">
        <span>From: </span>
        <DatePicker date={fromDate} setDate={setFromDate} locale={userPreferences.locale} />
      </div>

      <div className="flex items-center gap-2">
        <span>To: </span>
        <DatePicker date={toDate} setDate={setToDate} locale={userPreferences.locale} />
      </div>
    </div>
  );
};
