# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 20 frontend for a tennis court reservation system (Tennisclub Havixbeck e.V.). Communicates with a Spring Boot backend running at `localhost:8080`.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (proxies /rest, /login, /logout to :8080)
npm run build      # Production build to dist/ with base-href /angular/
npm test           # Karma/Jasmine unit tests
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
```

To run a single test file, add `--include` to the karma config or use `fdescribe`/`fit` in tests.

## Architecture

### Module Structure

- `src/app/routes.ts` — flat route definitions (no lazy loading)
- `src/app/reservation/` — core booking feature: occupation table, add/modify reservations, my reservations
- `src/app/admin/` — admin area: user management, system config, protocol log, news management
- `src/app/login/` — login component
- `src/app/news/` — public news overview/detail
- `src/app/util/` — shared utilities: `date/`, `table/`, `field-error/`, `show-error/`, `select-filter/`, `theme-toggle/`, `error/`
- `src/app/cors-interceptor.ts` — injects `X-XSRF-TOKEN` header on every HTTP request

All components are standalone (no NgModules).

### Domain Model

- **`ReservationSystemConfig`** — configures one reservation system (courts, hours, duration units, reservation types). Contains helper methods for row/time calculations. Multiple configs can exist; current one is stored in `localStorage`.
- **`SystemConfigReservationType`** — a type within a system config (e.g. "Training", "Match"), with per-type limits and role restrictions.
- **`Reservation`** — a booking with `date`/`start`/`duration` as epoch milliseconds, `courts` as string, and optional repeat fields.
- **`Occupation`** — a single court slot within a reservation (one reservation can span multiple courts → multiple occupations).
- **`User`** — has a `UserRole` enum: `ANONYMOUS`, `REGISTERED`, `KIOSK`, `TRAINER`, `ADMIN`, `TECHNICAL`, `TEAMSTER`, `GUEST`.

### Time Representation

All dates and times are stored as **epoch milliseconds**. `DateUtil` (`src/app/util/date/date-util.ts`) provides helpers. Key convention: `date` holds the day part (midnight), `start` holds the time-of-day offset in millis.

### Occupation Table Rendering

`OccupationTable` extends `TableData<OccupationTableCell>` to build the 2D grid. `TableData` manages rowspan/colspan logic generically. The table has a time-header column (column 0) and one column per court. Cells are either `header`, `occupation`, or `available` entries.

### Forms

Admin forms use typed Angular reactive forms. `systemconfig-form.ts` contains factory functions (`createSystemConfigForm`, `createReservationTypeForm`) and typed form interfaces. ADMIN role checkboxes are always enabled and cannot be unchecked.

### API Endpoints

All REST calls go through the proxy:
- `/rest/reservation` — reservation CRUD
- `/rest/systemconfig` — system config CRUD
- `/rest/user` — user management (via `UserService`)
- `/login`, `/logout` — Spring Security endpoints

### Error Handling

- `tch-show-error` component displays HTTP errors and field-level validation errors
- `tch-field-error` component displays per-field validation messages
- Field errors use `Map<string, string>` keyed by field name

### UI

Bootstrap 5 + ng-bootstrap. Dark/light theme toggled via `ThemeToggleComponent`, persisted in `localStorage` as `theme`, applied as `data-bs-theme` on `<html>`.
