import Link from 'next/link';

export const Footer: React.FC = () => (
  <footer className="bg-neutral-900 py-6 text-neutral-400">
    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
      <div className="max-md:text-center">
        &copy; 2025{' '}
        <Link href="/" className="text-sm transition-colors hover:text-gray-200">
          JobKeeper
        </Link>
        . All rights reserved.
      </div>

      <div className="flex gap-4">
        <Link
          href="https://znagy.hu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors hover:text-gray-200"
        >
          znagy.hu
        </Link>

        <Link
          href="https://github.com/stay-js/job-keeper"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors hover:text-gray-200"
        >
          GitHub
        </Link>

        <Link href="/privacy-policy" className="text-sm transition-colors hover:text-gray-200">
          Privacy Policy
        </Link>
      </div>
    </div>
  </footer>
);
