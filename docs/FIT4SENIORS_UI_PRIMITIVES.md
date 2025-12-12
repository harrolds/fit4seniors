# FIT4SENIORS — UI Primitives (Fase 2)

Token-gedreven set herbruikbare bouwstenen. Alle visuele waarden komen uit `src/theme/tokens.css` (SSOT: `docs/FIT4SENIORS_THEME_TOKENS.md`).

## Primitives & purpose
- Button / IconButton — primaire, secundaire en ghost acties; IconButton verplicht `ariaLabel`.
- Card, CardHeader, CardBody — containers met standaard/elevated variant.
- List, ListItem — gestapelde lijsten met titel, optionele subtitle en right slot.
- ModuleCard (Tile) — grote afgeronde blokken met `tone` (`module-1..5` of `accent`) en optioneel icoon.
- Badge — compacte statuschip (`neutral`, `accent`, `outline`).
- Divider — semantische horizontale scheiding.
- SectionHeader — sectietitel met optionele subtitle en action slot.
- ProgressBar — lineaire voortgangsbalk (basis voor ring).

## Belangrijkste props (kort)
- Button: `variant` (`primary|secondary|ghost`), `fullWidth`, alle standaard button props.
- IconButton: `variant`, `size` (`md|sm`), `ariaLabel` (required).
- Card: `variant` (`default|elevated`), standaard div props; subcomponents `CardHeader`, `CardBody`.
- ListItem: `title?`, `subtitle?`, `rightSlot?`; fallback naar children voor custom content.
- ModuleCard: `title`, `subtitle?`, `tone?`, `icon?`, `rightSlot?`, children voor body.
- Badge: `variant` (`neutral|accent|outline`).
- Divider, SectionHeader, ProgressBar: standaard HTML props plus hun required velden (`title`, `value` etc.).

## Usage snippets
```tsx
<Button variant="primary">Doorgaan</Button>
<IconButton ariaLabel="Open menu" variant="ghost">☰</IconButton>

<Card variant="elevated">
  <CardHeader>Instellingen</CardHeader>
  <CardBody>Content</CardBody>
</Card>

<List>
  <ListItem title="Profiel" subtitle="Beheer gegevens" rightSlot="›" />
  <ListItem>
    <Button fullWidth variant="ghost">Custom child</Button>
  </ListItem>
</List>

<ModuleCard tone="module-3" icon="🏃" title="Cardio" subtitle="3 sessies gepland">
  <ProgressBar value={45} />
</ModuleCard>

<Badge variant="accent">Nieuw</Badge>
<Divider />
<SectionHeader title="Vandaag" subtitle="Jouw planning" />
```

## Token-only styling regels
- Uitsluitend CSS vars gebruiken: `var(--color-...)`, `var(--radius-...)`, `var(--shadow-...)`, `var(--spacing-...)`, `var(--font-...)`, `var(--motion-...)`.
- Geen hardcoded kleuren/radii/shadows; geen dark-mode varianten.
- States per component: default, hover, active, focus-visible, disabled (waar van toepassing).
- Geen wijzigingen aan routes/modules/widgets/nav; primitives zijn drop-in binnen bestaande schermen.

