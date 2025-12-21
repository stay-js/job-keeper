'use client';

import { useState } from 'react';
import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';

import type { RouterOutputs } from '~/trpc/react';
import { Table } from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import {
  TableSkeleton,
  TableNoRecord,
  TableHeaderWithOrdering,
  TableColumnSelector,
  TableContent,
} from '~/components/tables/table-utils';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { useMounted } from '~/hooks/use-mounted';
import { getFormatters } from '~/lib/formatters';

export function PositionsTable({
  positions = [],
  isLoading,
  setSelected,
}: {
  positions: RouterOutputs['positions']['getAllWithHoursWorked'] | undefined;
  isLoading: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const mounted = useMounted();
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

  if (!mounted) {
    return (
      <>
        <div className="flex gap-4 max-sm:flex-col">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button disabled size="icon" variant="outline">
                <ChevronFirst size={18} />
              </Button>
              <Button disabled size="icon" variant="outline">
                <ChevronLeft size={18} />
              </Button>
            </div>

            <Skeleton className="h-3 w-24" />

            <div className="flex gap-2">
              <Button disabled size="icon" variant="outline">
                <ChevronRight size={18} />
              </Button>
              <Button disabled size="icon" variant="outline">
                <ChevronLast size={18} />
              </Button>
            </div>
          </div>

          <TableColumnSelector table={table} />
        </div>

        <Table>
          <TableHeaderWithOrdering table={table} />

          <TableSkeleton table={table} />
        </Table>
      </>
    );
  }

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

        <TableColumnSelector table={table} />
      </div>

      <Table>
        <TableHeaderWithOrdering table={table} />

        {isLoading && <TableSkeleton table={table} />}

        {!isLoading && positions.length === 0 && (
          <TableNoRecord columns={table.getAllColumns().length} />
        )}

        {!isLoading && positions.length > 0 && (
          <TableContent table={table} setSelected={setSelected} idAccessor={(row) => row.id} />
        )}
      </Table>
    </>
  );
}
