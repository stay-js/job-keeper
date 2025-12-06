import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t text-sm">
      <div className="container flex flex-col gap-8 py-12">
        <div className="flex justify-between gap-8 max-md:flex-col">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">JobKeeper</h3>

            <p className="text-balanced text-muted-foreground max-w-[50ch] leading-relaxed">
              Track hours, calculate earnings, and organize all your positions in one place. Built
              for students who juggle multiple jobs.
            </p>
          </div>

          <div className="flex gap-8 max-md:flex-col">
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold">Quick Links</h4>

              <div className="flex flex-col gap-2">
                <Link
                  href="/home"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Github size={16} />
                  View on GitHub
                </Link>

                <Link
                  href="https://znagy.hu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Globe size={16} />
                  znagy.hu
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground border-t pt-8">
          &copy; 2025 JobKeeper. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
