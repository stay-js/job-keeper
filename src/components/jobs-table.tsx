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

const currencyFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  useGrouping: true,
  maximumFractionDigits: 0,
});

export const JobsTable: React.FC<{ data: RouterOutputs['job']['getAll'] }> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

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
        header: 'Hours',
        accessorKey: 'hours',
      },
      {
        header: 'Position',
        accessorKey: 'position',
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
        <TableRow>
          <TableCell colSpan={6}>Total:</TableCell>
          <TableCell>
            {currencyFormatter.format(
              table.getRowModel().rows.reduce((acc, row) => acc + row.original.payout, 0),
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
