'use client';

import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { JobsTab } from './jobs-tab';
import { PositionsTab } from './positions-tab';
import { StatisticsTab } from './statistics-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { CustomUserButton } from '~/components/custom-user-button';

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
      className="mx-auto flex max-w-5xl flex-col gap-4"
      value={searchParams.get('tab') ?? 'jobs'}
      onValueChange={handleTabChange}
    >
      <TabsList className="h-fit w-full items-center p-2">
        <TabsTrigger value="jobs">Jobs</TabsTrigger>
        <TabsTrigger value="positions">Positions</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>

        <div className="ms-auto flex">
          <CustomUserButton />
        </div>
      </TabsList>

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
