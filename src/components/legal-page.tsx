import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <Link href="/" className="text-sm font-medium text-navy-700">
          ← RigMaintenance
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-navy-800">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">Last updated {updated}</p>
      </div>

      <div className="flex flex-col gap-5 text-sm leading-relaxed text-gray-700 [&_h2]:mt-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-navy-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
        {children}
      </div>
    </main>
  );
}
