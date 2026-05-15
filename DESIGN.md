---
name: bancroft-grade-1-weekly
description: >
  Warm bilingual classroom newsletter for a K–1 audience. A bright, paper-feeling
  surface (cream not paper-white) sectioned into nine softly tinted color rooms —
  one per topic (Welcome, Math, Literacy, Specials, ROARS, Reminders, Ask Your
  Child, Vocabulary, Books). English and Spanish are co-equal first-class
  languages, never a "translate" afterthought. Display type does the emotional
  work; body type stays geometric and calm. Print-friendly, mobile-accordion,
  with a quiet dashboard up top and a celebration of named students near the bottom.

themes:
  default: light
  modes: [light, dark]

colors:
  light:
    # Surface
    bg: "#fefcf8"            # warm cream — the page tone
    bg-card: "#ffffff"        # white only when a card sits on cream
    border: "#e8e5dd"
    border-soft: "#f0ede6"
    # Ink
    text: "#1a1a2e"           # deep ink (slightly blue, never pure black)
    text-muted: "#64648b"
    text-faint: "#9090ad"
    # Section tints — one per topic, used as bg + border + heading accent
    welcome: { bg: "#fef9ee", border: "#f0d68a", accent: "#d4a017" }   # warm gold
    math:    { bg: "#f0faf0", border: "#a8dbb8", accent: "#2d8a4e" }   # forest green
    literacy:{ bg: "#eef4fd", border: "#93b8e8", accent: "#2563a8" }   # royal blue
    specials:{ bg: "#f3f0fa", border: "#c4b5fd", accent: "#6d28d9" }   # violet
    roars:   { bg: "#fff5ed", border: "#fed7aa", accent: "#c2410c" }   # tiger orange
    reminders:{bg: "#fef2f2", border: "#fecaca", accent: "#dc2626" }   # alert red
    ask:     { bg: "#ecfdf5", border: "#a7f3d0", accent: "#059669" }   # conversation green
    vocab:   { bg: "#f5f3ff", border: "#ddd6fe", accent: "#7c3aed" }   # word purple
    books:   { bg: "#fdf4ff", border: "#f0abfc", accent: "#a21caf" }   # bookshop fuchsia
  dark:
    bg: "#0f0f1a"
    bg-card: "#1a1a2e"
    border: "#2a2a42"
    border-soft: "#22223a"
    text: "#e8e5f0"
    text-muted: "#9090ad"
    text-faint: "#64648b"
    welcome: { bg: "#1c1a12", border: "#4a3f14", accent: "#eab308" }
    math:    { bg: "#0f1a14", border: "#1a3a24", accent: "#4ade80" }
    literacy:{ bg: "#0f1420", border: "#1a2a48", accent: "#60a5fa" }
    specials:{ bg: "#1a1428", border: "#2a1a48", accent: "#a78bfa" }
    roars:   { bg: "#1c140e", border: "#3a2414", accent: "#fb923c" }
    reminders:{bg: "#1c1010", border: "#3a1818", accent: "#f87171" }
    ask:     { bg: "#0f1a16", border: "#1a3a2a", accent: "#34d399" }
    vocab:   { bg: "#161028", border: "#2a1a48", accent: "#a78bfa" }
    books:   { bg: "#1c1020", border: "#3a1448", accent: "#e879f9" }

typography:
  body:
    family: "DM Sans"
    fallback: "system-ui, sans-serif"
    weights: [400, 500, 600, 700]
    base-size: "16px"
    line-height: 1.65
    optical-sizing: true
  display:
    family: "Fraunces"
    fallback: "Georgia, serif"
    weights: [400, 600, 700, 800, 900]
    italic: true
    optical-sizing: auto
    use-for: [site-title, site-subtitle, section-heading, dashboard-stat-value, roars-student, book-title]
  scale:
    site-title: "2.6rem / 700 / -0.02em tracking / 1.15 leading"
    site-subtitle: "1.15rem / 400 italic"
    site-date: "0.9rem / 500 / uppercase / 0.02em tracking"
    section-heading: "1.45rem / 700"
    section-body: "0.95rem / 1.75 leading"
    dashboard-stat-value: "1.8rem / 800"
    micro-label: "0.72–0.78rem / 700 / uppercase / 0.04–0.08em tracking"

rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  pill: "100px"   # used for every tag, chip, badge, toggle
  default: lg

spacing:
  page-max-width: "780px"          # the whole reading column. Non-negotiable.
  page-gutter-desktop: "20px"
  page-gutter-mobile: "12px"
  section-padding-desktop: "32px"
  section-padding-mobile: "20px 16px"
  section-gap-desktop: "32px"
  section-gap-mobile: "10px"
  card-padding: "14–18px"
  rhythm: [4, 8, 12, 16, 20, 24, 28, 32, 40, 48]

shadows:
  sm: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)"
  md: "0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)"
  lg: "0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)"
  glow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
  philosophy: "Shadows whisper, never shout. Hover lifts by 1–3px max."

motion:
  section-reveal: "opacity + 16px translateY, 0.5s ease, IntersectionObserver triggered"
  hover-lift: "translateY(-1px to -3px), 0.2–0.25s"
  accordion: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1) + opacity 0.25s"
  vocab-flip: "rotateX(180deg), 0.45s ease, 3D perspective 400px"
  progress-bar-fill: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
  weather-fade-in: "0.4s ease, translateY(-4px → 0)"
  reduce-motion: "respect prefers-reduced-motion — disable reveal + flip + lift"

components:
  - header:
      logo: "circle 80×80, 3px cream border, swaps by season (fall / winter / spring)"
      title: "Fraunces display, centered"
      controls: "two pill-buttons (EN / ES) + circular dark-mode toggle, above logo"
      layout: "centered, 48px top padding, 32px bottom"
  - quick-links:
      shape: "horizontal row of pill chips, icon + label, wraps on mobile"
      style: "white card on cream, 1px border, hover lifts + shadow-sm"
  - dashboard:
      shape: "rounded-lg card on white"
      content:
        - "centered display-font label ('Year Progress' / 'Avance Escolar')"
        - "two-column stat grid: week N/N · school days left"
        - "rainbow gradient progress bar (math green → literacy blue → specials violet)"
        - "uppercase 'Upcoming Dates' label"
        - "list of upcoming items: date range · label · type badge (Holiday/Break/etc.)"
      tone: "informational, calm — not a CTA, just an at-a-glance pulse"
  - classroom-selector:
      shape: "pill buttons, one per classroom, with country-flag emoji or flag image"
      active-state: "violet fill, white text, soft violet shadow"
      mobile: "3-column grid instead of row"
      personalization: "choice persists across visits (localStorage)"
  - jump-to-nav:
      shape: "single rounded-lg card containing 'Jump to:' label + scrollable pill row"
      mobile: "2-column grid of icon+label pills"
      behavior: "on mobile, tapping a pill collapses other sections and expands the target"
  - section (universal container):
      shape: "rounded-lg card, 1px border, section-tinted background"
      heading: "Fraunces, section-accent color, emoji icon to its left"
      mobile: "accordion — chevron rotates, content collapses smoothly"
      reveal: "fades + slides up 16px when scrolled into view (once)"
  - section-welcome:
      tint: gold
      content: "single warm paragraph from the teacher, bilingual"
      voice: "personal, week-anchoring ('This week we…')"
  - section-math:
      tint: green
      content: "blurb + optional strategy image inline + 'math-details' card (Module / Topic / Lesson)"
      details-card: "white card inside green section, green left-accent labels"
  - section-literacy:
      tint: blue
      content: "blurb paragraph, often referencing the week's text or skill"
  - section-specials:
      tint: violet
      two-modes:
        personal: "5-day card grid for ONE classroom, weather + subject emoji + 'Day A/B/C'"
        all: "full classroom × day table, default view"
      mode-switch: "when a classroom is selected, personal grid moves to top (flex order)"
      weather: "live Open-Meteo icons inject into each day slot (current week only)"
  - section-roars:
      tint: orange
      hero-line: "celebratory bilingual blurb ('Congratulations to this week's ROARS students!')"
      grid: "3-column cards, one per classroom that has a recipient"
      card: "country-flag chip on warm-orange pill + student name in Fraunces UPPERCASE"
      tone: "this is the page's emotional climax — name + celebration, no judgment"
  - section-reminders:
      tint: red
      shape: "stack of cards, each with a red date-badge (month abbr + day number)"
      content: "short bilingual reminder text per card, sorted chronologically"
  - section-ask:
      tint: emerald
      shape: "list of bubble-cards, each prefixed with a 💬 emoji"
      voice: "open-ended dinner-table conversation prompts"
  - section-vocab:
      tint: purple
      shape: "flip-pill chips — 3D rotateX flip on click, EN↔ES"
      grouped-mode: "3-column groups (e.g. SLA group fronts Spanish, ELA group fronts English)"
      pill: "rounded-100px, purple outline → purple fill on flip/hover"
  - section-books:
      tint: fuchsia
      shape: "horizontal book cards: 📕 emoji + Fraunces title + 'by Author'"
  - archive:
      desktop: "fixed left sidebar, 220px wide, vertically centered, lists every past week"
      mobile: "<details> at page bottom, collapsed by default"
      current-week-state: "violet fill, white bold text"
  - footer:
      content: "single line — school name + grade, bilingual"
      style: "small, muted, top-bordered, 40px above + below padding"

