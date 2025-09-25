import { redirect } from 'next/navigation';
import { SignInButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { MoveRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

const Page: React.FC = async () => {
  const user = await currentUser();
  if (user) redirect('/dashboard');

  return (
    <main className="grid min-h-screen items-center bg-neutral-950 p-6 text-white">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-bold">Üdv a Fizu App-ban 💸</h1>
        <p className="text-lg text-neutral-400">Kezeld a munkáidat és pozícióidat egyszerűen.</p>

        <SignInButton mode="modal">
          <Button className="flex w-fit items-center gap-2">
            <span className="text-black">Irány a Dashboard</span>
            <MoveRight color="black" />
          </Button>
        </SignInButton>
      </div>
    </main>
  );
};

export default Page;
