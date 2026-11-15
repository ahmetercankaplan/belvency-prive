# Belvency Privé

Azərbaycan bazarı üçün seçilmiş lüks butik: ətir, zərgərlik, çanta, saat və aksesuar.
Next.js (App Router) + TypeScript + Tailwind. Mağaza statik yayımlanır, sifariş və idarə paneli
Netlify Functions üzərində işləyir (məlumatlar Netlify Blobs-da saxlanılır).

## Qovluqlar

| Yol | Nə var |
|---|---|
| `src/app` | Mağaza səhifələri və `/admin` idarə paneli |
| `src/components`, `src/lib`, `src/data` | Komponentlər, paylaşılan məntiq, nümayiş kataloqu |
| `server/` | API məntiqi (sifariş, stok, giriş, məhsul idarəsi), testləri ilə |
| `netlify/functions/api.mts` | `/api/*` üçün Netlify funksiyası |
| `scripts/` | Yerli API, parol hash-ı, statik ixrac düzəlişi |

## Yerli işə salma

```bash
npm install
cp .env.example .env.local     # dəyərləri doldurun (ADMIN_PASSWORD_HASH, SESSION_SECRET ...)
npm run admin:hash -- "uzun parolunuz"   # çıxışı ADMIN_PASSWORD_HASH-a yazın
npm run dev:api                # 1-ci terminal: yerli API (http://localhost:8888)
npm run dev                    # 2-ci terminal: sayt (http://localhost:3000, panel: /admin)
```

`API_PROXY=http://localhost:8888` yalnız yerli inkişaf üçündür (`.env.local`-a yazın).

## Testlər

```bash
npm run test:server    # API: giriş, doğrulama, sifariş, stok, ikiqat satışın qarşısı
npm run lint
npx tsc --noEmit
```

## Netlify

`netlify.toml` hazırdır: `STATIC_EXPORT=1` ilə `out/` qovluğu dərc olunur, funksiyalar `netlify/functions`-dan gəlir.
Mühit dəyişənləri üçün `.env.example` faylına baxın. **Sayt `NEXT_PUBLIC_INDEXABLE=1` verilənə qədər
axtarış sistemlərinə bağlıdır.**

Yerli Netlify sınağı (statik sayt + funksiya + Blobs): `npm run build` sonra `netlify dev --offline --dir out`.

## Təhlükəsizlik qeydləri

- Sifarişdə qiymət, stok və çatdırılma haqqı server tərəfdə hesablanır; brauzerdən gələn dəyərlərə etibar edilmir.
- Gizli dəyərləri (`.env.local`, token, parol) heç vaxt Git-ə əlavə etməyin.
- Nümayiş kataloqu və brendlər uydurmadır; real satışdan əvvəl real məhsullarla əvəz olunmalıdır.
