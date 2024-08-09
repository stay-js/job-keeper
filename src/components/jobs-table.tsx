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
  TableHeader,
  TableRow,
  TableFooter,
} from '~/components/ui/table';
import { currencyFormatter } from '~/utils/currency-formatter';

export const JobsTable: React.FC<{ data: RouterOutputs['job']['getAll'] }> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const perPosition = data.reduce<Record<string, { hoursWorked: number; wage: number }>>(
    (acc, job) => {
      if (!acc[job.position]) acc[job.position] = { hoursWorked: 0, wage: job.wage };
      acc[job.position]!.hoursWorked += job.hours;

      return acc;
    },
    {},
  );

  const table = useReactTable({
    data,
    columns: [
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (cell) => cell.getValue<Date>().toLocaleDateString('hu-HU'),
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
        header: 'Hours',
        accessorKey: 'hours',
      },
      {
        header: 'Wage',
        accessorKey: 'wage',
        cell: (cell) => currencyFormatter.format(cell.getValue<number>()),
      },
      {
        header: 'Payout',
        accessorKey: 'payout',
        cell: (cell) => currencyFormatter.format(cell.getValue<number>()),
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
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className="cursor-pointer select-none"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {data.length !== 0 ? (
        <>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            {Object.entries(perPosition).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell colSpan={4}>{key}</TableCell>
                <TableCell>{value.hoursWorked}</TableCell>
                <TableCell>{currencyFormatter.format(value.wage)}</TableCell>
                <TableCell>{currencyFormatter.format(value.hoursWorked * value.wage)}</TableCell>
              </TableRow>
            ))}

            <TableRow className="border-t">
              <TableCell colSpan={6}>Total:</TableCell>
              <TableCell>
                {currencyFormatter.format(data.reduce((acc, job) => acc + job.payout, 0))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No record.
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
};
