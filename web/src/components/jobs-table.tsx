'use client';

import type { RouterOutputs } from '~/trpc/react';
import { useState } from 'react';
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadOrderButton,
  TableHeader,
  TableRow,
  TableFooter,
} from '~/components/ui/table';
import { getFormatters } from '~/utils/formatters';
import { useUserPreferences } from '~/contexts/user-preferences-context';

export const JobsTable: React.FC<{
  data: RouterOutputs['job']['getAll'];
  expenses: RouterOutputs['expense']['getAll'];
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedExpense: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ data, expenses, setSelected, setSelectedExpense }) => {
  const userPreferences = useUserPreferences();
  const { currency: cf, hours: hf } = getFormatters(userPreferences);

  const [sorting, setSorting] = useState<SortingState>([]);

  const perPosition = data.reduce<Record<string, { hoursWorked: number; wage: number }>>(
    (acc, job) => {
      acc[job.position] ??= { hoursWorked: 0, wage: job.wage };
      acc[job.position]!.hoursWorked += job.hours;

      return acc;
    },
    {},
  );

  const totalHours = data.reduce((acc, job) => acc + job.hours, 0);
  const totalPayout = data.reduce((acc, job) => acc + job.payout, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  const table = useReactTable({
    data,
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
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                <TableHeadOrderButton onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeadOrderButton>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {data.length !== 0 ? (
          <>
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
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No record.
            </TableCell>
          </TableRow>
        )}
      </TableBody>

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
