import Link from "next/link";
import { RuoBanner } from "@/components/ruo-banner";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Page not found",
  description: "That page does not exist.",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <>
      <RuoBanner />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">Page not found</h1>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-ink hover:bg-brand-100"
        >
          Back to the offer
        </Link>
      </main>
    </>
  );
}
