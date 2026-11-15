import type { ReactNode } from "react";

export const inputCls =
  "w-full min-h-11 rounded-lg border border-sand bg-white/70 px-3 py-2 text-[0.95rem] text-cocoa outline-none transition-colors placeholder:text-muted/60 hover:border-gold focus-visible:border-garnet focus-visible:bg-white";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Card({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/60 p-5 md:p-6">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-[1.35rem] font-medium">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "alert" }) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "alert" ? "border-garnet-bright/40 bg-blush/50" : "border-line bg-white/60"}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-[2rem] font-medium leading-none [font-variant-numeric:lining-nums_tabular-nums]">{value}</p>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  yeni: "bg-garnet-bright text-ivory",
  tesdiqlendi: "bg-champagne text-garnet-deep",
  gonderildi: "bg-rose text-garnet-deep",
  catdirildi: "bg-[#dfeee0] text-[#2f5d33]",
  legv: "bg-line text-muted line-through",
};
export const STATUS_LABEL: Record<string, string> = {
  yeni: "Yeni",
  tesdiqlendi: "Təsdiqləndi",
  gonderildi: "Göndərildi",
  catdirildi: "Çatdırıldı",
  legv: "Ləğv edildi",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status] ?? "bg-line"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn" | "error" | "ok"; children: ReactNode }) {
  const cls = {
    info: "border-sand bg-linen",
    warn: "border-gold bg-champagne/40",
    error: "border-garnet-bright/50 bg-blush/60 text-garnet-deep",
    ok: "border-[#9ccb9f] bg-[#e8f4e9] text-[#2f5d33]",
  }[tone];
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>
      {children}
    </p>
  );
}

export const fmt = (n: number) =>
  `${new Intl.NumberFormat("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n).replace(/,/g, " ")} ₼`;

export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
