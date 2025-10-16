'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { MoveRight, Calendar, DollarSign, Clock } from 'lucide-react';
import { Button } from '~/components/ui/button';

const signInButtonClasses =
  'text-black flex w-fit items-center gap-2 rounded-xl px-4 py-6 shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30';

const signUpButtonClasses =
  'rounded-xl px-4 py-6 shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30';

export const Hero: React.FC = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-32">
      <div className="container mx-auto flex max-w-4xl flex-col items-center gap-16 px-6 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex w-fit items-center gap-2 rounded-full bg-neutral-800 px-4 py-1.5 text-sm">
            <span className="relative flex size-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-sky-500 opacity-75" />
              <span className="relative size-2 rounded-full bg-sky-500" />
            </span>

            <span className="text-neutral-400">Free for all students • Open Source</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Manage Your Student Jobs <span className="text-sky-500">Effortlessly</span>
            </h1>

            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-neutral-400 sm:text-xl">
              Track hours, calculate earnings, and organize all your positions in one place. Built
              for students who juggle multiple jobs.
            </p>
          </div>

          {isSignedIn ? (
            <div className="flex justify-center gap-4">
              <Button className={signInButtonClasses} asChild>
                <Link href="/dashboard">
                  <span>Go to Dashboard</span>
                  <MoveRight />
                </Link>
              </Button>

              <Button variant="secondary" className={signUpButtonClasses} asChild>
                <Link href="/dashboard">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <SignInButton mode="modal">
                <Button className={signInButtonClasses}>
                  <span>Go to Dashboard</span>
                  <MoveRight />
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button variant="secondary" className={signUpButtonClasses}>
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>

        <div className="grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center rounded-lg bg-sky-500/10 p-3 text-sky-500">
              <Calendar size={24} />
            </div>

            <p className="text-sm font-medium">Track Multiple Jobs</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center rounded-lg bg-teal-500/10 p-3 text-teal-500">
              <Clock size={24} />
            </div>

            <p className="text-sm font-medium">Log Hours Instantly</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center rounded-lg bg-orange-500/10 p-3 text-orange-500">
              <DollarSign size={24} />
            </div>

            <p className="text-sm font-medium">Calculate Earnings</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
    </section>
  );
};
