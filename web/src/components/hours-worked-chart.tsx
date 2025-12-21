'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import { RouterOutputs } from '~/trpc/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/lib/formatters';
import { cn } from '~/lib/utils';

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
    <Card className={cn('h-fit min-w-0 rounded-md py-0', className)}>
      <CardHeader className="grid items-stretch gap-0 border-b p-0! sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col justify-center gap-1 p-4">
          <CardTitle>Hours Worked</CardTitle>
          <CardDescription>
            Showing total hours worked by positions in the selected range
          </CardDescription>
        </div>

        <div className="flex flex-col justify-center gap-1 border-t p-4 sm:border-s sm:border-t-0">
          <span className="text-muted-foreground text-xs">Total Hours Worked</span>
          <span className="text-lg leading-none font-bold sm:text-2xl">{hf.format(total)}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <ChartContainer className="mx-auto aspect-square w-full max-w-80">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _, item) => (
                    <div className="flex items-center gap-2">
                      <div
                        className="size-2.5 rounded-[2px]"
                        style={{ backgroundColor: colors[item.payload?.id] }}
                      />

                      <div className="flex gap-1">
                        <span className="text-muted-foreground">{item.payload?.position}:</span>
                        <span className="text-foreground font-mono font-medium">
                          {hf.format(value as number)}
                        </span>
                      </div>
                    </div>
                  )}
                />
              }
            />

            <Pie data={positions} dataKey="hoursWorked" nameKey="position">
              {positions?.map((item) => (
                <Cell key={item.id} fill={colors[item.id]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