accessibility:
  contrast: "All section accents tested against their tinted backgrounds for WCAG AA"
  focus-visible: "Every pill, button, link must show a clear focus ring (use accent + glow shadow)"
  language: "html[lang] swaps with the EN/ES toggle. Screen readers respect this."
  motion: "Honor prefers-reduced-motion: disable section reveals, flip cards, hover lifts"
  print: "Section cards survive print. Header controls + classroom selector + footer hide."
  touch: "All controls ≥ 44×44 tap target on mobile"

backgrounds:
  page: "flat warm cream — no gradients, no textures, no patterns"
  cards: "section-tinted, very desaturated (lightness ~96–98 in light mode)"
  emphasis: "let color + emoji + Fraunces headings carry visual interest, not illustration"
---

# Bancroft Grade 1 Weekly — Design System

A K–1 classroom newsletter for **Bancroft Elementary School**, Washington DC.
Bilingual (English / Spanish), warm, print-friendly, mobile-collapsible, and
proudly local. The design is **modest on purpose** — families read this on
phones at the kitchen table, often translating for relatives, so the system
prioritizes **scannability, color-coded topic recognition, and bilingual
parity** over decorative flourish.

## Voice & feel

- **Two languages, one document.** Spanish is not a "translation feature." Every
  card has both languages structurally side-by-side; the language toggle
  controls *visibility*, not *priority*. A family that reads Spanish first should
  feel the design was made for them, not adapted to them.
- **Warm paper, not white slab.** The page tone is `#fefcf8`, a soft cream. White
  appears only on cards floating *on* the cream — never as the page itself. This
  evokes "weekly classroom letter" rather than "SaaS dashboard."
- **Topic = color = trust.** Each of the nine content sections has its own pale
  tinted background and a saturated accent for its heading. After two weeks of
  reading, families recognize "the green box = math" before they read the word.
  Never let topics share or blur their color identity.
- **Display type does the emotional work.** Fraunces (a variable, optically-sized
  modern serif) carries headings, the title, the date stamp, the dashboard
  stats, and student names. It's slightly literary, slightly editorial — like a
  good independent magazine. Body type stays calm with DM Sans.
- **Emoji as bilingual icons.** Every section is anchored by a single emoji
  (🔢 📖 🎨 🐯 📌 💬 📝 📚 👋). They're universally legible across reading
  levels and languages and they're playful without being childish.
- **ROARS is the climax.** The orange ROARS section near the bottom celebrates
  named students from each classroom for character. The whole page is structured
  so families scroll *to* this moment. Treat it with care: large display type,
  warm orange, individual cards, no comparative ranking.

## Palette intent

