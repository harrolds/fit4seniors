# FIT4SENIORS — FASE 0 BUILDPLAN

## A. SSOT-lock
- **Code-SSOT:** huidige uitgepakte repo (`fit4seniors`), geen externe aannames.
- **Design-SSOT:** alleen `docs/design-ssot/html/*.html` (leidend) met bijhorende PNG’s ter visuele bevestiging (`docs/design-ssot/png/*.png`). HTML is read-only specificatie, geen runtime-code.
- **Borging:** elke implementatiestap koppelen aan een genoemd HTML-bestand; ontbrekende routes/templates eerst vastleggen in plannen/ tickets, niet “bedenken”. Panel- en module-registries pas vullen na expliciete mapping naar designpagina’s. Geen wijzigingen aan bestaande code in deze fase.

## B. Repo-inventaris
- **Hoofdstructuur:** `src/core` (shell, router, panels, settings, offline, theme), `src/config` (appConfig, navigation, moduleRegistry, homeWidgets, panels, pwa), `src/shared` (navigation, panels, storage, notifications, i18n, ui), `src/styles/layout.css`, `src/seed/fit4seniors.catalog.seed.v1.json`.
- **Shell:** `src/core/AppShell.tsx` (header/footer/main, offline fallback, panel + notifications hosts), `AppFooter.tsx` (bottom nav).
- **Router:** `src/core/router/AppRoutes.tsx`.
- **Panels:** infra in `src/core/panels/*`, registry `src/config/panels.tsx` (leeg).
- **Modules/widgets:** registry `src/config/moduleRegistry.ts` (leeg), widgets `src/config/homeWidgets.ts` (leeg), host `src/core/home/WidgetHost.tsx`.
- **Configuratie:** `src/config/appConfig.ts` (branding + footerMenu), `navigation.ts` (screen config lookup), `pwa/config.ts` (PWA options).

## C. Routing-inventaris
- **Bestaand in code:** `/` (HomeScreen), `/notifications`, `/settings` (index → GlobalSettingsScreen, `:moduleId` → ModuleSettingsScreen), dynamisch `module.routeBase` uit `moduleRegistry` (momenteel geen entries), `/offline`, fallback `* → /`.
- **Design maar niet aanwezig als route:** `traininghub`, `cardio-module-landing`, `cardio-training-list`, `training-detailpage`, `dedicated-session`, `completion`, `geschiedenis`/`history-detail`, `voortgang`, `meer`, `info-and-help`, `profiel-overview`, `profile-edit`, `notifications-setting`, `settings-overview`, `settings-detail`, `bottomsheet`, `bottomtoast`, `rightpanel`. Deze vereisen nieuwe routes/screens of panels voordat implementatie start.

## D. Shell-inventaris
- **Header:** dynamische titel uit `getScreenConfigByPath`; acties samengesteld uit screenConfig + module headerActions; handlers in `headerActionRegistry`.
- **Footer/bottom nav:** `AppFooter` rendert `footerMenu` (home/notifications/settings) met themakleuren uit ThemeProvider.
- **Panels:** `PanelHost` + `PanelProvider`; registry leeg (`panelRegistry`), ondersteunt types left/right/bottom (BottomSheet) uit `src/core/panels`.
- **Notifications:** `NotificationsHost` vast in shell.
- **Offline:** `navigator.onLine` watcher; toont `OfflineScreen` bij offline.
- **Interactiepunten:** declaratieve header-actions (navigate/panel/custom), bottom sheet open via `openBottomSheet`; goBack/openNotifications/openSettings helpers via `useNavigation`.

## E. Theme & CSS-inventaris
- **Bepalende CSS:** `src/styles/layout.css` (globale layout, header/footer positioning, widget grid, settings layout, notifications host, panel surfaces). Gebruikt CSS custom properties (`--color-*`, `--radius-*`, `--font-size-*`) die via theming moeten worden gezet.
- **Theme-laag:** tokens en providers in `src/core/theme/*` (`themeContract`, `ThemeProvider`, `themes`, `tokens`). Header/nav kleuren komen uit `ThemeProvider.components`.
- **Toekomstige theme-injectie:** centrale plek in `ThemeProvider` + CSS custom properties; layout.css verwacht bestaande vars, dus nieuwe thema’s via tokens of root-variabelen, niet inline.

## F. Storage & Offline
- **Storage:** `src/shared/lib/storage/index.ts` wrapper rond `localStorage` met prefix `pwa-skeleton`. Functies `getValue/setValue`, `getItems/setItems/clearItems`, veilige fallback bij onbeschikbaarheid/parsing-fouten. Geen async/IndexedDB.
- **Offline gedrag:** alleen UI-fallback (`OfflineScreen`) op basis van online-events; geen sync/caching buiten standaard PWA (VitePWA). Geen retry-queue of background sync aanwezig.

