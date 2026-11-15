import type { Metadata } from "next";
import { Suspense } from "react";
import { WishlistView } from "@/components/shop/WishlistView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Sevimlilər" };

export default function WishlistPage() {
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Sevimlilər" }]} />
      <h1 className="t-h1 mt-8">Sevimlilər</h1>
      <Suspense fallback={null}>
        <WishlistView />
      </Suspense>
    </div>
  );
}
