'use client';

import { useState, useMemo } from 'react';
import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { RouterOutputs } from '~/trpc/react';
import { Table, TableCell, TableRow, TableFooter } from '~/components/ui/table';
import {
  TableSkeleton,
  TableNoRecord,
  TableHeaderWithOrdering,
  TableContent,
} from '~/components/tables/table-utils';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { useMounted } from '~/hooks/use-mounted';
import { getFormatters } from '~/lib/formatters';

export function JobsTable({
  jobs = [],
  expenses = [],
  isLoading,
  setSelected,
  setSelectedExpense,
}: {
  jobs: RouterOutputs['jobs']['getAll'] | undefined;
  expenses: RouterOutputs['expenses']['getAll'] | undefined;
  isLoading: boolean;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedExpense: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const mounted = useMounted();
  const userPreferences = useUserPreferences();
  const { currency: cf, hours: hf } = getFormatters(userPreferences);

  const [sorting, setSorting] = useState<SortingState>([]);

  const perPosition = jobs.reduce<Record<string, { hoursWorked: number; wage: number }>>(
    (acc, job) => {
      acc[job.position] ??= { hoursWorked: 0, wage: job.wage };
      acc[job.position]!.hoursWorked += job.hours;

      return acc;
    },
    {},
  );

  const jobTotals = useMemo(
    () => ({
      hours: jobs.reduce((acc, job) => acc + job.hours, 0),
      payout: jobs.reduce((acc, job) => acc + job.payout, 0),
    }),
    [jobs],
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, expense) => acc + expense.amount, 0),
    [expenses],
  );

  const table = useReactTable({
    data: jobs,
    columns: [
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (cell) => (
          <span className="whitespace-nowrap">
            {cell.getValue<Date>().toLocaleDateString(userPreferences.locale)}
          </span>
        ),
      },
      {
        header: 'Location',
        accessorKey: 'location',
      },
      {
        header: 'Event',
        accessorKey: 'event',
      },
      {
        header: 'Position',
        accessorKey: 'position',
      },
      {
        header: 'Wage',
        accessorKey: 'wage',
        cell: (cell) => (
          <span className="whitespace-nowrap">{cf.format(cell.getValue<number>())}</span>
        ),
      },
      {
        header: 'Hours',
        accessorKey: 'hours',
        cell: (cell) => (
          <span className="whitespace-nowrap">{hf.format(cell.getValue<number>())}</span>
        ),
      },
      {
        header: 'Payout',
        accessorKey: 'payout',
        cell: (cell) => (
          <span className="whitespace-nowrap">{cf.format(cell.getValue<number>())}</span>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (!mounted) {
    return (
      <Table>
        <TableHeaderWithOrdering table={table} />

        <TableSkeleton table={table} />
      </Table>
    );
  }

  return (
    <Table>
      <TableHeaderWithOrdering table={table} />

      {isLoading && <TableSkeleton table={table} />}

      {!isLoading && jobs.length === 0 && <TableNoRecord columns={table.getAllColumns().length} />}

      {!isLoading && jobs.length > 0 && (
        <TableContent table={table} setSelected={setSelected} idAccessor={(row) => row.id} />
      )}

      <TableFooter>
        {Object.entries(perPosition).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell colSpan={4}>{key}</TableCell>
            <TableCell>{cf.format(value.wage)}</TableCell>
            <TableCell>{hf.format(value.hoursWorked)}</TableCell>
            <TableCell>{cf.format(value.hoursWorked * value.wage)}</TableCell>
          </TableRow>
        ))}

        {expenses.map((expense) => (
          <TableRow
            className="cursor-pointer"
            key={expense.id}
            onClick={() => setSelectedExpense(expense.id)}
          >
            <TableCell colSpan={6}>{expense.name}</TableCell>
            <TableCell>- {cf.format(expense.amount)}</TableCell>
          </TableRow>
        ))}

        <TableRow className="border-t">
          <TableCell colSpan={5}>Total:</TableCell>
          <TableCell>{hf.format(jobTotals.hours)}</TableCell>
          <TableCell>{cf.format(jobTotals.payout - totalExpenses)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
