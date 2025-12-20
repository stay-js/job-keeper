'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/lib/formatters';
import { RouterOutputs } from '~/trpc/react';

export function PayoutChart({
  positions = [],
}: {
  positions: RouterOutputs['positions']['getAllWithHoursWorked'] | undefined;
}) {
  const userPreferences = useUserPreferences();
  const { currency: cf } = getFormatters(userPreferences);

  const total = useMemo(
    () => positions?.reduce((acc, pos) => acc + pos.payout, 0) ?? 0,
    [positions],
  );

  return (
    <Card className="rounded-md py-0">
      <CardHeader className="grid items-center gap-0 border-b p-0! sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-1 p-4">
          <CardTitle>Payout</CardTitle>
          <CardDescription>Showing total payout by positions in the selected range</CardDescription>
        </div>

        <div className="flex flex-col gap-1 border-t p-4 sm:border-s sm:border-t-0">
          <span className="text-muted-foreground text-xs">Total Payout</span>
          <span className="text-lg leading-none font-bold sm:text-2xl">{cf.format(total)}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ChartContainer
          config={{
            payout: {
              label: 'Payout',
            },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={positions} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis dataKey="position" tickLine={false} axisLine={false} tickMargin={8} />

            <ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
            <Bar dataKey="payout" fill={`var(--chart-1)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
