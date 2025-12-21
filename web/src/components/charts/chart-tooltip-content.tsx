import { ChartTooltipContent as BaseChartTooltipContent } from '~/components/ui/chart';

export function ChartTooltipContent({
  formatter,
  colors,
  ...props
}: {
  colors: Record<string, string>;
  formatter: { format: (value: number) => React.ReactNode };
}) {
  return (
    <BaseChartTooltipContent
      {...props}
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
              {formatter.format(value as number)}
            </span>
          </div>
        </div>
      )}
    />
  );
}
