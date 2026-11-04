import { SiteFooter } from "@/components/science/site-footer";
import { SiteHeader } from "@/components/science/site-header";

/** The reading room's chrome: masthead and nav above, the colophon below. */
export default function ScienceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
