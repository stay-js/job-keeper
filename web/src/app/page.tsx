import Link from "next/link";
import type { FC } from "react";

const Page: FC = () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white p-6">
    <div className="text-center space-y-6">
      <h1 className="text-5xl font-bold">Üdv a Fizu Appban 💸</h1>
      <p className="text-lg text-neutral-400">
        Kezeld a munkáidat és pozícióidat egyszerűen.
      </p>

      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-neutral-200 transition"
      >
        Menj a Dashboardra →
      </Link>
    </div>
  </main>
);

export default Page;