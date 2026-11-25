<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## SHIZUKU Ecosystem Contract (Shared with `shikas` & Future Apps)

This repository (`shizuku`) serves as the **central identity & database hub** for the SHIZUKU ecosystem (including `../personal-cashflow` / `shikas` and future companion apps).

### Do Not Break or Delete When Editing Portfolio UI/CMS
1. **Prisma Models (`prisma/schema.prisma`)**: Keep `EcosystemUser`, `ShikasTransaction` (`@@id([userId, id])`, including `accountId`, `toAccountId`, `feeIdr`), and `ShikasSettings` (including `accountsJson`) intact. Never run `db:reset` against production data.
2. **Prisma Dev Delegate Check (`src/lib/db.ts`)**: Keep `ecosystemUser`, `shikasTransaction`, and `shikasSettings` in `hasAllDelegates`.
3. **Ecosystem Auth Library (`src/lib/ecosystem-auth.ts`)**:
   - Uses cookie `shizuku_eco_session` (completely separate from `/admin`'s `shizuku_admin_session`) and supports `Authorization: Bearer <token>`.
   - Respects `ECOSYSTEM_ALLOWED_ORIGINS` (CORS) and optional `ECOSYSTEM_COOKIE_DOMAIN` (cross-subdomain SSO).
4. **Stable API Endpoints & Response Shapes**:
   - `POST /api/ecosystem/register` → `{ email, displayName?, password }` ⇒ `201 { user, token }` (errors: `INVALID_EMAIL`, `SHORT_PASSWORD`, `EMAIL_EXISTS`)
   - `POST /api/ecosystem/login` → `{ email, password }` ⇒ `200 { user, token }` (errors: `ACCOUNT_NOT_FOUND`, `INVALID_CREDENTIALS`)
   - `POST /api/ecosystem/logout` ⇒ `200 { ok: true }`
   - `GET /api/ecosystem/me` ⇒ `200 { user | null }`
   - `GET /api/ecosystem/google?redirect=<internal_path_or_allowed_origin_url>` & `GET /api/ecosystem/google/callback` → Google OAuth 2.0 + PKCE SSO; sets `shizuku_eco_session` cookie and, when redirecting to an allowlisted external companion app (e.g. `shikas`), appends `#shizuku_token=<jwt>` in the URL fragment for Bearer storage.
   - `GET /api/shikas/store` & `PUT /api/shikas/store` → strict per-`userId` isolation (`401` if unauthenticated); v5 payload stores `accounts[]` (`ShikasSettings.accountsJson`) and `transactions[]` supporting `income | expense | transfer`, `accountId`, `toAccountId`, and `feeIdr`.

### Production Deploy Checklist (VM 1 GB RAM)
- Set `ECOSYSTEM_ALLOWED_ORIGINS="https://shikas.yourdomain.dev"` (comma-separated for multiple apps) in `shizuku`'s `.env.production`.
- Optionally set `ECOSYSTEM_COOKIE_DOMAIN=".yourdomain.dev"` if all apps share a parent domain.
- Set `PUBLIC_BASE_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in `shizuku`'s `.env.production` for Sign in with Google across all ecosystem apps.
- In `shikas` GitHub repo variables, set `VITE_SHIZUKU_URL` and `VITE_SHIZUKU_API_URL` to `shizuku`'s live public URL.

