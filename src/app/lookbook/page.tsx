import type { Metadata } from "next";
import Link from "next/link";
import { LookbookScene, type Spot } from "@/components/shop/LookbookScene";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Price } from "@/components/ui/Price";
import { getBrand } from "@/data/brands";
import { getProduct } from "@/data/products";
import { defaultOption, priceFor } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { live } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Fotoların üzərindəki nöqtələrə toxunun: görünüşə yaxın seçimləri kəşf edin və səbətə əlavə edin.",
};

interface Scene {
  id: string;
  title: string;
  text: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  spots: Spot[];
}

const scenes: Scene[] = [
  {
    id: "qatlar",
    title: "İncə qatlar",
    text: "Boyunbağı, üzük və qolbaq bir-birini tamamlayanda görünüş bitir. Nöqtələrə toxunun, yaxın seçimləri görün.",
    src: "/images/jewelry-model.jpg",
    alt: "Boynunda incə qızıl boyunbağılar, əlində üzüklər və qolbaq taxmış model",
    width: 1400,
    height: 1120,
    spots: [
      { slug: "damla-mirvari-boyunbagi", x: 49, y: 31 },
      { slug: "solitaire-uzuk", x: 41, y: 45 },
      { slug: "horgu-uzuk", x: 63, y: 69 },
      { slug: "ay-isigi-qolbaq", x: 21, y: 88 },
    ],
  },
  {
    id: "inci",
    title: "İnci və iz",
    text: "Mirvarinin yumşaqlığı, qırmızı dodaq boyasının cəsarəti. Axşam üçün sadə, amma yadda qalan cüt.",
    src: "/images/pearls-lipstick.jpg",
    alt: "İnci boyunbağı, qızıl zəncir və dodaq boyası güzgü üzərində, toxunma ağ parçada",
    width: 1400,
    height: 1087,
    spots: [
      { slug: "mirvari-zergerlik-desti", x: 42, y: 66 },
      { slug: "mexmer-dodaq-boyasi", x: 66, y: 27 },
    ],
  },
];

export default function LookbookPage() {
  if (live) notFound();
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Lookbook" }]} />

      <header className="mt-10 max-w-3xl md:mt-14">
        <h1 className="t-h1">Görünüşü tamamlayın</h1>
        <p className="t-lead mt-4">
          Fotoların üzərindəki nöqtələrə toxunun. Hər nöqtə görünüşə yaxın bir kataloq seçimini açır.
        </p>
        <p className="t-small mt-3 text-muted">
          Fotoqrafiyalar nümunə təsvirdir — göstərilən parçalar kataloqdakı məhsullarla eyni deyil, yalnız yaxın seçimlərdir.
        </p>
      </header>

      <div className="mt-14 space-y-24 md:space-y-32">
        {scenes.map((s, i) => (
          <section key={s.id} aria-labelledby={s.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className={`lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
              <LookbookScene
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                spots={s.spots}
                priority={i === 0}
              />
            </div>
            <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
              <h2 id={s.id} className="t-h1">
                {s.title}
              </h2>
              <p className="t-lead mt-4">{s.text}</p>
              <ul className="mt-8 divide-y divide-line border-y border-line" aria-label={`${s.title} — yaxın seçimlər`}>
                {s.spots.map((sp) => {
                  const p = getProduct(sp.slug);
                  if (!p) return null;
                  const pr = priceFor(p, defaultOption(p));
                  return (
                    <li key={sp.slug}>
                      <Link
                        href={`/mehsul/${p.slug}`}
                        className="group flex min-h-16 items-center justify-between gap-4 py-3 transition-[padding] duration-500 hover:pl-3"
                      >
                        <span>
                          <span className="t-small block text-muted">{getBrand(p.brandSlug)?.name}</span>
                          <span className="font-display text-[1.25rem] font-medium">{p.title}</span>
                        </span>
                        <Price price={pr.price} salePrice={pr.salePrice} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
