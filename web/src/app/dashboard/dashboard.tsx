'use client';

import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { CustomUserButton } from '~/components/custom-user-button';
import { JobsTab } from './jobs-tab';
import { PositionsTab } from './positions-tab';
import { StatisticsTab } from './statistics-tab';

export const DashboardTabs: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleTabChange = (value: string) => {
    window.history.pushState(null, '', pathname + '?' + createQueryString('tab', value));
  };

  return (
    <Tabs
      defaultValue="jobs"
      value={searchParams.get('tab') ?? 'jobs'}
      onValueChange={handleTabChange}
    >
      <div className="bg-muted flex w-full items-center justify-between gap-4 rounded-lg p-2">
        <TabsList className="bg-transparent p-0">
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
};
