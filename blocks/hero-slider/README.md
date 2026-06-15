# Hero Slider

Full-bleed image slider for the homepage hero, based on the Sparta Figma design.
Each slide shows an art-directed banner with circular prev/next arrows, progress
bars and up to two overlaid call-to-action buttons.

## Authoring (da.live)

The block is authored as a container **Hero Slider** that holds one or more
**Hero Slide** items (the filter only allows slides). Each slide exposes these
fields in the block panel (see `_hero-slider.json`):

| Field | Type | Purpose |
| --- | --- | --- |
| Imagen desktop | reference | Banner shown at ≥ 600px (e.g. 1440×493) |
| Imagen mobile | reference | Banner shown below 600px (e.g. 430×355) |
| Texto alternativo de la imagen | text | `alt` text for the image |
| Link de la imagen | aem-content | Optional link wrapping the whole image |
| Botón 1 — texto / link | text / aem-content | First overlaid CTA (default: "Hombre") |
| Botón 2 — texto / link | text / aem-content | Second overlaid CTA (default: "Mujer") |

The image link and each button link are independent of each other.

## Content contract

Each top-level row of the block is one slide:

- **Cell 1** — the slide image, optionally wrapped in a link (the image link).
- **Cells 2..N** — each holds one link, rendered as an overlaid button.

`<picture>` is used for art direction (different desktop/mobile crops).

## Behavior

- Arrows and progress bars are rendered automatically only when there is more
  than one slide.
- Autoplay advances every 6s; it pauses on hover and stops after any manual
  interaction (arrow or bar click).
- A transition is applied only after the first paint to avoid an initial jump.

## Accessibility

- Each slide is a `role="group"` with `aria-roledescription="Slide"`.
- Non-active slides are `aria-hidden` and their links are removed from the tab
  order (`tabindex="-1"`).
- Arrows and progress bars have descriptive `aria-label`s; the active bar is
  marked with `aria-current`.
