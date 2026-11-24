import { BestSellers } from "@/components/home/BestSellers";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import {
  BeautyEditorial,
  BrandsStrip,
  CategoryArches,
  GiftGuide,
  Handbags,
  JewelryEditorial,
  MenSection,
  NewArrivals,
  PerfumeEditorial,
  ScentTeaser,
  ServiceStrip,
} from "@/components/home/Sections";
import { productsByTag } from "@/lib/catalog";
import { live } from "@/lib/flags";

export default function HomePage() {
  const best = productsByTag("cox-satilanlar");
  const gap = "mt-20 md:mt-28";

  return (
    <div className="-mb-20 md:-mb-24">
      <Hero />
      <div className={gap}>
        <CategoryArches />
      </div>
      <div className={gap}>
        <NewArrivals />
      </div>
      <div className={gap}>
        <PerfumeEditorial />
      </div>
      {(!live || best.length > 0) && (
        <div className={gap}>
          <BestSellers products={best} />
        </div>
      )}
      <div className={gap}>
        <JewelryEditorial />
      </div>
      <div className={gap}>
        <BeautyEditorial />
      </div>
      <div className={gap}>
        <Handbags />
      </div>
      <div className={gap}>
        <MenSection />
      </div>
      {!live && (
        <div className={gap}>
          <ScentTeaser />
        </div>
      )}
      <div className={gap}>
        <BrandsStrip />
      </div>
      <div className={gap}>
        <GiftGuide />
      </div>
      <div className={gap}>
        <ServiceStrip />
      </div>
      {!live && (
        <div className={gap}>
          <Newsletter />
        </div>
      )}
    </div>
  );
}
