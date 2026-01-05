'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { CustomUserButton } from '~/components/custom-user-button';
import { JobsTab } from './jobs-tab';
import { PositionsTab } from './positions-tab';
import { StatisticsTab } from './statistics-tab';

export function DashboardTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams({ tab: value });

    window.history.pushState(null, '', pathname + '?' + params.toString());
  };

  return (
    <Tabs
      defaultValue="jobs"
      value={searchParams.get('tab') ?? 'jobs'}
      onValueChange={handleTabChange}
    >
      <div className="bg-card flex w-full items-center justify-between gap-4 rounded-lg p-2">
        <TabsList className="h-fit items-center bg-transparent p-0">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <CustomUserButton />
      </div>

      <TabsContent value="jobs">
        <JobsTab />
      </TabsContent>
      <TabsContent value="positions">
        <PositionsTab />
      </TabsContent>
      <TabsContent value="statistics">
        <StatisticsTab />
      </TabsContent>
    </Tabs>
  );
}
