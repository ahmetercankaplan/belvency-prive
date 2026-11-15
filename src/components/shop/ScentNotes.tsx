/** Fragrance pyramid drawn as one arch cut into three bands: top, heart, base. */
const TIERS = [
  { key: "top", label: "Üst notlar", hint: "İlk dəqiqələrdə hiss olunur", band: "bg-champagne" },
  { key: "heart", label: "Ürək notları", hint: "Ətrin əsas xarakteri", band: "bg-rose" },
  { key: "base", label: "Baza notları", hint: "Dəridə uzun qalan iz", band: "bg-garnet" },
] as const;

export function ScentNotes({ top, heart, base }: { top: string; heart: string; base: string }) {
  const values = { top, heart, base };
  return (
    <ol aria-label="Ətir notları">
      {TIERS.map((t, i) => (
        <li key={t.key} className="flex gap-5">
          <span
            aria-hidden="true"
            className={`w-24 shrink-0 border-t border-ivory/80 ${t.band} ${i === 0 ? "min-h-[6.5rem] rounded-t-[3rem] border-t-0" : "min-h-[5rem]"}`}
          />
          <div className="flex flex-col justify-center py-3">
            <p className="font-display text-[1.15rem] font-medium leading-tight text-cocoa">{t.label}</p>
            <p className="text-xs text-muted">{t.hint}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {values[t.key].split(",").map((n) => (
                <li key={n} className="rounded-full border border-sand px-3 py-0.5 text-[0.8rem] text-cocoa">
                  {n.trim()}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
