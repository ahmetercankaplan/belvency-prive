"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface QuizOption {
  value: string;
  label: string;
  hint?: string;
}

export interface QuizQuestionDef {
  id: string;
  title: string;
  options: readonly QuizOption[];
}

export interface QuizContext {
  answers: Record<string, string>;
  restart: () => void;
  /** removes the most recent answer */
  back: () => void;
  /** heading ref so the results view can receive focus */
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}

/** Step-by-step question flow shared by the scent finder and the gift wizard. */
export function QuizFlow({
  questions,
  renderResults,
  progressLabel,
}: {
  questions: readonly QuizQuestionDef[];
  renderResults: (ctx: QuizContext) => ReactNode;
  progressLabel: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  const step = questions.findIndex((q) => answers[q.id] === undefined);
  const done = step === -1;
  const question = done ? null : questions[step];

  // move focus to the new step/result so keyboard and screen-reader users follow along
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const back = () => {
    const last = questions[(done ? questions.length : step) - 1];
    if (!last) return;
    setAnswers((a) => {
      const next = { ...a };
      delete next[last.id];
      return next;
    });
  };
  const restart = () => setAnswers({});

  if (done) return <>{renderResults({ answers, restart, back, headingRef })}</>;

  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted" aria-live="polite">
          Sual {step + 1} / {questions.length}
        </p>
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={step}
          aria-label={progressLabel}
        >
          <div
            className="h-full rounded-full bg-garnet-bright transition-[width] duration-700 ease-[var(--ease-soft)]"
            style={{ width: `${(step / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="t-h1 mt-8 max-w-[22ch] outline-none">
        {question!.title}
      </h2>

      <ul key={question!.id} className="anim-fade mt-10 grid gap-3 sm:grid-cols-2">
        {question!.options.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              onClick={() => setAnswers((a) => ({ ...a, [question!.id]: o.value }))}
              className="group flex min-h-[4.5rem] w-full flex-col justify-center rounded-2xl border border-sand px-6 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-garnet hover:bg-blush/60"
            >
              <span className="font-display text-[1.35rem] font-medium leading-tight">{o.label}</span>
              {o.hint && <span className="mt-0.5 text-sm text-muted">{o.hint}</span>}
            </button>
          </li>
        ))}
      </ul>

      {step > 0 && (
        <button type="button" onClick={back} className="link-u mt-8 text-sm text-muted hover:text-cocoa">
          Geri qayıt
        </button>
      )}
    </div>
  );
}
