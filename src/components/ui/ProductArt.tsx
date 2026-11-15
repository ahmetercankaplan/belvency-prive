import { useId } from "react";
import type { ArtKind, Tone } from "@/lib/types";

/**
 * Hand-built SVG still-life illustrations.
 * They stand in for photography so every asset is consistent, licence-free
 * and never broken. Swap for <Image> photography when real assets exist.
 */

interface ToneDef {
  bg: [string, string];
  arch: string;
  leather: [string, string];
  liquid: string;
  dark: boolean;
}

const TONES: Record<Tone, ToneDef> = {
  blush: { bg: ["#fde4e7", "#f4c2cb"], arch: "#fff1f3", leather: ["#dc8493", "#b25669"], liquid: "#ee93a7", dark: false },
  champagne: { bg: ["#f9ebca", "#efd298"], arch: "#fff6e1", leather: ["#c8964f", "#9a6a2c"], liquid: "#e8b960", dark: false },
  ivory: { bg: ["#fff7f0", "#f5e4d6"], arch: "#fffdfa", leather: ["#d9b99a", "#b8916d"], liquid: "#f3cfae", dark: false },
  taupe: { bg: ["#dcbab3", "#bc8e8a"], arch: "#ebcfc9", leather: ["#9c615c", "#703c3d"], liquid: "#cb8e88", dark: false },
  cocoa: { bg: ["#5e1f37", "#2e0d1a"], arch: "#722c45", leather: ["#cc8c4d", "#925c2d"], liquid: "#d49c5c", dark: true },
  rose: { bg: ["#f5c3cd", "#e39aab"], arch: "#fbdfe5", leather: ["#c6526f", "#983553"], liquid: "#da6c8c", dark: false },
};

/** kinds that hang or float, so a floor shadow would look wrong */
const NO_FLOOR: ArtKind[] = ["necklace", "earrings", "jewelset"];

interface Ctx {
  u: string;
  metal: string;
  t: ToneDef;
}

