# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build → build/
npm run build:dev  # Development build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

## Architecture

React 18 + Vite SPA using HashRouter. Built on Meituan's NoCode platform with custom Vite plugins (`@meituan-nocode/*`).

**Routing**: All routes defined in `src/nav-items.jsx` — add new pages there and in `src/pages/`.

**Data layer**: TanStack React Query + Supabase. All database queries live in `src/hooks/useMerchantData.js` as nested hooks returned from a single `useMerchantData()` factory. The main table is `merchant_rankings` in Supabase.

**External APIs** (keys hardcoded in source):
- Supabase: `src/integrations/supabase/client.js`
- Amap (高德地图): `src/services/amapService.js` — POI search, geocoding, nearby search
- DeepSeek AI: `src/services/travelService.js` — streaming travel suggestions

**Client-side state**: `useCart()` hook persists cart to localStorage. Favorites also stored in localStorage.

**UI components**: Radix UI primitives wrapped in `src/components/ui/`. Use `cn()` from `src/lib/utils.js` for conditional class merging.

**Path alias**: `@` maps to `./src`.

## Key Config

- Dev server port: **8080** (not the Vite default 5173)
- Build output: `build/` (can be `build/<CHAT_VARIABLE>` in production)
- Dark mode: class-based via `next-themes`
- Database migrations: `src/supabase/migrations/`
- DB population script: `src/scripts/populateDatabase.js` (syncs Amap POIs to Supabase)
