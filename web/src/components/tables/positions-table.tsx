'use client';

import { useEffect, useState } from 'react';
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
import { usePathname, useSearchParams } from 'next/navigation';
import { useCreateQueryString } from '~/hooks/use-create-query-string';

const PAGE_SIZE = 10;

function getValidatedPageIndex(pageCount: number, pageIndex: number) {
  if (isNaN(pageIndex)) return 0;

  if (pageIndex < 0) return 0;
  if (pageIndex >= pageCount) return Math.max(pageCount - 1, 0);

  return pageIndex;
}

export function PositionsTable({
  positions = [],
  isLoading,
  setSelected,
}: {
  positions: RouterOutputs['positions']['getAllWithHoursWorked'] | undefined;
  isLoading: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  const currentPageIndex = Number(searchParams.get('page'));

  const mounted = useMounted();
  const userPreferences = useUserPreferences();
  const { currency: cf, hours: hf } = getFormatters(userPreferences);

  const totalPages = Math.max(Math.ceil(positions.length / PAGE_SIZE), 1);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: getValidatedPageIndex(totalPages, currentPageIndex - 1),
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    const newPage = pagination.pageIndex + 1;

    window.history.pushState(
      null,
      '',
      pathname + '?' + createQueryString('page', newPage.toString()),
    );
  }, [pagination.pageIndex]);

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
        cell: (cell) => cf.format(cell.getValue<number>() || 0),
      },
      {
        header: 'Hours Worked',
        accessorKey: 'hoursWorked',
        cell: (cell) => hf.format(cell.getValue<number>() || 0),
      },
      {
        header: 'Payout',
        accessorKey: 'payout',
        cell: (cell) => cf.format(cell.getValue<number>() || 0),
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
            Page <b>{pagination.pageIndex + 1}</b> of <b>{totalPages}</b>
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
