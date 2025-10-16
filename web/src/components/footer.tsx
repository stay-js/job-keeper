import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="border-t bg-neutral-900 text-sm">
    <div className="container mx-auto flex flex-col gap-8 px-6 py-12">
      <div className="flex justify-between gap-8 max-md:flex-col">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">JobKeeper</h3>

          <p className="text-balanced max-w-[50ch] leading-relaxed text-neutral-400">
            Track hours, calculate earnings, and organize all your positions in one place. Built for
            students who juggle multiple jobs.
          </p>
        </div>

        <div className="flex gap-8 max-md:flex-col">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Quick Links</h4>

            <div className="flex flex-col gap-2">
              <Link href="/home" className="text-neutral-400 transition-colors hover:text-white">
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/privacy-policy"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Connect</h4>

            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/stay-js/job-keeper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-neutral-400 transition-colors hover:text-white"
              >
                <Github size={16} />
                View on GitHub
              </Link>

              <Link
                href="https://znagy.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-neutral-400 transition-colors hover:text-white"
              >
                <Globe size={16} />
                znagy.hu
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8 text-neutral-400">
        &copy; 2025 JobKeeper. All rights reserved.
      </div>
    </div>
  </footer>
);
