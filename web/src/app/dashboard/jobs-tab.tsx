'use client';

import type { RouterOutputs } from '~/trpc/react';
import { JobsTable } from '~/components/jobs-table';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { JobDialog } from '~/components/job-dialog';
import { ExpensesDialog } from '~/components/expenses-dialog';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/utils/formatters';

export const JobsTab: React.FC<{
  jobs: RouterOutputs['job']['getAll'];
  positions: RouterOutputs['position']['getAll'];
  expenses: RouterOutputs['expense']['getAll'];
}> = ({ jobs, positions, expenses }) => {
  const userPreferences = useUserPreferences();
  const { hours: hf } = getFormatters(userPreferences);

  const [selected, setSelected] = useState<number | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<number | null>(null);

  const [month, setMonth] = useState(new Date().getUTCMonth());
  const [year, setYear] = useState(new Date().getUTCFullYear());

  const monthDate = new Date(Date.UTC(year, month, 1));

  const current = jobs.filter(
    (item) => item.date.getUTCMonth() === month && item.date.getUTCFullYear() === year,
  );

  const currentExpenses = expenses.filter(
    (item) => item.date.getUTCMonth() === month && item.date.getUTCFullYear() === year,
  );

  const incrementMonth = () => {
    setMonth((value) => (value + 1) % 12);

    if (month === 11) setYear((value) => value + 1);
  };

  const decrementMonth = () => {
    setMonth((value) => (value + 11) % 12);

    if (month === 0) setYear((value) => value - 1);
  };

  const getDefaultValues = (id: number | null) => {
    const empty = {
      date: undefined,
      location: '',
      event: '',
      positionId: 'default',
      hours: '',
    };

    if (id === null) return empty;

    const item = jobs.find((item) => item.id === id);
    if (!item) return empty;

    return {
      ...item,
      event: item.event ?? '',
      positionId: item.positionId.toString(),
      hours: hf.format(item.hours),
    };
  };

  const getDefaultExpenseValues = (id: number | null) => {
    const empty = {
      name: '',
      amount: '',
    };

    if (id === null) return empty;

    const item = expenses.find((item) => item.id === id);
    if (!item) return empty;

    return {
      ...item,
      amount: item.amount.toString(),
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between gap-2">
        <Button onClick={decrementMonth} variant="outline" size="icon">
          {'<'}
        </Button>

        <h1 className="text-4xl font-bold text-white">
          {year} / {month + 1}.
        </h1>

        <Button onClick={incrementMonth} variant="outline" size="icon">
          {'>'}
        </Button>
      </div>

      <JobsTable
        data={current}
        expenses={currentExpenses}
        setSelected={setSelected}
        setSelectedExpense={setSelectedExpense}
      />

      <div className="grid gap-4 sm:grid-cols-[4fr_1fr]">
        <JobDialog
          positions={positions}
          selected={selected}
          setSelected={setSelected}
          getDefaultValues={getDefaultValues}
          defaultMonth={monthDate}
        />

        <ExpensesDialog
          selected={selectedExpense}
          setSelected={setSelectedExpense}
          getDefaultValues={getDefaultExpenseValues}
          date={monthDate}
        />
      </div>
    </div>
  );
};
