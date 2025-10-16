'use client';

import { Button } from '~/components/ui/button';
import { useUser, SignInButton } from '@clerk/nextjs';
import { MoveRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const CTA: React.FC = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="py-20 sm:py-32">
      <div className="container max-w-4xl text-center">
        <div className="group relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 p-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/50">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 px-8 py-16 sm:px-16 sm:py-24">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                <Sparkles size={18} />
                <span>Free And Open Source</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  Ready to take control of your work schedule?
                </h2>
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-cyan-50/90 sm:text-xl">
                  Join students who are already managing their jobs more efficiently with JobKeeper.
                  Completely free, no strings attached.
                </p>
              </div>

              {isSignedIn ? (
                <Button
                  className="group/btn relative overflow-hidden rounded-xl bg-white px-8 py-7 text-base font-semibold text-blue-600 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <span>Get Started</span>
                    <MoveRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-100 to-blue-100 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                  </Link>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="group/btn relative overflow-hidden rounded-xl bg-white px-8 py-7 text-base font-semibold text-blue-600 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30">
                    <span className="flex items-center gap-2">
                      <span>Get Started</span>
                      <MoveRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-100 to-blue-100 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                  </Button>
                </SignInButton>
              )}

              <p className="text-sm font-medium text-cyan-100/80">
                Built for students by students.
              </p>
            </div>

            <div className="absolute inset-0 -top-full h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:top-full group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </section>
  );
};
