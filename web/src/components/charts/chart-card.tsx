import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/lib/utils';

export function ChartCard({
  children,
  className,
  title,
  description,
  total,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  description: string;
  total: React.ReactNode;
}) {
  return (
    <Card className={cn('h-fit min-w-0 rounded-md py-0', className)}>
      <CardHeader className="grid items-stretch gap-0 border-b p-0! sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col justify-center gap-1 p-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <div className="flex flex-col justify-center gap-1 border-t p-4 sm:border-s sm:border-t-0">
          <span className="text-muted-foreground text-xs">Total {title}</span>
          <span className="text-lg leading-none font-bold sm:text-2xl">{total}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
