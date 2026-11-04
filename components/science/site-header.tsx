import Link from "next/link";
import { PATHS, SITE_KICKER, SITE_NAME } from "@/lib/blog";

const NAV = [
  { href: PATHS.primers, label: "Primers" },
  { href: PATHS.tables, label: "Tables" },
  { href: PATHS.calculators, label: "Calculators" },
  { href: PATHS.about, label: "About" },
];

/** The mark: a ruler with three ticks, the series' one piece of iconography. */
function Mark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0 rounded-md bg-cobalt-600 p-1 text-white">
      <path d="M4 15.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 15.5v-4M12 15.5v-7M17 15.5v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap">
          <Mark />
          <span className="font-display text-lg font-bold tracking-tight text-navy-900">{SITE_NAME}</span>
          <span className="hidden text-xs text-slate-500 md:inline">· {SITE_KICKER}</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm font-medium text-slate-600 sm:gap-6">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-cobalt-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
