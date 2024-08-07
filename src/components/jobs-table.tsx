'use client';

import type { RouterOutputs } from '~/trpc/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
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
  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (cell) => (cell.getValue() as Date).toLocaleDateString('hu-HU'),
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'event',
        header: 'Event',
      },
      {
        accessorKey: 'hours',
        header: 'Hours',
      },
      {
        accessorKey: 'position',
        header: 'Position',
      },
      {
        accessorKey: 'wage',
        header: 'Wage',
        cell: (cell) => currencyFormatter.format(cell.getValue() as number),
      },
      {
        header: 'Payout',
        cell: (cell) => currencyFormatter.format(cell.row.original.hours * cell.row.original.wage),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
                table
                  .getRowModel()
                  .rows.reduce((acc, row) => acc + row.original.hours * row.original.wage, 0),
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
