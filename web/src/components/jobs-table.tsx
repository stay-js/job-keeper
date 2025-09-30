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
import { ChevronsUpDown } from 'lucide-react';
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

export const JobsTable: React.FC<{
  data: RouterOutputs['job']['getAll'];
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ data, setSelected }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const perPosition = data.reduce<Record<string, { hoursWorked: number; wage: number }>>(
    (acc, job) => {
      acc[job.position] ??= { hoursWorked: 0, wage: job.wage };
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
        header: 'Wage',
        accessorKey: 'wage',
        cell: (cell) => currencyFormatter.format(cell.getValue<number>()),
      },
      {
        header: 'Hours',
        accessorKey: 'hours',
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
              <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                <div className="flex w-fit cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition-colors select-none hover:bg-neutral-700 hover:text-white">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <ChevronsUpDown size={14} />
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {data.length !== 0 ? (
        <>
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

          <TableFooter>
            {Object.entries(perPosition).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell colSpan={4}>{key}</TableCell>
                <TableCell>{currencyFormatter.format(value.wage)}</TableCell>
                <TableCell>{value.hoursWorked}</TableCell>
                <TableCell>{currencyFormatter.format(value.hoursWorked * value.wage)}</TableCell>
              </TableRow>
            ))}

            <TableRow className="border-t">
              <TableCell colSpan={5}>Total:</TableCell>
              <TableCell>{data.reduce((acc, job) => acc + job.hours, 0)}</TableCell>
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
