import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import HomePage, { description, title } from '~/app/home/page';
import { createMetadata } from '~/utils/create-metadata';

export const metadata = createMetadata({
  path: '/',
  title,
  description,
});

const Page: React.FC = async () => {
  const user = await currentUser();
  if (user) redirect('/dashboard');

  return <HomePage />;
};

export default Page;
