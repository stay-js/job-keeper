import { type Table } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '~/components/ui/table';
import { Skeleton } from '~/components/ui/skeleton';

export const TableSkeleton: React.FC<{
  table: Table<any>;
  rows?: number;
}> = ({ table, rows = 5 }) => (
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
