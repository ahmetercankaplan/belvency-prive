import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/data/site";

const cols = [
  {
    title: "Alış-veriş",
    links: [
      { href: "/qadin", label: "Qadın" },
      { href: "/kisi", label: "Kişi" },
      { href: "/brendler", label: "Brendlər" },
      { href: "/kataloq/yeni-gelenler", label: "Yeni gələnlər" },
      { href: "/kataloq/hediyye-secimleri", label: "Hədiyyə seçimləri" },
      { href: "/etir-tapici", label: "Ətir tapıcı" },
      { href: "/hediyye-sihirbazi", label: "Hədiyyə sihirbazı" },
      { href: "/lookbook", label: "Lookbook" },
    ],
  },
  {
    title: "Kolleksiyalar",
    links: [
      { href: "/kataloq/etirler", label: "Ətirlər" },
      { href: "/kataloq/bilezikler", label: "Qolbaqlar" },
      { href: "/kataloq/cantalar", label: "Çantalar" },
      { href: "/kataloq/saatlar", label: "Saatlar" },
      { href: "/kataloq/ekskluziv-kolleksiya", label: "Eksklüziv kolleksiya" },
    ],
  },
  {
    title: "Hesabım",
    links: [
      { href: "/sevimliler", label: "Sevimlilər" },
      { href: "/sebet", label: "Səbət" },
      { href: "/odenis", label: "Sifarişi rəsmiləşdir" },
      { href: "/haqqimizda", label: "Hekayəmiz" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="on-dark bg-garnet-deep text-ivory">
      <div className="container-x grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-[30ch] font-display text-2xl font-light leading-snug text-champagne">
            {site.tagline}.
          </p>
          <address className="mt-8 space-y-1 text-[0.9rem] not-italic text-ivory/80">
            <p>
              <a href={`tel:${site.supportPhone.replace(/\s/g, "")}`} className="hover:text-champagne">
                {site.supportPhone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.supportEmail}`} className="hover:text-champagne">
                {site.supportEmail}
              </a>
            </p>
            <p>{site.hours}</p>
          </address>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8 md:pl-10">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="font-display text-xl text-champagne">{c.title}</p>
              <ul className="mt-4 space-y-1">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1.5 text-[0.92rem] text-ivory/80 transition-colors hover:text-ivory">
                      {l.label}
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
          <p>© {new Date().getFullYear()} Belvency Privé. Bütün hüquqlar qorunur.</p>
          <p className="max-w-[60ch] md:text-right">
            Bu sayt dizayn nümayişidir: məhsullar, brendlər və qiymətlər uydurmadır, real ödəniş və ya sifariş qəbul edilmir.
            Ana səhifədəki fotoqrafiyalar{" "}
            <a href="https://unsplash.com/license" className="underline underline-offset-4 hover:text-ivory" rel="noopener noreferrer">
              Unsplash lisenziyası
            </a>{" "}
            ilə istifadə olunur.
          </p>
        </div>
      </div>
    </footer>
  );
}
