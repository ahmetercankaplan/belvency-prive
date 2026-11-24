import type { Metadata } from "next";
import Link from "next/link";
import { ArchMark } from "@/components/ui/Logo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductArt } from "@/components/ui/ProductArt";
import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Hekayəmiz",
  description: "Belvency Privé: seçilmiş məhsullar, açıq qiymətlər və hədiyyəyə qayğı üzərində qurulmuş butik.",
};

const principles = [
  {
    title: "Az, amma seçilmiş",
    text: "Kolleksiyanı kiçik saxlayırıq. Hər məhsul kataloqa girməzdən əvvəl ətir, zərgərlik, çanta və ya aksesuar kimi öz yerini haqq edir.",
  },
  {
    title: "Açıq qiymət və şərtlər",
    text: `Gizli xərc yoxdur. Çatdırılma haqqı, ${formatAZN(site.freeDeliveryFrom)} və yuxarı sifarişlərdə pulsuz çatdırılma və qablaşdırma haqqı səbətdə aydın göstərilir.`,
  },
  {
    title: "Hədiyyəyə qayğı",
    text: "Hədiyyə qablaşdırması və əl yazısı kart mesajı hər sifarişə əlavə oluna bilər. Kartda qiymət yazılmır.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Hekayəmiz" }]} />

      <section className="mt-10 grid items-center gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="t-h1 max-w-[16ch]">Seçilmiş olanın evi</h1>
          <p className="t-lead mt-6 !max-w-[46ch]">
            Privé fransız sözüdür və “özəl, seçilmiş” deməkdir. {site.fullName} də elə belə bir yerdir: çox şey göstərmirik,
            göstərdiyimizi isə diqqətlə seçirik.
          </p>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">
            Loqomuzdakı kemer evin pəncərəsidir. Hər kolleksiyanı, hər fotonu və hər düyməni də bu pəncərənin içindən
            baxırmış kimi qururuq: sakit, aydın və tələsdirmədən.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="arch-ring mx-auto w-[min(100%,22rem)]">
            <div className="arch">
              <ProductArt kind="perfume" tone="blush" label="Kemer içində ətir şüşəsi" flat className="aspect-[3/4.2] w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 md:mt-32" aria-labelledby="principles">
        <h2 id="principles" className="t-h2">
          Üç söz verdiyimiz şey
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {principles.map((p) => (
            <li key={p.title} className="border-t border-gold/60 pt-6">
              <ArchMark className="h-8 w-8 text-garnet-bright" />
              <h3 className="t-h3 mt-4">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {!live && (
      <section className="mt-24 bg-linen px-6 py-10 md:mt-32 md:px-12 md:py-14" aria-labelledby="demo">
        <h2 id="demo" className="t-h3">
          Bu sayt dizayn nümayişidir
        </h2>
        <p className="mt-3 max-w-[64ch] leading-relaxed text-muted">
          Məhsullar, brendlər, qiymətlər və stok məlumatları dizayn üçün uydurulub; real sifariş və ödəniş qəbul edilmir.
          Ana səhifə və lookbook-dakı fotoqrafiyalar Unsplash lisenziyası ilə istifadə olunur. Ətir və hədiyyə tövsiyələri
          nümayiş üçün hazırlanmış profillərə əsaslanır.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/kataloq" className="btn btn-primary">
            Kolleksiyaya bax
          </Link>
          <Link href="/lookbook" className="btn btn-ghost">
            Lookbook
          </Link>
        </div>
      </section>
      )}
    </div>
  );
}