Nine section tints, each a desaturated pastel paired with a saturated heading
accent. Read together they form a **spectrum from warm to cool**:

| Section | Why this color |
|---|---|
| Welcome | gold — invitation, lit window |
| Math | forest green — growth, rooted |
| Literacy | royal blue — depth, reading-into |
| Specials | violet — variety, art-classroom-music swirl |
| ROARS | tiger orange — the Bancroft Tigers mascot, celebration |
| Reminders | red — quiet alert, dates that matter |
| Ask | emerald — fresh conversation |
| Vocabulary | purple — language as artifact |
| Books | fuchsia — bookshop warmth |

The palette only "feels K–1" because of its **lightness and saturation**, not
because of childish hues. Avoid neon. Avoid candy colors. The whole document
should still feel appropriate to a school principal forwarding it to a parent.

## Type rationale

- **Fraunces** for everything emotional or naming (titles, headings, student
  names, dashboard numbers, book titles). It has optical sizing — at large
  weights it gets dramatic; at small it stays readable. The slight literariness
  signals *care* without signaling *exclusivity*.
- **DM Sans** for body, labels, badges, navigation chips. Geometric, neutral,
  legible at 0.78rem all the way up. Variable axes (opsz + wght) used.
- **All-caps micro-labels** at ~0.72rem with 0.04–0.08em tracking for things
  like "WEEK 28 / 36", "MAY 15", "HOLIDAY". These act as visual anchors without
  competing with content.
- **Italic Fraunces** for the subtitle and inline emphasis — never for an entire
  paragraph.

## Layout

- **780px max-width reading column**, centered, padded 20px desktop / 12px
  mobile. This width is the contract — it's roughly the width of a standard
  letter-size print page, intentionally narrow for phone reading without zoom.
- **Vertical stack** of one chrome group (header + quick links + dashboard +
  classroom selector + jump-to) followed by the nine content sections.
- **Section reordering**: when a classroom is selected, the per-classroom
  Specials card jumps to position 0 (the top of the section stack), and the
  full-classroom Specials table moves to the bottom. Personalization without
  full personalization — every family still sees everything, just in their
  priority order.
- **Desktop archive sidebar**: fixed left at ≥1100px viewport, scrolls past
  weeks. **Mobile archive**: collapsed `<details>` at page bottom.

## Elevation

Shadows are quiet. Cards on the cream page get either no shadow or `shadow-sm`.
Hover states lift by 1–3px and add `shadow-sm` or `shadow-md` — never more.
The page does not have a depth hierarchy beyond two layers (cream page, white
or tinted card). Avoid stacking cards on cards on cards.

## Shape

- **`rounded-lg` (20px)** for every section, dashboard, jump-to, archive.
- **`rounded-md` (14px)** for inner cards (book card, ROARS card, reminder card,
  upcoming-date row, math-details, specials day card).
- **`rounded-pill` (100px)** for every chip, badge, toggle, vocab pill, quick
  link, classroom button, jump-to link.
- **`rounded-sm` (8px)** only for reminder date badges and very small chips.

Pills do most of the small-element work — they make the navigation feel
**friendly and bilingual-tolerant** (Spanish words run ~30% longer; pills
handle that gracefully).

## Motion

- Sections **fade + slide up 16px** when first scrolled into view (one-time, via
  IntersectionObserver). 0.5s ease.
- Hover on any pill or card lifts 1–3px with 0.2–0.25s ease.
- Mobile sections collapse/expand via `max-height` accordion with 0.35s cubic
  bezier — content opacity fades over 0.25s to mask the height jump.
- Vocabulary pills flip 3D on click (rotateX 180°, 0.45s ease, perspective
  400px) revealing the other-language word.
- Dashboard progress bar fills with a 0.8s eased width animation.
- Weather icons (current week only, Open-Meteo) **fade-in** into each day's
  specials slot on async load.
