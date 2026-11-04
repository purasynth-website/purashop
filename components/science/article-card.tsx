import Link from "next/link";
import { formatDate, type Article } from "@/lib/blog";

/** One entry in a reading list: kicker, title, and the explainer line. */
export function ArticleListItem({ article, showDate = false }: { article: Article; showDate?: boolean }) {
  return (
    <li className="border-b border-stone-200 py-4 first:pt-0 last:border-b-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-moss-700">{article.category}</p>
      <Link href={`/articles/${article.slug}`} className="group mt-1 block">
        <span className="font-display text-lg font-semibold leading-snug tracking-tight text-moss-900 group-hover:underline group-hover:decoration-moss-300 group-hover:underline-offset-4">
          {article.title}
        </span>
      </Link>
      <p className="mt-1.5 text-xs text-stone-500">
        <span className="font-semibold text-stone-700">Explainer</span>
        <span className="mx-1.5">·</span>
        {article.readMinutes} min read
        {showDate && (
          <>
            <span className="mx-1.5">·</span>
            {formatDate(article.updated)}
          </>
        )}
      </p>
    </li>
  );
}
