import Link from "next/link";
import { BLOG_NAME } from "@/lib/blog";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-md">
          <p className="font-display text-base font-semibold text-moss-900">{BLOG_NAME}</p>
          <p className="mt-1 leading-relaxed">
            Explainers on molecular science, with the arithmetic shown. Masses are computed from the IUPAC standard atomic weights; structures
            and identifiers are from ChEBI (CC BY 4.0). Reference material, not advice.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/articles" className="hover:text-moss-700">Articles</Link>
          <Link href="/reference" className="hover:text-moss-700">Reference</Link>
          <Link href="/tools" className="hover:text-moss-700">Tools</Link>
          <Link href="/about" className="hover:text-moss-700">About</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-6 text-xs text-stone-500 sm:px-6">© {new Date().getFullYear()} {BLOG_NAME}</div>
    </footer>
  );
}
