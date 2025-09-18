import Link from 'next/link';
import { Button } from '~/components/ui/button';

const Page: React.FC = () => (
  <main className="grid min-h-screen items-center bg-neutral-950 p-6 text-white">
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-5xl font-bold">Üdv a Fizu Appban 💸</h1>
      <p className="text-lg text-neutral-400">Kezeld a munkáidat és pozícióidat egyszerűen.</p>

      <Button asChild className="w-fit">
        <Link href="/dashboard">Menj a Dashboardra →</Link>
      </Button>
    </div>
  </main>
);

export default Page;
