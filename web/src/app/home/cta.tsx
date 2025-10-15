'use client';

import { Button } from '~/components/ui/button';
import { useUser, SignInButton } from '@clerk/nextjs';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export const CTA: React.FC = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="py-20 sm:py-32">
      <div className="container relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-16 text-center sm:px-16 sm:py-24">
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to take control of your work schedule?
            </h2>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-neutral-100">
              Join students who are already managing their jobs more efficiently with JobKeeper.
              Completely free, no strings attached.
            </p>
          </div>

          {isSignedIn ? (
            <Button className="flex w-fit items-center gap-2" asChild>
              <Link href="/dashboard">
                <span className="text-black">Get Started</span>
                <MoveRight color="black" />
              </Link>
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="flex w-fit items-center gap-2">
                <span className="text-black">Get Started</span>
                <MoveRight color="black" />
              </Button>
            </SignInButton>
          )}

          <p className="text-sm">Built for students by students.</p>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>
    </section>
  );
};