const R: Record<ArtKind, (c: Ctx) => React.ReactNode> = {
  perfume: ({ u, metal, t }) => (
    <g>
      <rect x="190" y="214" width="20" height="40" rx="3" fill={metal} />
      <rect x="166" y="156" width="68" height="64" rx="8" fill={metal} />
      <rect x="173" y="164" width="9" height="48" rx="4.5" fill="#fff" opacity=".4" />
      <rect x="122" y="250" width="156" height="184" rx="20" fill={`url(#${u}glass)`} stroke="#fff" strokeOpacity=".75" />
      <rect x="132" y="300" width="136" height="124" rx="12" fill={t.liquid} opacity=".85" />
      <rect x="156" y="332" width="88" height="64" rx="3" fill="#faf8f5" opacity=".94" />
      <path d="M191 362v-12a9 9 0 0 1 18 0v12z" fill="#b59a78" />
      <rect x="170" y="372" width="60" height="1.5" fill="#b59a78" opacity=".7" />
      <rect x="178" y="380" width="44" height="1.5" fill="#b59a78" opacity=".5" />
      <rect x="136" y="262" width="9" height="150" rx="4.5" fill="#fff" opacity=".5" />
    </g>
  ),
  ring: ({ u, metal }) => (
    <g>
      <ellipse cx="200" cy="368" rx="78" ry="70" fill="none" stroke={metal} strokeWidth="15" />
      <ellipse cx="200" cy="368" rx="70" ry="62" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      <rect x="184" y="292" width="32" height="14" rx="3" fill={metal} />
      <polygon points="200,226 238,254 200,300 162,254" fill={`url(#${u}gem)`} stroke="#fff" strokeOpacity=".8" strokeWidth="1.5" />
      <polyline points="162,254 238,254" stroke="#fff" strokeOpacity=".7" fill="none" />
      <polyline points="182,254 200,226 218,254 200,300 182,254" stroke="#fff" strokeOpacity=".55" fill="none" />
    </g>
  ),
  necklace: ({ u, metal }) => (
    <g>
      <path d="M96 140C100 330 300 330 304 140" fill="none" stroke={metal} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M96 140C100 330 300 330 304 140" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1" strokeDasharray="2 5" strokeLinecap="round" />
      <circle cx="200" cy="292" r="6" fill="none" stroke={metal} strokeWidth="3" />
      <circle cx="200" cy="330" r="30" fill={`url(#${u}pearl)`} />
      <ellipse cx="190" cy="320" rx="8" ry="5" fill="#fff" opacity=".7" />
    </g>
  ),
  bracelet: ({ metal }) => (
    <g>
      <ellipse cx="200" cy="322" rx="120" ry="66" fill="none" stroke={metal} strokeWidth="14" />
      <ellipse cx="200" cy="322" rx="108" ry="54" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" />
      <path d="M200 372a15 15 0 1 0 10 26a12 12 0 1 1-10-26z" fill={metal} />
      <circle cx="104" cy="332" r="6" fill={metal} />
      <circle cx="296" cy="332" r="6" fill={metal} />
    </g>
  ),
  earrings: ({ u, metal, t }) => (
    <g>
      {[138, 262].map((x) => (
        <g key={x}>
          <circle cx={x} cy="168" r="9" fill={metal} />
          <line x1={x} y1="177" x2={x} y2="232" stroke={metal} strokeWidth="3" />
          <circle cx={x} cy="238" r="5" fill="none" stroke={metal} strokeWidth="2.5" />
          {t.leather[0] === "#b8956a" ? (
            <path d={`M${x} 246C${x + 30} 282 ${x + 30} 322 ${x} 338C${x - 30} 322 ${x - 30} 282 ${x} 246Z`} fill={metal} />
          ) : (
            <>
              <circle cx={x} cy="278" r="30" fill={`url(#${u}pearl)`} />
              <ellipse cx={x - 9} cy="268" rx="8" ry="5" fill="#fff" opacity=".7" />
            </>
          )}
        </g>
      ))}
    </g>
  ),
  jewelset: (c) => (
    <g>
      <g transform="translate(30 6) scale(.85)">{R.necklace(c)}</g>
      <g transform="translate(100 228) scale(.5)">{R.earrings({ ...c, t: { ...c.t, leather: ["#000", "#000"] } })}</g>
    </g>
  ),
  bag: ({ u, t }) => (
    <g>
      <path d="M146 268C138 160 262 160 254 268" fill="none" stroke={t.leather[1]} strokeWidth="9" strokeLinecap="round" />
      <path d="M84 268H316L336 424Q338 438 322 438H78Q62 438 64 424Z" fill={`url(#${u}leather)`} />
      <path d="M84 268H316L306 332Q200 374 94 332Z" fill={t.leather[1]} opacity=".55" />
      <path d="M92 322Q200 364 308 322" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" strokeDasharray="4 5" />
      <circle cx="200" cy="348" r="12" fill={`url(#${u}gold)`} />
      <rect x="90" y="276" width="9" height="150" rx="4.5" fill="#fff" opacity=".14" />
    </g>
  ),
  watch: ({ u, metal, t }) => (
    <g>
      <path d="M170 140H230L224 226H176Z" fill={`url(#${u}leather)`} />
      <path d="M176 354H224L230 440H170Z" fill={`url(#${u}leather)`} />
      <rect x="270" y="292" width="10" height="16" rx="3" fill={metal} />
      <circle cx="200" cy="290" r="76" fill={metal} />
      <circle cx="200" cy="290" r="64" fill={t.dark ? "#211c1a" : "#faf8f5"} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="200"
          y1={i % 3 === 0 ? 234 : 238}
          x2="200"
          y2={i % 3 === 0 ? 246 : 242}
          stroke={t.dark ? "#d8c7ae" : "#7d6644"}
          strokeWidth={i % 3 === 0 ? 3 : 1.5}
          transform={`rotate(${i * 30} 200 290)`}
        />
      ))}
      <line x1="200" y1="290" x2="200" y2="250" stroke={t.dark ? "#f3ece7" : "#342e2c"} strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="290" x2="226" y2="302" stroke={t.dark ? "#f3ece7" : "#342e2c"} strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="290" r="5" fill={metal} />
      <path d="M150 258A62 62 0 0 1 200 226" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  shoe: ({ u }) => (
    <g>
      <path
        d="M80 320C100 318 130 334 168 354C210 376 262 390 318 394C334 396 338 414 318 416C250 422 190 410 150 396L114 440H96L104 388C84 372 76 346 80 320Z"
        fill={`url(#${u}leather)`}
      />
      <path d="M96 336C120 340 150 358 184 376" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" />
      <path d="M150 396C190 410 250 422 318 416" fill="none" stroke="#342e2c" strokeOpacity=".25" strokeWidth="3" />
    </g>
  ),
  lipstick: ({ u, metal }) => (
    <g>
      <rect x="170" y="338" width="60" height="96" rx="5" fill={metal} />
      <rect x="166" y="322" width="68" height="20" rx="3" fill="#342e2c" opacity=".85" />
      <rect x="174" y="288" width="52" height="38" rx="3" fill={metal} />
      <path d="M178 288V240L222 212V288Z" fill={`url(#${u}lip)`} />
      <rect x="178" y="344" width="8" height="84" rx="4" fill="#fff" opacity=".4" />
    </g>
  ),
  palette: ({ metal }) => (
    <g>
      <rect x="104" y="150" width="192" height="100" rx="22" fill={metal} />
      <rect x="116" y="162" width="168" height="76" rx="14" fill="#faf8f5" opacity=".7" />
      <circle cx="200" cy="332" r="108" fill={metal} />
      <circle cx="200" cy="332" r="96" fill="#f7efe9" />
      {[
        [150, 296, "#e8c9bc"],
        [200, 280, "#d9a89e"],
        [250, 296, "#bf8a80"],
        [150, 366, "#e8d6b7"],
        [200, 384, "#c7a36c"],
        [250, 366, "#8b6b5c"],
      ].map(([x, y, f]) => (
        <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r="24" fill={f as string} />
      ))}
    </g>
  ),
  skincare: ({ u, metal, t }) => (
    <g>
      <ellipse cx="153" cy="244" rx="17" ry="34" fill="#f3e9e1" stroke="#d8c7ae" />
      <rect x="136" y="274" width="34" height="26" rx="3" fill={metal} />
      <rect x="116" y="298" width="74" height="136" rx="14" fill={`url(#${u}glass)`} stroke="#fff" strokeOpacity=".75" />
      <rect x="124" y="340" width="58" height="86" rx="8" fill={t.liquid} opacity=".8" />
      <rect x="128" y="306" width="6" height="110" rx="3" fill="#fff" opacity=".5" />
      <rect x="208" y="368" width="98" height="66" rx="12" fill="#fbf6f0" stroke="#e4dad2" />
      <rect x="203" y="336" width="108" height="36" rx="8" fill={metal} />
      <rect x="212" y="342" width="7" height="24" rx="3.5" fill="#fff" opacity=".4" />
    </g>
  ),
  giftbox: ({ u, t }) => (
    <g>
      <rect x="104" y="304" width="192" height="130" rx="6" fill={`url(#${u}leather)`} />
      <rect x="92" y="268" width="216" height="44" rx="6" fill={t.leather[1]} />
      <rect x="187" y="268" width="26" height="166" fill="#f1e6d2" />
      <ellipse cx="166" cy="250" rx="34" ry="19" fill="#f1e6d2" transform="rotate(-18 166 250)" />
      <ellipse cx="234" cy="250" rx="34" ry="19" fill="#ecdfc6" transform="rotate(18 234 250)" />
      <circle cx="200" cy="262" r="12" fill="#e2d1b0" />
    </g>
  ),
  wallet: ({ u, metal }) => (
    <g>
      <rect x="130" y="266" width="132" height="44" rx="4" fill="#faf8f5" opacity=".92" transform="rotate(-6 200 290)" />
      <rect x="92" y="292" width="216" height="134" rx="14" fill={`url(#${u}leather)`} />
      <path d="M92 332H308" stroke="#000" strokeOpacity=".2" />
      <rect x="102" y="302" width="196" height="114" rx="9" fill="none" stroke="#fff" strokeOpacity=".4" strokeDasharray="4 5" />
      <rect x="187" y="324" width="26" height="36" rx="5" fill={metal} />
      <rect x="98" y="300" width="8" height="120" rx="4" fill="#fff" opacity=".12" />
    </g>
  ),
  tie: ({ u }) => (
    <g>
      <path d="M174 124H226L238 180H162Z" fill={`url(#${u}leather)`} />
      <path d="M162 180H238L264 410L200 446L136 410Z" fill={`url(#${u}leather)`} />
      <path d="M162 180H238L264 410L200 446L136 410Z" fill={`url(#${u}stripe)`} />
      <path d="M174 124H226L238 180H162Z" fill="#fff" opacity=".08" />
    </g>
  ),
  sunglasses: ({ u, metal }) => (
    <g>
      <path d="M94 288L56 266M306 288L344 266" stroke={metal} strokeWidth="6" strokeLinecap="round" />
      <path d="M194 292Q200 278 206 292" fill="none" stroke={metal} strokeWidth="6" strokeLinecap="round" />
      <circle cx="146" cy="304" r="52" fill={`url(#${u}lens)`} stroke={metal} strokeWidth="6" />
      <circle cx="254" cy="304" r="52" fill={`url(#${u}lens)`} stroke={metal} strokeWidth="6" />
      <path d="M118 282A34 34 0 0 1 148 262" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
      <path d="M226 282A34 34 0 0 1 256 262" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
};

