import type { Metadata } from "next";
import { CartPageView } from "@/components/shop/CartPageView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Səbət" };

export default function CartPage() {
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Səbət" }]} />
      <h1 className="t-h1 mt-8">Səbət</h1>
      <CartPageView />
    </div>
  );
}
