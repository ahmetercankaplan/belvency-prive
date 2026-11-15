"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v) return setError("E-poçt ünvanını yazın");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError("E-poçt ünvanı düzgün deyil");
    setError("");
    setDone(true);
  };

  return (
    <section className="bg-blush" aria-labelledby="newsletter">
      <div className="container-x grid items-center gap-8 py-14 md:py-20 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="newsletter" className="t-h1 max-w-[14ch]">
            Yeniliklərdən birinci siz xəbər tutun
          </h2>
          <p className="t-lead mt-5">Yeni kolleksiyalar və xüsusi təkliflər haqqında ayda bir dəfə yazırıq.</p>
        </div>
        <div>
          {done ? (
            <div role="status" className="border border-gold bg-ivory/60 p-6">
              <p className="t-h3">Təşəkkür edirik!</p>
              <p className="mt-2 text-muted">Abunəlik nümayiş rejimində qeyd olundu — həqiqətdə e-poçt göndərilməyəcək.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor="nl-email" className="mb-2 block text-sm">
                E-poçt ünvanınız
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
                  placeholder="ad@numune.az"
                  className="field flex-1 bg-ivory/70"
                />
                <button type="submit" className="btn btn-primary">
                  Abunə ol
                </button>
              </div>
              {error ? (
                <p id="nl-err" role="alert" className="mt-2 text-[0.85rem] text-[#a3392f]">
                  {error}
                </p>
              ) : (
                <p id="nl-note" className="mt-2 text-[0.85rem] text-muted">
                  Nümayiş rejimi: ünvan heç yerə göndərilmir.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
