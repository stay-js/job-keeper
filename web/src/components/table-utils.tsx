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

export const TableSkeleton = <TData,>({
  table,
  rows = 5,
}: {
  table: Table<TData>;
  rows?: number;
}) => (
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

export const TableNoRecord: React.FC<{ colSpan: number }> = ({ colSpan }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center">
        No record.
      </TableCell>
    </TableRow>
  </TableBody>
);

export const TableHeaderWithOrdering = <TData,>({ table }: { table: Table<TData> }) => (
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
);
