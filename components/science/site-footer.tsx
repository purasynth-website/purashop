import Link from "next/link";
import { PATHS, SITE_NAME, SITE_TAGLINE } from "@/lib/blog";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm text-slate-600 sm:grid-cols-[1fr_auto] sm:px-6">
        <div className="max-w-md">
          <p className="font-display text-base font-bold text-navy-900">{SITE_NAME}</p>
          <p className="mt-1 leading-relaxed">{SITE_TAGLINE}</p>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Constants from the IUPAC standard atomic weights; structures and identifiers after ChEBI (CC BY 4.0). Reference material for the bench,
            not advice.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 sm:text-right">
          <Link href={PATHS.primers} className="hover:text-cobalt-700">Primers</Link>
          <Link href={PATHS.tables} className="hover:text-cobalt-700">Tables</Link>
          <Link href={PATHS.calculators} className="hover:text-cobalt-700">Calculators</Link>
          <Link href={PATHS.about} className="hover:text-cobalt-700">About</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-4 pb-6 text-xs text-slate-400 sm:px-6">
        © {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
