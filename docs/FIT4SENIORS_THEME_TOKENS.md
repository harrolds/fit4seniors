# FIT4SENIORS — Theme Tokens (Fase 1B) — CANON (Stitch SSOT)

## Doel
Single source of truth voor visuele stijl via CSS-variabelen (**geen dark mode**).
Layout/positioning blijft in bestaande CSS; alle kleur, typografie, radius, shadow en motion worden uitsluitend via tokens gestuurd.

Bron voor kleuren (canon): Stitch HTML exports met `app-*` palette.
Besluit: `settings-overview.html` wordt genormaliseerd naar dezelfde palette; afwijkende exports zijn niet leidend.

---

## Canonieke kleurwaarden (1-op-1 uit Stitch)
- app-bg = #fff5e3
- app-accent = #f6b06d
- app-primary = #88b0a5
- app-secondary = #72937c
- app-tertiary = #fcd7ac
- app-quartary = #e6beae
- app-quintary = #a0b4b8
- app-dark = #103546
- app-footer = #fffefa

---

## Colors (semantisch)
| Token | Waarde |
|---|---|
| --color-app-bg | #fff5e3 |
| --color-surface | #ffffff |
| --color-surface-footer | #fffefa |
| --color-text-primary | #103546 |
| --color-text-secondary | rgba(16,53,70,0.80) |
| --color-text-muted | rgba(16,53,70,0.60) |
| --color-nav-inactive | rgba(16,53,70,0.40) |
| --color-border | rgba(16,53,70,0.10) |
| --color-divider | rgba(16,53,70,0.10) |
| --color-overlay | rgba(16,53,70,0.45) |
| --color-focus | #103546 |
| --color-active | #88b0a5 |
| --color-accent | #f6b06d |

---

## Module / Widget Card Colors
| Token | Waarde |
|---|---|
| --color-card-module-1 | #88b0a5 |
| --color-card-module-2 | #72937c |
| --color-card-module-3 | #fcd7ac |
| --color-card-module-4 | #e6beae |
| --color-card-module-5 | #a0b4b8 |
| --color-card-accent | #f6b06d |

---

## Status Colors
| Token | Waarde |
|---|---|
| --color-success | #22c55e |
| --color-warning | #f59e0b |
| --color-error | #ef4444 |
| --color-disabled | rgba(16,53,70,0.15) |
| --color-disabled-text | rgba(16,53,70,0.40) |

---

## Typography
| Token | Waarde |
|---|---|
| --font-family-base | "Spline Sans","Noto Sans",system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif |
| --font-size-display | 1.75rem |
| --font-size-xl | 1.5rem |
| --font-size-lg | 1.125rem |
| --font-size-md | 1rem |
| --font-size-sm | 0.875rem |
| --font-size-xs | 0.75rem |
| --font-weight-regular | 400 |
| --font-weight-medium | 500 |
| --font-weight-semibold | 600 |
| --font-weight-bold | 700 |
| --line-height-normal | 1.6 |
| --line-height-snug | 1.4 |

---

## Spacing
| Token | Waarde |
|---|---|
| --spacing-xs | 4px |
| --spacing-sm | 8px |
| --spacing-md | 12px |
| --spacing-lg | 16px |
| --spacing-xl | 24px |
| --spacing-2xl | 32px |

---

## Radius
| Token | Waarde |
|---|---|
| --radius-sm | 8px |
| --radius-md | 12px |
| --radius-lg | 16px |
| --radius-xl | 24px |
| --radius-pill | 9999px |

---

## Elevation
| Token | Waarde |
|---|---|
| --shadow-sm | 0 4px 10px rgba(0,0,0,0.06) |
| --shadow-md | 0 8px 20px rgba(0,0,0,0.10) |
| --shadow-lg | 0 12px 28px rgba(0,0,0,0.14) |
| --shadow-footer | 0 -4px 6px -1px rgba(0,0,0,0.02) |

---

## Motion
| Token | Waarde |
|---|---|
| --motion-duration-fast | 120ms |
| --motion-duration-normal | 180ms |
| --motion-ease-standard | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Hard Rules
- Geen inline kleuren buiten tokens.
- Geen dark mode.
- Module- en widget-kaarten gebruiken expliciete tokens.
- Tokens zijn de enige bron voor visuele stijl.

---

## Settings Normalisatie (Besluit)
Settings-overview volgt dezelfde canonieke palette als de rest van de app. Afwijkende kleursets of dark-mode varianten worden genegeerd of verwijderd bij implementatie.

---

## Implementation notes
- Token source: `src/theme/tokens.css` (canon CSS vars op `:root`).
- Loaded at app start via `src/core/AppRoot.tsx` import.
- ThemeProvider: licht-only, zet geen inline kleuren; vertrouwt op CSS vars (alleen dataset/metadata).
- In DevTools `:root` zie je de canon vars, inclusief aliases voor legacy namen.

