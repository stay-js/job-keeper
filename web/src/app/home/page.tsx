import { createMetadata } from '~/lib/create-metadata';
import { Hero } from './hero';
import { DashboardPreview } from './dashboard-preview';
import { CTA } from './cta';

export const description =
  'Stay on top of your career with JobKeeper. Track jobs, positions, and progress all in one simple dashboard.';
export const title = 'Home';

export const metadata = createMetadata({
  path: '/home',
  title,
  description,
});

export const HomePage: React.FC = async () => (
  <main>
    <Hero />
    <DashboardPreview />
    <CTA />
  </main>
);

export default HomePage;
