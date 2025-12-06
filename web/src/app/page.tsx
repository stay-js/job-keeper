import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import HomePage, { description, title } from '~/app/home/page';
import { createMetadata } from '~/lib/create-metadata';

export const metadata = createMetadata({
  path: '/',
  title,
  description,
});

export default async function Page() {
  const user = await currentUser();
  if (user) redirect('/dashboard');

  return <HomePage />;
}
