'use client';

import type { RouterOutputs } from '~/trpc/react';
import { useState } from 'react';
import { PositionsTable } from '~/components/positions-table';
import { PositionDialog } from '~/components/position-dialog';

export const PositionsPage: React.FC<{
  data: RouterOutputs['position']['getAllWithHoursWorked'];
}> = ({ data }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const getDefaultValues = (id: number | null) => {
    const empty = { name: '', wage: '' };

    if (id === null) return empty;

    const item = data.find((item) => item.id === id);
    if (!item) return empty;

    return {
      name: item.position,
      wage: item.wage.toString(),
      canDelete: !item.hoursWorked,
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <PositionsTable data={data} setSelected={setSelected} />
      <PositionDialog
        selected={selected}
        setSelected={setSelected}
        getDefaultValues={getDefaultValues}
      />
    </div>
  );
};
