import Link from "next/link";
import { articlePath, formatDate, padNumber, type Article } from "@/lib/blog";

/** A primer as a numbered card: the number, the topic, the title, the dek. */
export function PrimerCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <li className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-cobalt-200">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-cobalt-700">{padNumber(article.number)}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{article.topic}</span>
      </div>
      <Link href={articlePath(article.slug)} className="mt-3 block after:absolute after:inset-0 after:content-['']">
        <span className="font-display text-lg font-bold leading-snug tracking-tight text-navy-900 group-hover:text-cobalt-700">{article.title}</span>
      </Link>
      {!compact && <p className="mt-2 text-sm leading-relaxed text-slate-600">{article.dek}</p>}
      <p className="mt-3 text-xs text-slate-500">
        {article.readMinutes} min · {formatDate(article.updated)}
      </p>
    </li>
  );
}

/** A primer as one row in a list. */
export function PrimerRow({ article }: { article: Article }) {
  return (
    <li className="flex gap-4 border-b border-slate-200 py-3 last:border-b-0">
      <span className="w-6 shrink-0 pt-0.5 font-mono text-xs font-semibold text-cobalt-700">{padNumber(article.number)}</span>
      <div>
        <Link href={articlePath(article.slug)} className="font-display text-base font-bold leading-snug tracking-tight text-navy-900 hover:text-cobalt-700">
          {article.title}
        </Link>
        <p className="mt-0.5 text-xs text-slate-500">
          {article.readMinutes} min · {formatDate(article.updated)}
        </p>
      </div>
    </li>
  );
}
