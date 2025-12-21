import { type Table, flexRender } from '@tanstack/react-table';
import { TableHead, TableHeadOrderButton, TableHeader, TableRow } from '~/components/ui/table';

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
