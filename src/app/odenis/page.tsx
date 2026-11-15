import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/CheckoutView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Sifarişin rəsmiləşdirilməsi" };

export default function CheckoutPage() {
  return (
    <div className="container-x pt-6">
      <Breadcrumbs items={[{ label: "Səbət", href: "/sebet" }, { label: "Ödəniş" }]} />
      <h1 className="t-h1 mt-8">Sifarişin rəsmiləşdirilməsi</h1>
      <CheckoutView />
    </div>
  );
}