- **Always honor `prefers-reduced-motion`**: disable the reveal, the flip, the
  hover lifts. Accordion stays (it's functional).

## Components — design notes

- **Header**: centered, big, with the seasonal logo (fall warm, winter cool,
  spring fresh). Lang toggle + dark toggle are *small, calm pills above the
  logo* — they look like ambient utilities, not primary CTAs.
- **Dashboard**: "where in the year are we?" — a calm pulse, not a metric
  dashboard. Two stats max (week N of N, days remaining), a rainbow progress
  bar, and a small list of upcoming dates. No goals, no streaks, no
  gamification. Schools don't gamify.
- **Classroom selector**: pill row that personalizes the Specials section but
  leaves everything else identical. After a family picks once, it persists.
- **Jump-to nav**: a scrollable row of section-icon pills. On mobile, doubles
  as an accordion controller — tapping a pill collapses other sections.
- **Sections (universal)**: tinted background, single emoji + Fraunces heading,
  visible-on-scroll reveal, accordion-on-mobile. Heading color matches section
  accent. Border color matches section accent but lighter.
- **Specials (two modes)**: personal-classroom 5-day grid (Mon–Fri cards with
  subject emoji + "Day A/B/C" letter + weather slot) OR full classroom × day
  table. Toggle is per-family-preference, never global.
- **ROARS**: 3-column grid of recognition cards. Each card has a country-flag
  chip on a warm-orange pill (classroom identifier) and the student's name in
  large Fraunces UPPERCASE. This is the only place names appear at display
  size — that's intentional.
- **Reminders**: stack of cards with a saturated red date-badge (small uppercase
  month abbreviation over a large day number) and bilingual reminder text.
- **Ask Your Child**: bubble cards prefixed with a 💬 emoji. Looks like
  conversation prompts, not assignments.
- **Vocabulary**: flip pills. 3D rotate on click. Grouped variant supports
  per-group front-language (e.g. SLA = Spanish front, ELA = English front).
- **Books**: 📕 icon + Fraunces book title + "by Author" / "por Autor". Quiet.
- **Archive**: a left rail on desktop, a `<details>` at the bottom on mobile.
  Current week is filled with violet.

## Print

Print **must work**. When a family prints this to read at the kitchen counter:

- Header controls (lang toggle, dark mode), classroom selector, and footer
  hide.
- Section cards keep their border, lose the reveal animation, are forced
  visible.
- Background switches to white, ink to black. Each section has a 1px gray
  border for separation.
- `break-inside: avoid` on every section so they don't split across pages.

## Don'ts

- **Don't break bilingual symmetry.** Spanish must not feel like a translation
  layer. Both languages have equal weight, equal type treatment, equal layout
  position. The toggle controls *which is visible*, never *which is primary*.
- **Don't use pure white as the page background.** The warm cream tone
  (`#fefcf8`) is the brand. White is only for cards floating on it.
- **Don't introduce a tenth section color.** Nine is the ceiling. If a new topic
  appears, fold it into an existing section family, don't add a tenth tint.
- **Don't over-illustrate.** No mascots, no stock illustrations, no flourishes.
  Color + emoji + Fraunces = enough visual identity.
- **Don't lose the per-section color identity** by going monochrome or by
  reducing the saturation of the accents below readability against AA contrast.
- **Don't crowd the column.** 780px max-width is the contract. Wider than that
  makes the body type uncomfortable to read on phones (where it gets read
  most).
- **Don't use sans-serif for section headings.** Fraunces is doing emotional
  work that DM Sans cannot do. The slight serif drama is the whole point.
- **Don't add motion that breaks `prefers-reduced-motion`.** Vestibular
  sensitivity matters in any family-facing document.
- **Don't gamify the dashboard.** No streaks, no XP, no goals. The dashboard
  is a calm year-pulse only.
- **Don't make the ROARS section compete with itself.** Three columns max,
  display-font names, one celebration moment per week. Adding photos, ranking,
  or "student of the week" framing breaks the design.
- **Don't make the classroom selector global.** It only personalizes the
  Specials section. Everything else stays universal so families with multiple
  children at Bancroft don't have to keep toggling.
- **Don't use red for anything except Reminders.** Red is the alert channel.
  Promoting it elsewhere weakens its signal.
