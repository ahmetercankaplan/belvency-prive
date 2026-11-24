"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";

export function Newsletter() {
  const t = useT().home.newsletter;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) return setError(t.errEmpty);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError(t.errInvalid);
    setError("");
    setDone(true);
  };

  return (
    <section className="bg-blush" aria-labelledby="newsletter">
      <div className="container-x grid items-center gap-8 py-14 md:py-20 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="newsletter" className="t-h1 max-w-[14ch]">
            {t.title}
          </h2>
          <p className="t-lead mt-5">{t.lead}</p>
        </div>
        <div>
          {done ? (
            <div role="status" className="border border-gold bg-ivory/60 p-6">
              <p className="t-h3">{t.thanks}</p>
              <p className="mt-2 text-muted">{t.thanksText}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor="nl-email" className="mb-2 block text-sm">
                {t.emailLabel}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="nl-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "nl-err" : "nl-note"}
                  placeholder={t.placeholder}
                  className="field flex-1 bg-ivory/70"
                />
                <button type="submit" className="btn btn-primary">
                  {t.submit}
                </button>
              </div>
              {error ? (
                <p id="nl-err" role="alert" className="mt-2 text-[0.85rem] text-[#a3392f]">
                  {error}
                </p>
              ) : (
                <p id="nl-note" className="mt-2 text-[0.85rem] text-muted">
                  {t.demoNote}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
