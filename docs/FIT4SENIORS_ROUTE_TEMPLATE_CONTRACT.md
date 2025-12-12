# FIT4SENIORS — Route & Template Contract (Fase 1A)

## 1) Route governance
- Pages krijgen eigen route; panels en overlays krijgen geen route en worden via panel/overlay host geopend.
- RightPanel: alleen voor ondersteunende context (bv. veiligheidstips) die de onderliggende page zichtbaar laat.
- BottomSheet/BottomToast: voor inline settings/confirmaties; moeten worden gesloten vóór een sessiestart.
- Sessies: complexe sessies krijgen een dedicated Session page; eenvoudige lineaire flows mogen embedded, maar confirm/teardown via bottom-sheet/toast vóór start.
- Header-iconen blijven actief; onderbrekingen tijdens sessie vereisen een confirm bottom-sheet.

## 2) Beoogde route map (contractueel)
| route | routeType | template | primaryComponentName (toekomstig) | sourceHtml | navSlot | notes |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | page | HomeTemplate | HomeScreen | home.html | Heute | Dashboard met widgets/CTA |
| `/trainings` | page | HubTemplate | TrainingsHub | traininghub.html | Übungen | Generieke trainingshub |
| `/cardio` | page | HubTemplate | CardioModule | cardio-module-landing.html | Übungen | Module landing (cardio) |
| `/cardio/list` | page | TrainingListTemplate | CardioTrainingList | cardio-training-list.html | Übungen | Sub-lijst cardio |
| `/training/:id` | page | TrainingDetailTemplate | TrainingDetail | training-detailpage.html | none | Detail + start CTA |
| `/session/:trainingId` | page | SessionTemplate | SessionScreen | dedicated-session.html | none | Actieve sessie flow |
| `/session/:trainingId/completion` | overlay | CompletionTemplate | CompletionOverlay | completion.html | none | Post-session overlay; route none in runtime, opened modally |
| `/history` | page | HistoryListTemplate | HistoryList | geschiedenis.html | none | Trainingsgeschiedenis overzicht |
| `/history/:id` | page | HistoryDetailTemplate | HistoryDetail | history-detail.html | none | Detail van historie-entry |
| `/progress` | page | ProgressTemplate | ProgressScreen | voortgang.html | Fortschritt | Voortgang/statistiek |
| `/brain` | page | HubTemplate | BrainHub | dedicated-session.html | Gehirn | Brain top-level hub (keuze) |
| `/more` | page | MoreHubTemplate | MoreScreen | meer.html | Mehr | Meer-menu hub |
| `/more/info` | page | InfoTemplate | InfoHelp | info-and-help.html | Mehr | Informatie & hulp |
| `/more/profile` | page | ProfileTemplate | ProfileOverview | profiel-overview.html | Mehr | Profieloverzicht |
| `/more/profile/edit` | page | ProfileEditTemplate | ProfileEdit | profile-edit.html | Mehr | Profiel bewerken |
| `/more/notifications` | page | NotificationsSettingsTemplate | NotificationsSettings | notifications-setting.html | Mehr | Herinneringen/meldingen |
| `/more/settings` | page | SettingsOverviewTemplate | SettingsOverview | settings-overview.html | Mehr | Instellingen hub |
| `/more/settings/text` | page | SettingsDetailTemplate | TextSizeSettings | settings-detail.html | Mehr | Tekstgrootte/contrast detail |
| `route=none` | panel | RightPanelTemplate | SafetyRightPanel | rightpanel.html | none | Open via panel host; geen route |
| `route=none` | overlay | BottomSheetTemplate | SessionSettingsSheet | bottomsheet.html | none | Pre-session instellingen |
| `route=none` | overlay | BottomToastTemplate | NotificationToast | bottomtoast.html | none | Inline success/alerts |

## 3) Module bases (contract)
- cardio → `/cardio`
- muskel → `/muskel`
- balance_flex → `/balance`
- brain → `/brain` (gekozen basis zodat Brain als top-level nav-slot “Gehirn” blijft consistent; subroutes kunnen `/brain/trainings` krijgen, maar basis blijft `/brain`).

## 4) Template catalog
- **HomeTemplate:** hero/CTA + module tiles + recent/last trained.
- **HubTemplate:** module/discipline landing met categorie-cards.
- **TrainingListTemplate:** lijst met varianten binnen module/categorie.
- **TrainingDetailTemplate:** detail + meta + start CTA + badges.
- **SessionTemplate:** actieve sessie timer/controls; minimal nav.
- **CompletionTemplate (overlay):** resultaat/points + vervolg CTA.
- **HistoryListTemplate:** tijdlijn van trainingen.
- **HistoryDetailTemplate:** detail van afgeronde sessie.
- **MoreHubTemplate:** kaarttegel-menu voor profiel/instellingen/info.
- **SettingsTemplate(s):** overview + detail (tekst/contrast, meldingen).
- **RightPanelTemplate:** full-height side panel, dismissable.
- **BottomSheetTemplate:** max ~50vh, scrollbare content, drag handle.
- **BottomToastTemplate:** anchored boven footer, stackable; max ~50vh content scroll.

