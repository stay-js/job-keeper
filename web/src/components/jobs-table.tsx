'use client';

import { useState } from 'react';
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { RouterOutputs } from '~/trpc/react';
import { Table, TableBody, TableCell, TableRow, TableFooter } from '~/components/ui/table';
import { TableSkeleton, TableNoRecord, TableHeaderWithOrdering } from '~/components/table-utils';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/utils/formatters';

export const JobsTable: React.FC<{
  jobs: RouterOutputs['jobs']['getAll'] | undefined;
  expenses: RouterOutputs['expenses']['getAll'] | undefined;
  isLoading: boolean;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedExpense: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ jobs = [], expenses = [], isLoading, setSelected, setSelectedExpense }) => {
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

  const totalHours = jobs.reduce((acc, job) => acc + job.hours, 0);
  const totalPayout = jobs.reduce((acc, job) => acc + job.payout, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

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

  return (
    <Table>
      <TableHeaderWithOrdering table={table} />

      {isLoading && <TableSkeleton table={table} />}

      {!isLoading && jobs.length === 0 && <TableNoRecord colSpan={table.getAllColumns().length} />}

      {!isLoading && jobs.length > 0 && (
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              className="cursor-pointer"
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={() => setSelected(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
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
          <TableCell>{hf.format(totalHours)}</TableCell>
          <TableCell>{cf.format(totalPayout - totalExpenses)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
