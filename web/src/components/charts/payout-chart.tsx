'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, YAxis, XAxis, Cell } from 'recharts';

import { RouterOutputs } from '~/trpc/react';
import { ChartContainer, ChartTooltip } from '~/components/ui/chart';
import { ChartCard, ChartTooltipContent } from '~/components/charts/chart-utils';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/lib/formatters';
import { truncateText } from '~/lib/truncate-text';
import { useMounted } from '~/hooks/use-mounted';

export function PayoutChart({
  className,
  positions = [],
  isLoading,
  colors,
}: {
  className?: string;
  positions: RouterOutputs['positions']['getAllWithHoursWorked'] | undefined;
  isLoading: boolean;
  colors: Record<string, string>;
}) {
  const isMounted = useMounted();
  const userPreferences = useUserPreferences();
  const { currency: cf } = getFormatters(userPreferences);

  const total = useMemo(
    () => positions?.reduce((acc, pos) => acc + pos.payout, 0) ?? 0,
    [positions],
  );

  return (
    <ChartCard
      className={className}
      title="Payout"
      description="Total payout by positions in the selected range"
      total={cf.format(total)}
      isLoading={isLoading}
    >
      <ChartContainer
        className="aspect-auto w-full transition-[height] duration-300"
        style={{
          height:
            !isMounted || isLoading ? '100px' : Math.max(100, (positions?.length ?? 0) * 42) + 'px',
        }}
      >
        <BarChart
          accessibilityLayer
          data={positions}
          layout="vertical"
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical />

          <YAxis
            dataKey="position"
            type="category"
            width={75}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(value) => truncateText(value, 15)}
          />

          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => cf.format(value)}
          />

          <ChartTooltip content={<ChartTooltipContent colors={colors} formatter={cf} />} />

          <Bar dataKey="payout">
            {positions?.map((item) => (
              <Cell key={item.id} fill={colors[item.id]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
