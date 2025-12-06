import { type Table, flexRender } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';

export function TableContent<TData>({
  table,
  setSelected,
  idAccessor,
}: {
  table: Table<TData>;
  setSelected?: (id: number | null) => void;
  idAccessor: (row: TData) => number;
}) {
  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          className={cn(setSelected && 'cursor-pointer')}
          key={idAccessor(row.original)}
          data-state={row.getIsSelected() && 'selected'}
          onClick={setSelected ? () => setSelected(idAccessor(row.original)) : undefined}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
