# e-Layanan BAPPERIDA

A government e-services portal for BAPPERIDA (Regional Research and Development Planning Agency) of Central Kalimantan Province.

## Overview

This is a pure frontend React + Vite + TypeScript application. It provides digital forms for:
- Research permit applications (Permohonan Surat Izin Penelitian)
- Satisfaction survey (Survei Kepuasan)
- Final research report submission (Laporan Akhir)
- Checking application status (Cek Status Permohonan)

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios (with mock fallback)
- **State**: TanStack React Query
- **i18n**: Custom i18n context (Indonesian/English)

## Architecture

- `src/pages/` — Page components for each route
- `src/components/` — Shared UI components (AppShell, FormStepper, etc.)
- `src/lib/` — Core logic: API client, form definitions, i18n, schema builder
- `src/hooks/` — Custom hooks (draft saving, mobile detection, toast)
- `src/types/` — TypeScript types

## API / Backend

The app can connect to a real backend via `VITE_API_BASE_URL` environment variable. When this is unset, points to localhost, or points to 127.0.0.1, the app uses built-in **mock API** (`src/lib/mock-api.ts`) for all operations. This allows full development and testing without a backend.

## Running

The app runs on **port 5000** via `npm run dev`. Configured as a Replit workflow named "Start application".

## Key Configuration

- `vite.config.ts` — Vite config: host `0.0.0.0`, port `5000`, `allowedHosts: true` for Replit proxy compatibility
- `src/lib/api.ts` — API layer with mock fallback logic
- `tailwind.config.ts` — Custom design tokens
- `components.json` — shadcn/ui configuration
