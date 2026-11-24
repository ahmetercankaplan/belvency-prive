import Link from "@/i18n/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/data/site";
import { live } from "@/lib/flags";
import { getDict } from "@/i18n/dict";
import { fmt, type Locale } from "@/i18n/config";
import { sellerHours } from "@/data/legal";

export function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale).chrome;
  const l = d.footer.links;
  const cols = [
    {
      title: d.footer.cols.shop,
      links: [
        { href: "/qadin", label: l.women },
        { href: "/kisi", label: l.men },
        { href: "/brendler", label: l.brands },
        { href: "/kataloq/yeni-gelenler", label: l.newArrivals },
        { href: "/kataloq/hediyye-secimleri", label: l.giftPicks },
        { href: "/hediyye-sihirbazi", label: l.giftWizard },
        ...(live ? [] : [{ href: "/etir-tapici", label: l.scentFinder }, { href: "/lookbook", label: l.lookbook }]),
      ],
    },
    {
      title: d.footer.cols.collections,
      links: [
        { href: "/kataloq/etirler", label: l.perfumes },
        { href: "/kataloq/bilezikler", label: l.bracelets },
        { href: "/kataloq/cantalar", label: l.bags },
        { href: "/kataloq/saatlar", label: l.watches },
        { href: "/kataloq/ekskluziv-kolleksiya", label: l.exclusive },
      ],
    },
    {
      title: d.footer.cols.info,
      links: [
        { href: "/catdirilma", label: l.delivery },
        { href: "/qaytarma", label: l.returns },
        { href: "/sertler", label: l.terms },
        { href: "/mexfilik", label: l.privacy },
        { href: "/elaqe", label: l.contact },
      ],
    },
    {
      title: d.footer.cols.account,
      links: [
        { href: "/sevimliler", label: l.wishlist },
        { href: "/sebet", label: l.cart },
        { href: "/odenis", label: l.checkout },
        { href: "/haqqimizda", label: l.about },
      ],
    },
  ];

  return (
    <footer className="on-dark bg-garnet-deep text-ivory">
      <div className="container-x grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-[30ch] font-display text-2xl font-light leading-snug text-champagne">
            {fmt(d.footer.taglineDot, { tagline: d.tagline })}
          </p>
          <address className="mt-8 space-y-1 text-[0.9rem] not-italic text-ivory/80">
            {site.supportPhone && (
              <p>
                <a href={`tel:${site.supportPhone.replace(/\s/g, "")}`} className="hover:text-champagne">
                  {site.supportPhone}
                </a>
              </p>
            )}
            {site.supportEmail && (
              <p>
                <a href={`mailto:${site.supportEmail}`} className="hover:text-champagne">
                  {site.supportEmail}
                </a>
              </p>
            )}
            <p>{sellerHours(locale)}</p>
          </address>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8 md:pl-10">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="font-display text-xl text-champagne">{c.title}</p>
              <ul className="mt-4 space-y-1">
                {c.links.map((x) => (
                  <li key={x.href}>
                    <Link href={x.href} className="inline-block py-1.5 text-[0.92rem] text-ivory/80 transition-colors hover:text-ivory">
                      {x.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-x flex flex-col gap-3 py-6 text-[0.8rem] text-ivory/65 md:flex-row md:items-center md:justify-between">
          <p>{fmt(d.footer.rights, { year: new Date().getFullYear() })}</p>
          <p className="max-w-[60ch] md:text-right">
            {!live && d.footer.demo}
            {d.footer.photosBefore}
            <a href="https://unsplash.com/license" className="underline underline-offset-4 hover:text-ivory" rel="noopener noreferrer">
              {d.footer.photosLink}
            </a>
            {d.footer.photosAfter}
          </p>
        </div>
      </div>
    </footer>
  );
}
