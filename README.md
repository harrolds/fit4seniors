# PWA Skeleton v2 (met v1-basis)

Deze repo bundelt Skeleton v1 (fases 0-8) en voegt vanaf fase 9 de leidende laag van Skeleton v2 toe. Het project is de SSOT voor de PWA Factory en bedoeld als startpunt voor nieuwe PWA's (zoals Dreamdrop, Temio, RiskRadar en toekomstige apps). Primair gericht op mobiel/tablet in portrait; desktop toont een blokkerscherm met QR-code.

---

## Stack

- React 18
- Vite (met PWA-setup)
- TypeScript
- Client-side routing
- PWA (manifest + service worker)

---

## Skeleton v2 in een oogopslag

- Module-architectuur met centrale `moduleRegistry`, home widget host en module- en globale settings.
- Theming en branding via `APP_BRAND` in `src/config/appConfig.ts`.
- Basis API-demo op de home ("API skeleton demo").
- Templates in `src/modules/templates/` (`ListDetailTemplate`, `FormTemplate`).
- Vitest testharnas (`npm run test`).
- ESLint-linting (`npm run lint`).

---

## Nieuwe PWA starten op basis van Skeleton v2

1. **Repo clonen of als template gebruiken**
   - Clone deze repo of kopieer de code naar een nieuwe Git-repo.
2. **Dependencies installeren**
   - Voer `npm install` uit.
3. **Branding instellen**
   - Pas `APP_BRAND` in `src/config/appConfig.ts` aan naar jouw app-naam, korte naam, beschrijving en primaire kleur.
   - Update de PWA-iconen in `public/icons/` indien gewenst.
4. **Eerste module toevoegen**
   - Volg `MODULE_AUTHOR_GUIDE.md` om je eerste module (bijvoorbeeld `tasks` of `habits`) aan te maken.
   - Registreer de module in `moduleRegistry` en (optioneel) als widget op de home.
5. **Run & build**
   - `npm run dev` om lokaal te testen.
   - `npm run test` om basis-tests te draaien.
   - `npm run build` voor een production build.

---

## Belangrijke documenten

- `SKELETON_V1_SCOPE.md` - oorspronkelijke scope van Skeleton v1.
- `Skeleton_V1_Bouwpad.md` - bouwpad van v1.
- `SKELETON_V2_SCOPE.md` - scope en randvoorwaarden voor Skeleton v2.
- `Skeleton_V2_Bouwpad.md` - bouwpad van v2 (fases 0-25).
- `Skeleton_V2_Startblok.md` - startprompt voor AI-gestuurde sessies.
- `MODULE_AUTHOR_GUIDE.md` - handleiding voor het bouwen van modules.
- `docs/GettingStartedNewPWA.md` - stap-voor-stap uitleg om een nieuwe PWA op basis van v2 te starten.

---

## Development

### Installatie

```bash
npm install
```

### Scripts

```bash
npm run dev    # start lokale development server
npm run test   # draai Vitest testharnas
npm run lint   # lint de codebase
npm run build  # maak een production build
```
