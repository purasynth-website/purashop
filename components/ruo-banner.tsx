/** Persistent compliance banner shown above everything else on every page. */
export function RuoBanner() {
  return (
    <div className="bg-slate-900 text-slate-100">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs sm:px-6 lg:px-8">
        <span className="font-semibold text-brand-300">Research Use Only.</span>{" "}
        All products are sold strictly for laboratory research. Not for human or
        veterinary use, diagnostic, or therapeutic purposes.
      </p>
    </div>
  );
}
