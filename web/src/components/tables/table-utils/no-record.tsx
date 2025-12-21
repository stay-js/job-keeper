import { TableBody, TableCell, TableRow } from '~/components/ui/table';

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
