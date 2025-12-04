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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadOrderButton,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { getFormatters } from '~/utils/formatters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '~/components/ui/dropdown-menu';
import { Skeleton } from '~/components/ui/skeleton';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { cn } from '~/utils/cn';

export const PositionsTable: React.FC<{
  positions: RouterOutputs['positions']['getAllWithHoursWorked'] | undefined;
  isLoading: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ positions = [], isLoading, setSelected }) => {
  const userPreferences = useUserPreferences();
  const { currency: cf, hours: hf } = getFormatters(userPreferences);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: positions,
    columns: [
      {
        header: 'Position',
        accessorKey: 'position',
      },
      {
        header: 'Wage',
        accessorKey: 'wage',
        cell: (cell) => cf.format(cell.getValue<number>()),
      },
      {
        header: 'Hours Worked',
        accessorKey: 'hoursWorked',
        cell: (cell) => hf.format(cell.getValue<number>() || 0),
      },
      {
        header: 'Payout',
        accessorKey: 'payout',
        cell: (cell) => cf.format(cell.getValue<number>()),
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
              <ChevronFirst size={18} />
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="icon"
              variant="outline"
            >
              <ChevronLeft size={18} />
            </Button>
          </div>

          <div>
            Page <b>{table.getState().pagination.pageIndex + 1}</b> of{' '}
            <b>{Math.max(table.getPageCount(), 1)}</b>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
            >
              <ChevronRight size={18} />
            </Button>
            <Button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
            >
              <ChevronLast size={18} />
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
                  className="cursor-pointer"
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
                <TableHead key={header.id}>
                  <TableHeadOrderButton onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHeadOrderButton>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {isLoading && (
          <TableBody>
            {new Array(5).fill(null).map((_, idx) => (
              <TableRow key={idx}>
                {table.getAllColumns().map((column) => (
                  <TableCell key={column.id}>
                    <div className="py-1">
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}

        {!isLoading && positions.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="text-center">
                No record.
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {!isLoading && positions.length > 0 && (
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                className={cn(setSelected && 'cursor-pointer')}
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={setSelected ? () => setSelected(row.original.id) : undefined}
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
      </Table>
    </>
  );
};
