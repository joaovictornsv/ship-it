# Office visual upgrades

**Status:** flavor + polish **done**; two-layer room backgrounds **pending**.

Canonical art prompts and integration notes for the living office scene. Module runtime contract: [`docs/modules/scene.md`](./modules/scene.md).

## Locked scope

**Done:** titles, people-only sprites, flex desk (laptop + snack), centered name tip, single `office.jpeg` trial (to be replaced).

**Final:** **two** pixel strips per room — **minimalist wall** + **floor** — not one full-stage image.

Not in scope: buyable office themes (#34), economy changes, new rooms.

## Why two layers (not one plate)

A single full-stage background fights UI in the **wall band** (room tabs, props chips, talk bubbles, `×N` badge). Split matches existing DOM:

| Layer | DOM                             | Art role                                                   |
| ----- | ------------------------------- | ---------------------------------------------------------- |
| Wall  | `.office-sky` (top ~⅓ of stage) | **Minimal** — calm wash, optional faint window silhouettes |
| Floor | `.office-floor` (stage body)    | Tiled / perspective floor — pixel detail lives here        |

CSS room tints (`--office-wall` / `--office-floor`) can still wash each strip. Gradients remain fallback when assets missing.

---

## Background art (pending)

### Canvas specs (per strip)

| Strip     | Size             | Role                                                           |
| --------- | ---------------- | -------------------------------------------------------------- |
| **Wall**  | **640 × 144** px | Minimal back wall — **low detail**, no competing focal objects |
| **Floor** | **640 × 176** px | Floor tiles / perspective — open center for desk grid overlay  |

Both export as PNG (or JPEG), opaque, `image-rendering: pixelated` in CSS.

**Files per room** (under `public/office/rooms/`):

- `{room}-wall.png` — e.g. `office-wall.png`
- `{room}-floor.png` — e.g. `office-floor.png`

Rooms: `office`, `break-room`, `review-lab`, `ops-bay`, `datacenter`.

**Integration (when wiring):** `backgroundWallSrc` + `backgroundFloorSrc` on room catalog → wall on `.office-sky`, floor on `.office-floor`; remove full-stage `.office-room-bg` / single `office.jpeg`.

---

### Master prompt — WALL (minimalist)

Reuse for every room; append the room-specific **wall** paragraph.

```text
Create a 640x144 pixel-art WALL strip for an idle clicker office scene (wide landscape, short height).

Style: retro 16-bit pixel art, limited palette (8–16 colors), crisp pixels, no blur, no anti-aliasing, no photorealism, no 3D render.

Composition rules (strict):
- This is ONLY the back wall band — a simple horizontal strip, not a full room.
- MINIMALIST: flat or softly graded wall color with very subtle texture only.
- Optional: 1–2 faint window rectangles OR a single soft horizon line — NO city detail, NO readable posters, NO clocks, NO whiteboards, NO furniture silhouettes.
- NO desks, chairs, people, monitors, text, logos, UI, watermarks.
- Keep the entire strip calm — it sits behind game badges and speech bubbles.
- Export exactly 640x144 PNG, opaque background.
```

### Master prompt — FLOOR

Reuse for every room; append the room-specific **floor** paragraph.

```text
Create a 640x176 pixel-art FLOOR strip for an idle clicker office scene (wide landscape).

Style: retro 16-bit pixel art, limited palette (12–20 colors), crisp pixels, no blur, no anti-aliasing, no photorealism, no 3D render.

Composition rules (strict):
- This is ONLY the floor band — tiles or planks with light perspective toward the back wall.
- Mostly OPEN and readable — simple repeating pattern; avoid large objects in the center third (desk sprites overlay here).
- NO desks, chairs, people, legs, cables on the floor, text, logos, watermarks.
- Soft ambient lighting; readable at small size.
- Export exactly 640x176 PNG, opaque background.
```

---

### Room-specific add-ons — WALL (minimal)

**Office** (`office-wall.png`):

```text
Room: starting software office wall. Cool sky-blue / soft gray flat wash. Optional: two very faint window rectangles with plain light glow — no cityscape, no skyline, no decor. Mood: calm empty wall behind a busy UI.
```

**Break room** (`break-room-wall.png`):

```text
Room: break room wall. Warm cream / espresso wash. Optional: one soft warm pendant glow spot — no coffee machine, no shelves, no posters. Mood: cozy but empty.
```

**Review lab** (`review-lab-wall.png`):

```text
Room: review lab wall. Cool blue / indigo flat wash. Optional: faint vertical light band — no monitors, no sticky-note wall, no checklists. Mood: focused, minimal.
```

**Ops bay** (`ops-bay-wall.png`):

```text
Room: ops bay wall. Dark gray-green wash with tiny green/amber pixel dots (status LEDs) scattered sparingly — no status board, no rack detail, no alarm icons. Mood: on-call hint without clutter.
```

**Datacenter** (`datacenter-wall.png`):

```text
Room: datacenter wall. Cool ink / teal dark wash. Optional: very faint vertical rack silhouettes at the edges only — no LED clutter in the center. Mood: cold aisle, prestige floor.
```

---

### Room-specific add-ons — FLOOR

**Office** (`office-floor.png`):

```text
Room: office floor. Light neutral carpet tiles or subtle square grid, slight perspective toward the wall. Keep center calm.
```

**Break room** (`break-room-floor.png`):

```text
Room: break room floor. Warmer wood or linoleum tiles, soft perspective. Slightly warmer than office.
```

**Review lab** (`review-lab-floor.png`):

```text
Room: review lab floor. Cool gray lab tiles, subtle grid, light perspective.
```

**Ops bay** (`ops-bay-floor.png`):

```text
Room: ops bay floor. Darker tech flooring with subtle chevron or hazard stripe hints at the edges only — not the center.
```

**Datacenter** (`datacenter-floor.png`):

```text
Room: datacenter floor. Dark raised-floor tiles, vent grid pattern, denser/cooler than office. Keep center readable.
```

---

### Optional negative prompt (if the tool supports it)

**Wall:**

```text
cityscape, skyline, clock, whiteboard, posters, text, furniture, desks, people, busy center, neon, blur, photorealistic, 3D, watermark
```

**Floor:**

```text
desks, chairs, people, cables, large center object, text, watermark, blur, photorealistic, 3D
```

---

## Delivery order

1. ~~Flavor + polish~~ (done)
2. Generate **wall + floor** pairs per room (prompts above)
3. Wire strips on `.office-sky` / `.office-floor`; remove single `public/office/rooms/office.jpeg` full-plate

## Key files

- `src/features/scene/OfficeScene.tsx`
- `src/data/rooms.ts` — add `backgroundWallSrc` / `backgroundFloorSrc`
- `src/styles/index.css` — `.office-sky` / `.office-floor` image layers
- `docs/modules/scene.md`
