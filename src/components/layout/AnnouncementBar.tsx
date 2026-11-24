import { site } from "@/data/site";
import { formatAZN } from "@/lib/format";
import { live } from "@/lib/flags";
import { getDict } from "@/i18n/dict";
import { fmt, type Locale } from "@/i18n/config";

export function AnnouncementBar({ locale }: { locale: Locale }) {
  const d = getDict(locale).chrome.announce;
  return (
    <div className="bg-garnet-deep text-ivory">
      <p className="container-x flex min-h-9 items-center justify-center py-1.5 text-center text-[0.8125rem] tracking-[0.02em]">
        {fmt(d.freeFrom, { amount: formatAZN(site.freeDeliveryFrom) })}
        {live ? "" : d.demo}
      </p>
    </div>
  );
}
