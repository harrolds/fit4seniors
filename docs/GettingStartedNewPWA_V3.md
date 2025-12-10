# Getting started with a new PWA (Skeleton V3)

Deze gids beschrijft de stappen om van de Skeleton V3 naar een nieuwe PWA te gaan. Gebruik de checklists onderaan om niets te missen.

## 1. Vereisten

- Node.js (LTS)
- npm
- Git

## 2. Repo voorbereiden

1. Clone deze repo of gebruik hem als template voor je nieuwe project.
2. Pas de Git-remote aan naar je eigen repository.
3. Draai `npm install`.

## 3. Basisconfiguratie en branding

1. Open `templates/pwa-config/appConfig.example.ts` als referentie.
2. Vul `src/config/appConfig.ts` in (appName, shortName, description, primaryColor, logoPath).
3. Controleer PWA-iconen in `public/icons/` en update indien nodig.
4. Werk manifest-kleuren (`THEME_COLOR`, `BACKGROUND_COLOR`) bij indien nodig.

## 4. Modules toevoegen

1. Kies het module-type:
   - Simpele module → kopieer `templates/module-basic/*`.
   - Heavy module (AI + pipeline) → kopieer `templates/module-ai-heavy/*`.
2. Volg `MODULE_AUTHOR_GUIDE_V3.md` voor registreren in `moduleRegistry`, routes en settings.
3. Voeg i18n-keys toe in `src/locales/de.json` (en andere talen indien gebruikt).

## 5. Thema en i18n instellen

1. Pas basiskeys aan via `templates/pwa-config/i18n-example.*.json`.
2. Controleer thema-instellingen via `src/core/theme` en appConfig-kleuren.
3. Test taalwissel via de settings in de app.

## 6. Telemetry, AI en pipelines

- Telemetry: configureer endpoint en defaults in `appConfig.ts` (via `DEFAULT_TELEMETRY_CONFIG`).
- AI: gebruik `runAiTask` zoals in `GlobalSettingsScreen` demo; voor heavy modules zie template.
- Pipelines: gebruik `usePipeline` en definieer een `PipelineDefinition` (zie heavy template).

## Checklist: Nieuwe PWA

- [ ] Repo gekloond / eigen remote ingesteld.
- [ ] `npm install` uitgevoerd.
- [ ] `src/config/appConfig.ts` ingevuld (branding, kleuren, logo).
- [ ] i18n-keys bijgewerkt (titel, navigatie, basiscopy).
- [ ] Modules geactiveerd in `src/config/moduleRegistry.ts`.
- [ ] (Optioneel) Telemetry-config ingesteld.
- [ ] (Optioneel) AI/pipeline endpoints en keys geconfigureerd.
- [ ] `npm run lint` en `npm run test` slagen.
- [ ] `npm run build` genereert een succesvolle build.

