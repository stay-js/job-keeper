'use client';

import type { RouterOutputs } from '~/trpc/react';
import { useState } from 'react';
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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
} from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { currencyFormatter } from '~/utils/currency-formatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '~/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export const PositionsTable: React.FC<{
  data: RouterOutputs['position']['getAllWithHoursWorked'];
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ data, setSelected }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: [
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
        header: 'Hours Worked',
        accessorKey: 'hoursWorked',
        cell: (cell) => cell.getValue<number>() || 0,
      },
      {
        header: 'Payout',
        accessorKey: 'payout',
        cell: (cell) => currencyFormatter.format(cell.getValue<number>()),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  });

  return (
    <>
      <div className="flex gap-4 max-sm:flex-col">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              size="icon"
              variant="outline"
            >
              {'<<'}
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="icon"
              variant="outline"
            >
              {'<'}
            </Button>
          </div>

          <div>
            Page <b>{table.getState().pagination.pageIndex + 1}</b> of <b>{table.getPageCount()}</b>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
            >
              {'>'}
            </Button>
            <Button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
            >
              {'>>'}
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 sm:w-fit">
              Columns <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.header?.toString()}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
    </>
  );
};
