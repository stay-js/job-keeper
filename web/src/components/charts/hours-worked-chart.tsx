'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import { RouterOutputs } from '~/trpc/react';
import { ChartContainer, ChartTooltip } from '~/components/ui/chart';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/lib/formatters';
import { ChartCard } from './chart-card';
import { ChartTooltipContent } from './chart-tooltip-content';

export function HoursWorkedChart({
  positions = [],
  colors,
  className,
}: {
  positions: RouterOutputs['positions']['getAllWithHoursWorked'] | undefined;
  colors: Record<string, string>;
  className?: string;
}) {
  const userPreferences = useUserPreferences();
  const { hours: hf } = getFormatters(userPreferences);

  const total = useMemo(
    () => positions?.reduce((acc, pos) => acc + pos.hoursWorked, 0) ?? 0,
    [positions],
  );

  return (
    <ChartCard
      className={className}
      title="Hours Worked"
      description="Total hours worked by positions in the selected range"
      total={hf.format(total)}
    >
      <ChartContainer className="mx-auto aspect-square w-full max-w-80">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent colors={colors} formatter={hf} />} />

          <Pie data={positions} dataKey="hoursWorked">
            {positions?.map((item) => (
              <Cell key={item.id} fill={colors[item.id]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
}
