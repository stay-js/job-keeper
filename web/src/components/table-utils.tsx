import { type Table, flexRender } from '@tanstack/react-table';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeadOrderButton,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Skeleton } from '~/components/ui/skeleton';

export function TableSkeleton<TData>({ table, rows = 5 }: { table: Table<TData>; rows?: number }) {
  return (
    <TableBody>
      {new Array(rows).fill(null).map((_, idx) => (
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
  );
}

export function TableNoRecord({ columns }: { columns: number }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={columns} className="sm:text-center">
          No record.
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export function TableHeaderWithOrdering<TData>({ table }: { table: Table<TData> }) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className="px-0"
            >
              <TableHeadOrderButton>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeadOrderButton>
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
