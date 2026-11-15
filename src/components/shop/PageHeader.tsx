import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { ProductArt } from "@/components/ui/ProductArt";
import type { ArtKind, Tone } from "@/lib/types";

export function PageHeader({
  crumbs,
  title,
  intro,
  art,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  art?: { kind: ArtKind; tone: Tone; metal?: "gold" | "silver" };
  children?: ReactNode;
}) {
  return (
    <section className="bg-linen">
      <div className="container-x grid items-end gap-8 pb-0 pt-6 md:grid-cols-[1fr_auto] md:pt-8">
        <div className="pb-10 md:pb-14">
          <Breadcrumbs items={crumbs} />
          <h1 className="t-h1 mt-8 max-w-[16ch] md:mt-12">{title}</h1>
          {intro && <p className="t-lead mt-4">{intro}</p>}
          {children}
        </div>
        {art && (
          <div className="arch hidden w-44 md:block lg:w-56">
            <ProductArt kind={art.kind} tone={art.tone} metal={art.metal} label="" flat className="aspect-[3/4] w-full" />
          </div>
        )}
      </div>
    </section>
  );
}
