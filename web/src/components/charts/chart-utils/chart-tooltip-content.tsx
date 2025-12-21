import { get } from 'http';
import { ChartTooltipContent as BaseChartTooltipContent } from '~/components/ui/chart';
import { useUserPreferences } from '~/contexts/user-preferences-context';
import { getFormatters } from '~/lib/formatters';

export function ChartTooltipContent({
  formatter,
  colors,
  ...props
}: {
  colors: Record<string, string>;
  formatter: { format: (value: number) => React.ReactNode };
}) {
  const userPreferences = useUserPreferences();
  const { currency: cf } = getFormatters(userPreferences);

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
            <span className="text-muted-foreground">
              {item.payload?.position} ({cf.format(item.payload?.wage)}):
            </span>
            <span className="text-foreground font-mono font-medium">
              {formatter.format(value as number)}
            </span>
          </div>
        </div>
      )}
    />
  );
}