## G. Design mapping sheet
| HTML-bestand | Beoogde route (design) | Template-naam | Hoofdcomponent (code) |
| --- | --- | --- | --- |
| home.html | `/` | Home / dashboard | `HomeScreen` (AppRoutes) |
| traininghub.html | n.t.b. (design “Training Hub”) | Training hub | ontbreekt |
| cardio-module-landing.html | n.t.b. (Cardio landingspagina) | Cardio landing | ontbreekt |
| cardio-training-list.html | n.t.b. (Cardio lijst) | Training lijst | ontbreekt |
| training-detailpage.html | n.t.b. (Training detail) | Training detail | ontbreekt |
| dedicated-session.html | n.t.b. (Sessiescherm brein) | Dedicated sessie | ontbreekt |
| completion.html | n.t.b. (Voltooid) | Completion | ontbreekt |
| geschiedenis.html | n.t.b. (Geschiedenis) | History list | ontbreekt |
| history-detail.html | n.t.b. (History detail) | History detail | ontbreekt |
| voortgang.html | n.t.b. (Progress) | Progress | ontbreekt |
| meer.html | n.t.b. (Meer) | More menu | ontbreekt |
| info-and-help.html | n.t.b. (Info & hulp) | Info/help | ontbreekt |
| profiel-overview.html | n.t.b. (Profiel) | Profile overview | ontbreekt |
| profile-edit.html | n.t.b. (Profiel bewerken) | Profile edit | ontbreekt |
| notifications-setting.html | n.t.b. (Herinneringen) | Notifications settings | ontbreekt |
| settings-overview.html | n.t.b. (Instellingen hub) | Settings overview | ontbreekt |
| settings-detail.html | n.t.b. (Tekst/contrast detail) | Settings detail | ontbreekt |
| bottomsheet.html | n.t.b. (Bottom sheet) | Bottom sheet | paneel-sjabloon ontbreekt in registry |
| bottomtoast.html | n.t.b. (Bottom toast + notifications panel) | Bottom toast + panel | ontbreekt |
| rightpanel.html | n.t.b. (Right panel safety) | Right panel | paneel-sjabloon ontbreekt in registry |

## H. Moduleplan (conceptueel)
| moduleId | Beoogde route-basis | Settings-route | Widget-intentie |
| --- | --- | --- | --- |
| cardio | `/cardio` (moduleRoute) | `/settings/cardio` | Home-widget voor laatste/suggested cardio |
| muskel (Spierbehoud) | `/muskel` | `/settings/muskel` | Home-widget kracht/herstel |
| balance_flex | `/balance` | `/settings/balance` | Home-widget balans/flex sessies |
| brain (Hersentraining) | `/brain` | `/settings/brain` | Home-widget brein-oefening/dagelijkse puzzel |
*Routes zijn voorstel op basis seed-IDs; implementatie pas na expliciete besluitvorming.*

## I. Seed content plan
- **Bron:** `src/seed/fit4seniors.catalog.seed.v1.json` (modules + trainings + varianten, de/en).
- **Gebruik:** als initiële catalogus voor lijsten/detail: mapping naar Training Hub (modulekeuze), cardio/balance/muskel/brain lijsten, detailpagina’s en sessiestarts. Variants (light/medium/heavy) mappen op sessie-instellingen (duur/intensiteit) zoals in `bottomsheet.html`/`training-detailpage.html`.
- **Benodigdheden:** loader die seed in memory/store plaatst (bijv. shared data-service), koppeling naar moduleRegistry entries en homeWidgets voor zichtbaarheid op `/`. I18n-koppeling naar `locales` voor labeling.

## J. Build & check commands
- **Scripts (package.json):** `npm run dev` (Vite dev), `npm run build`, `npm run preview`, `npm run test` (vitest), `npm run lint` (eslint op `src/**/*.{ts,tsx}`).
- **Dev-flow verwachting:** start met `npm install` (indien nodig) → `npm run dev` voor lokale checks; vóór implementaties `npm run lint` + gerichte `npm run test` wanneer tests bestaan; `npm run build` als release-check. PWA-config via VitePWA reeds gekoppeld in `vite.config.ts`.

## Fase 1A – Route & Template Contract (besluiten)
- Route governance: pages krijgen routes; panels/overlays niet; RightPanel voor context, BottomSheet/Toast voor inline acties en gesloten vóór sessiestart; sessies complex → dedicated Session page; header-iconen blijven actief, onderbreking vereist confirm bottom-sheet.
- Module bases (contract): cardio `/cardio`; muskel `/muskel`; balance_flex `/balance`; brain `/brain` (top-level nav “Gehirn”).
- Footer/nav gap rule: footer menu pas uitbreiden na implementatiefase; in 1A/1B geen wijzigingen.

