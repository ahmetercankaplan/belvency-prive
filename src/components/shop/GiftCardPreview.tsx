import { site } from "@/data/site";
import { ArchMark } from "@/components/ui/Logo";

/** The handwritten card, drawn as a small arch-topped note. */
export function GiftCardPreview({ message }: { message: string }) {
  const text = message.trim();
  return (
    <figure
      className="relative mx-auto flex aspect-[3/4] w-full max-w-[13.5rem] flex-col items-center rounded-t-[7rem] border border-gold/70 bg-ivory px-6 pb-6 pt-14 text-center shadow-[0_22px_40px_-22px_rgba(74,14,34,0.55)]"
      aria-label="Hədiyyə kartının önizləməsi"
    >
      <span className="absolute inset-[7px] rounded-t-[6.6rem] border border-gold/35" aria-hidden="true" />
      <ArchMark className="relative h-6 w-6 text-gold" />
      <blockquote className="relative mt-4 flex flex-1 items-center">
        <p className={`font-display text-[1.05rem] italic leading-snug ${text ? "text-garnet-deep" : "text-muted/70"}`}>
          {text || "Mesajınız burada görünəcək"}
        </p>
      </blockquote>
      <figcaption className="relative mt-3 text-[0.62rem] tracking-[0.28em] text-gold-deep">{site.name}</figcaption>
    </figure>
  );
}
