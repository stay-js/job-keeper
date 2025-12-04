'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { PositionsTable } from '~/components/positions-table';
import { PositionDialog } from '~/components/position-dialog';

export const PositionsTab: React.FC = () => {
  const { data: positions, isLoading } = api.positions.getAllWithHoursWorked.useQuery();

  const [selected, setSelected] = useState<number | null>(null);

  const getDefaultValues = (id: number | null) => {
    const empty = { name: '', wage: '' };

    if (id === null) return empty;

    const item = positions?.find((item) => item.id === id);
    if (!item) return empty;

    return {
      name: item.position,
      wage: item.wage.toString(),
      canDelete: !item.hoursWorked,
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <PositionsTable positions={positions} isLoading={isLoading} setSelected={setSelected} />
      <PositionDialog
        selected={selected}
        setSelected={setSelected}
        getDefaultValues={getDefaultValues}
      />
    </div>
  );
};
