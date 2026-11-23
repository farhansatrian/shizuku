# shizuku (雫) — Rainy Cozy Personal Digital Hub & Admin CMS

A serene, minimalist anime-inspired personal digital hub & portfolio built for **Farhan Satria Nugraha** — combining Japanese pastel editorial aesthetics, an interactive pastel OS profile window, Bento workspace, project spec sheets, bilingual **EN | ID** support (EN default), and a full **Admin Studio CMS (`/admin`)** powered by single-container **SQLite (WAL)**.

## Features
- **TUYU × Omutatsu Rainy Cozy Design:** Full-bleed twilight anime hero, drifting raindrop accents, watercolor mist transitions, iconic 3-raindrop full-screen pastel menu drawer, and frosted glass bento cards.
- **Interactive Pastel OS Window (`shizuku_profile.card`):** 4 animated tabs (*Overview*, *Banking & AI*, *Tech Stack*, *Currently*) + cute interactive raindrop umbrella badge.
- **Bilingual (`EN | ID`):** English default with instant switching across static UI and database-managed content.
- **Interactive Admin Studio (`/admin`):** Secure JWT cookie auth (`jose` + `bcryptjs`) to edit profile/hero, create/edit/reorder projects & architecture specs, manage experience/education timeline, upload certificate images, and manage skills — with instant cache revalidation (`revalidatePath`).
- **Single-Container VM Deployment:** Only **1 Docker container** (~180–320 MB RAM) using SQLite WAL + 1 persistent volume (`/app/data`) storing both the database and uploaded images.

## Local Development (Zero Docker Needed)

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the Admin Studio.

## Easy 1-Container VM Deployment

1. Push to `main` — GitHub Actions automatically builds and publishes `ghcr.io/farhansatrian/shizuku:latest`.
2. On your VM, copy `compose.prod.yaml` and `.env.production.example` (rename to `.env.production` and set strong `AUTH_SECRET` & `ADMIN_PASSWORD`).
3. Deploy or update anytime with one command:

```bash
docker compose --env-file .env.production -f compose.prod.yaml pull && \
docker compose --env-file .env.production -f compose.prod.yaml up -d
```

### Backup Everything (DB + Uploaded Media)
All data lives in the single Docker volume `shizuku_data` (`/app/data`):

```bash
docker run --rm -v shizuku_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/shizuku-backup-$(date +%F).tar.gz -C /data .
```
