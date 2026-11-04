import Link from "next/link";
import { BLOG_KICKER, BLOG_NAME } from "@/lib/blog";

const NAV = [
  { href: "/articles", label: "Articles" },
  { href: "/reference", label: "Reference" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-display text-xl font-bold uppercase tracking-tight text-moss-900 sm:text-2xl">{BLOG_NAME}</span>
          <span aria-hidden="true" className="text-moss-400">/</span>
          <span className="hidden text-[10px] font-semibold uppercase leading-3 tracking-[0.18em] text-stone-500 sm:block">
            {BLOG_KICKER}
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm font-medium text-stone-700 sm:gap-6">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-moss-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
