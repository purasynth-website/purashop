import Link from "next/link";
import { BLOG_NAME } from "@/lib/blog";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: `Page not found — ${BLOG_NAME}`,
  description: "That page does not exist.",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss-700">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-moss-900">Page not found</h1>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-moss-900 px-6 text-sm font-medium text-white hover:bg-moss-700"
      >
        Back to the front page
      </Link>
    </main>
  );
}
