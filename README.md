<div align="center">

# shizuku (雫) — Next.js + Prisma Edition

**Minimalist personal digital hub, portfolio CMS, and central `SHIZUKU ID` identity & database hub built with Next.js, Prisma, and SQLite (WAL).**

[![Live Hub](https://img.shields.io/badge/Live_Hub-shizuku.sitezet.com-745bc7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://shizuku.sitezet.com)
[![SHIKAS App](https://img.shields.io/badge/Companion_App-shikas.sitezet.com-2276a8?style=for-the-badge&logo=vercel&logoColor=white)](https://shikas.sitezet.com)
[![PHP Production Edition](https://img.shields.io/badge/Shared_Hosting_Edition-shizuku--php-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://github.com/farhansatrian/shizuku-php)

</div>

> **Live Production Note:** The live site at **[shizuku.sitezet.com](https://shizuku.sitezet.com)** currently runs the zero-dependency PHP edition ([`farhansatrian/shizuku-php`](https://github.com/farhansatrian/shizuku-php)) for lightweight shared hosting, while maintaining 100% UI/UX and API parity with this **Next.js + Prisma + Docker** edition (ideal for VPS / single-container deployments).

---

## Live Ecosystem

| App | Role | Live URL | Repository |
| :--- | :--- | :--- | :--- |
| **SHIZUKU (雫)** | Personal Hub, Portfolio CMS & `SHIZUKU ID` Hub *(PHP Prod)* | **[shizuku.sitezet.com](https://shizuku.sitezet.com)** | [`farhansatrian/shizuku-php`](https://github.com/farhansatrian/shizuku-php) |
| **SHIZUKU (Next.js)** | Full-Stack Next.js + Prisma + Docker Edition | — | [`farhansatrian/shizuku`](https://github.com/farhansatrian/shizuku) *(this repo)* |
| **SHIKAS (雫)** | Personal Cashflow, Multi-Pocket & Payday Cycle Tracker | **[shikas.sitezet.com](https://shikas.sitezet.com)** | [`farhansatrian/shikas`](https://github.com/farhansatrian/shikas) |

---

## Key Features

- **Minimalist Japanese Pastel Editorial UI** — Watercolor backdrop, subtle drifting raindrop accents, first-visit splash screen, responsive mobile drawer, and instant **Bilingual (`EN | ID`)** switching.
- **Public Hub & Portfolio Pages** — Home gallery (`/`), Ecosystem Work Hub (`/work`), CV Portfolio with parent-grouped organizations & certificate lightbox (`/portfolio`), About (`/about`), and `SHIZUKU ID` Account portal (`/account`).
- **5-Tab Admin Studio (`/admin`)** — Secure JWT cookie auth (`jose` + `bcryptjs`) to manage Profile, Work apps, Portfolio experiences, Certificates (with image upload & ordering), and Security credentials.
- **Central `SHIZUKU ID` SSO & `SHIKAS` v5 Cloud Sync** — Email/Password + **Sign in with Google (OAuth 2.0 + PKCE)**, cross-subdomain cookie & Bearer JWT support, and strict per-user SQLite sync endpoints (`/api/ecosystem/*` and `/api/shikas/store`).
- **Single-Container Docker Deployment** — Runs in 1 lightweight container (`SQLite WAL` + 1 persistent volume `/app/data` for DB and uploaded media).

---

## Local Development (Zero Docker Needed)

```bash
git clone https://github.com/farhansatrian/shizuku.git
cd shizuku
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** for the public site and **`/admin`** for the Admin Studio.

---

## 1-Container VPS Deployment (Docker)

1. Push to `main` — GitHub Actions builds and publishes `ghcr.io/farhansatrian/shizuku:latest`.
2. On your VPS, copy `compose.prod.yaml` and `.env.production.example` → `.env.production`, then configure:
   - `PUBLIC_BASE_URL="https://shizuku.sitezet.com"`
   - `ECOSYSTEM_ALLOWED_ORIGINS="https://shikas.sitezet.com"`
   - `ECOSYSTEM_COOKIE_DOMAIN=".sitezet.com"` (optional for shared parent domain SSO)
   - `AUTH_SECRET`, `ADMIN_PASSWORD`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`
3. Pull and launch:
   ```bash
   docker compose --env-file .env.production -f compose.prod.yaml pull && \
   docker compose --env-file .env.production -f compose.prod.yaml up -d
   ```

### Backup Everything (DB + Uploaded Media)
All persistent state lives in the single Docker volume `shizuku_data` (`/app/data`):

```bash
docker run --rm -v shizuku_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/shizuku-backup-$(date +%F).tar.gz -C /data .
```

---

<div align="center">
  Built by <a href="https://shizuku.sitezet.com">Farhan Satria Nugraha</a> · Part of the <strong>SHIZUKU (雫)</strong> Ecosystem
</div>