interface Props {
  kind: ArtKind;
  tone: Tone;
  metal?: "gold" | "silver";
  /**
   * 0 studio · 1 warm alternate · 2 close detail · 3 flat-lay on the opposite tone
   */
  view?: 0 | 1 | 2 | 3;
  label: string;
  className?: string;
  /** hide the arch backdrop (used when art is already inside an arch frame) */
  flat?: boolean;
}

const ALT_TONE: Record<Tone, Tone> = {
  blush: "champagne",
  champagne: "blush",
  ivory: "rose",
  taupe: "ivory",
  cocoa: "taupe",
  rose: "ivory",
};

export function ProductArt({ kind, tone, metal = "gold", view = 0, label, className, flat }: Props) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shownTone: Tone = view === 1 || view === 3 ? ALT_TONE[tone] : tone;
  const t = TONES[shownTone];
  const own = TONES[tone];
  const c: Ctx = { u, metal: `url(#${u}${metal === "silver" ? "silver" : "gold"})`, t: own };

  const transform =
    view === 1
      ? "translate(200 436) scale(1.14) translate(-200 -436)"
      : view === 2
        ? "translate(200 300) scale(1.75) translate(-200 -318)"
        : view === 3
          ? "translate(200 436) scale(.86) translate(-200 -436)"
          : undefined;

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.bg[0]} />
          <stop offset="1" stopColor={t.bg[1]} />
        </linearGradient>
        <linearGradient id={`${u}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0dfb6" />
          <stop offset=".5" stopColor="#c4a67a" />
          <stop offset="1" stopColor="#8e7550" />
        </linearGradient>
        <linearGradient id={`${u}silver`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f4f2" />
          <stop offset=".5" stopColor="#c3bcb6" />
          <stop offset="1" stopColor="#8f8883" />
        </linearGradient>
        <linearGradient id={`${u}glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={`${u}leather`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={own.leather[0]} />
          <stop offset="1" stopColor={own.leather[1]} />
        </linearGradient>
        <linearGradient id={`${u}gem`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#e7eaf0" />
          <stop offset="1" stopColor="#c9cfdb" />
        </linearGradient>
        <linearGradient id={`${u}lip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b5546a" />
          <stop offset="1" stopColor="#7e2f40" />
        </linearGradient>
        <linearGradient id={`${u}lens`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a3f3a" />
          <stop offset="1" stopColor="#1f1a18" />
        </linearGradient>
        <radialGradient id={`${u}pearl`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#f2e8e4" />
          <stop offset="1" stopColor="#d9c9c4" />
        </radialGradient>
        <radialGradient id={`${u}floor`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${u}stripe`} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <rect width="7" height="26" fill="#fff" opacity=".12" />
        </pattern>
        <linearGradient id={`${u}shaft`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#${u}bg)`} />
      {!flat && view !== 2 && (
        <path d="M60 500V210a140 140 0 0 1 280 0V500Z" fill={t.arch} opacity={view === 3 ? 0.55 : 0.8} />
      )}
      {view === 3 && <path d="M0 0H190L330 500H120Z" fill={`url(#${u}shaft)`} />}
      {!NO_FLOOR.includes(kind) && view !== 2 && (
        <ellipse cx="200" cy="438" rx="118" ry="12" fill={`url(#${u}floor)`} />
      )}
      <g transform={transform}>{R[kind](c)}</g>
    </svg>
  );
}
