"use client";

import Link from "next/link";
import { questions } from "@/data/scent";
import { recommend, type Answers } from "@/lib/scent";
import { ProductCard } from "./ProductCard";
import { QuizFlow } from "./QuizFlow";

export function ScentFinder() {
  return (
    <QuizFlow
      questions={questions}
      progressLabel="Quiz irəliləyişi"
      renderResults={({ answers, restart, back, headingRef }) => {
        const results = recommend(answers as unknown as Answers);
        return (
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
              Sizin üçün seçdiklərimiz
            </h2>
            <p className="mt-3 max-w-[52ch] text-muted">
              Cavablarınıza görə nümayiş kataloqundakı ətirləri sıraladıq. Hər birinin yanında niyə uyğun gəldiyini yazdıq.
            </p>

            {results.length === 0 ? (
              <p className="mt-10">Bu seçimlərə uyğun ətir tapılmadı. Başqa cavablarla yenidən cəhd edin.</p>
            ) : (
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (
                  <li key={r.product.id}>
                    <ProductCard product={r.product} />
                    <p className="mt-4 inline-block rounded-full bg-garnet px-3 py-1 text-[0.78rem] text-ivory">{r.fit}</p>
                    <ul className="mt-3 space-y-1.5 text-[0.9rem] text-muted">
                      {r.reasons.map((reason) => (
                        <li key={reason} className="flex gap-2">
                          <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12 flex flex-wrap gap-3">
              <button type="button" onClick={restart} className="btn btn-primary">
                Yenidən başla
              </button>
              <button type="button" onClick={back} className="btn btn-ghost">
                Son cavabı dəyiş
              </button>
              <Link href="/kataloq/etirler" className="btn btn-ghost">
                Bütün ətirlər
              </Link>
            </div>
            <p className="t-small mt-8 text-muted">
              Nümayiş: ətir profilləri dizayn üçün uydurulub və real ətir təhlili deyil.
            </p>
          </div>
        );
      }}
    />
  );
}
