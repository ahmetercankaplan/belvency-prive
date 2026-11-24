import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";

export function AnnouncementBar() {
  return (
    <div className="bg-garnet-deep text-ivory">
      <p className="container-x flex min-h-9 items-center justify-center py-1.5 text-center text-[0.8125rem] tracking-[0.02em]">
        {formatAZN(site.freeDeliveryFrom)} və yuxarı sifarişlərdə çatdırılma pulsuzdur{live ? "" : " · Nümayiş mağazasıdır"}
      </p>
    </div>
  );
}
