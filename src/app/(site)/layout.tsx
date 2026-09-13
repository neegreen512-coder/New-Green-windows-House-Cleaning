import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteBanner } from "@/components/SiteBanner";

/**
 * Layout for the public marketing pages: promo banner, header, and footer.
 * The owner admin lives outside this route group, so it renders with only the
 * root layout (a bare shell) and none of this chrome. Route groups do not
 * change URLs, so these pages keep serving at "/", "/pricing", etc.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteBanner />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
