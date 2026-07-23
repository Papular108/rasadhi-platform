# Architecture

_This document will describe the overall architecture of the Rasadhi Platform once features are implemented._

## Components

- **rasadhi_core** — pure scientific library
- **Backend** — FastAPI REST API
- **Frontend** — React + TypeScript SPA
- **Database** — PostgreSQL via Supabase (planned)

## Explorer page layout

Decided ahead of implementation so later sessions build toward it rather
than retrofitting.

- Page width: max-w-6xl, wider than the max-w-3xl used for prose pages.
  Report pages are tabular; the narrow-column readability argument applies
  to paragraphs, not data.
- Two-column split, roughly 40 / 60. Left rail is reserved for visual
  content, right column for tabular data.
- Left rail will hold, side by side: the 2D structure (RDKit-JS, Session 1.6)
  and the bioavailability radar (deferred). Each needs roughly 230px to stay
  readable, which is what drives the 40% rail and the wider page.
- Right column groups metrics under full-width tinted section banners rather
  than separating them with vertical margin.
- Data rows are inline key-value: label left, value right, on one line.
  Stacking the label above the value doubles vertical height for no gain.
- Row font size 13px. Deliberately not the 11px used by comparable tools —
  the extra 2px costs little vertical space and keeps the page readable.
- Explanations stay visible as plain-language labels. Tooltips are for the
  deeper layer (citations, threshold rationale), not for the basic meaning
  of a term. Hover-only content is inaccessible on touch devices.
- A density toggle (compact / comfortable) is planned so expert users can
  opt into tighter spacing without making it the default for newcomers.

This layout lands in Session 1.7, after the structure rendering in 1.6 gives
the left rail real content to be built around.
