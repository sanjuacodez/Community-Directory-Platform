# Design System

## Philosophy: Claymorphism

The CommunityHub platform uses **claymorphism** — a design aesthetic combining soft 3D depth, rounded elements, pastel colors, and tactile shadows to create a warm, approachable, and playful interface.

### Core Principles
- **Soft shadows** — layered, inner + outer shadows create physical depth
- **Rounded everything** — 0.75rem to 1.25rem border radii
- **Pastel palette** — muted, warm colors that feel approachable
- **Tactile interactions** — buttons press down on click, cards elevate on hover
- **Accessible contrast** — minimum 4.5:1 text contrast, focus rings

---

## Color Palette

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#4a6fa5` | Buttons, links, active states |
| `--color-primary-hover` | `#3d5e8c` | Button hover |
| `--color-accent` | `#c49b4a` | Secondary actions, badges |
| `--color-accent-hover` | `#ad8436` | Accent button hover |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#5a9e6f` | Success messages |
| `--color-danger` | `#c4554d` | Error, deceased badge, delete buttons |

### Gender Colors (Member Cards)
| Gender | Color |
|--------|-------|
| Male | `#6a9fd8 → #8cbae8` gradient |
| Female | `#d88b9e → #e8a3b5` gradient |
| Other | `#9b8ec4 → #b8a8db` gradient |

### Surface Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#f5f2ee` | Page background |
| `--color-surface` | `#ffffff` | Cards, modals |
| `--color-text` | `#3a3430` | Body text |
| `--color-text-muted` | `#8a827c` | Secondary text |
| `--color-border` | `#e6e0da` | Card borders, dividers |

---

## Typography

| Token | Size | Usage |
|-------|------|-------|
| `--font-size-xs` | 0.875rem | Badges, metadata, table cells |
| `--font-size-sm` | 1rem | Buttons, labels |
| `--font-size-base` | 1.1rem | Body text, inputs |
| `--font-size-lg` | 1.25rem | Card titles |
| `--font-size-xl` | 1.5rem | Popup names |
| `--font-size-2xl` | 1.875rem | Page headings |
| `--font-size-3xl` | 2.25rem | Hero title |

**Font family**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif

---

## Shadows

| Class | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` | Buttons, avatars, small cards |
| `--shadow` | `0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)` | Standard cards |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)` | Card hover, modals |
| `--shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.06)` | Inputs, info panels |

---

## Components

### Buttons
```css
.btn           /* Base: shadow-sm, rounded, transition */
.btn-primary   /* Blue (#4a6fa5) */
.btn-accent    /* Gold (#c49b4a) */
.btn-outline   /* Border-only */
.btn-ghost     /* Transparent, subtle hover */
.btn-danger    /* Red on hover */
.btn-sm        /* Smaller size (0.375rem padding) */
```
- All buttons have `box-shadow`, `:active` press effect (translateY +1px, shadow removed)
- Focus: 3px gold outline with 2px offset
- Always use `.btn` as base + variant class

### Inputs
```css
.input   /* Full-width, 2px border, inner shadow, radius-sm */
```
- Focus: blue border + blue glow ring (3px)
- Hover: slightly darker border
- `select.input` has custom dropdown arrow SVG
- Placeholder text is 50% opacity

### Cards
```css
.card   /* White surface, 1.5px border, shadow, radius-lg */
```
- Hover: larger shadow, slightly darker border
- Usage: content blocks, forms, member cards
- `.card` on `<a>` removes underline + inherits color

### Badges
```css
.badge   /* Inline pill, rounded, blue bg */
```
- Used for: gender, blood group, relationship types, status

### Avatars
```css
.avatar       /* Circle, gradient bg, white text */
.avatar-lg    /* Larger (4rem) */
.gender-male   /* Blue gradient */
.gender-female /* Pink gradient */
.gender-other  /* Purple gradient */
```

### Modals
```css
.modal-overlay   /* Fixed, backdrop blur, centered flex */
.modal-content   /* White card, shadow-lg, max-width */
```
- Close: click outside or Escape key
- Scrollable with max-height: 90vh

### Sections (Forms)
```tsx
<Section title="Basic Information">
  {/* Field group */}
</Section>
```
- Card wrapper with section-title header
- Used in Create/Edit member forms

---

## Layout Patterns

### Page Header
```css
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
```

### Grid System
- Use Tailwind responsive grids:
  - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for cards
  - `grid-cols-1 sm:grid-cols-2` for form fields
  - `grid-cols-1 sm:grid-cols-3` for contact fields
- Gap: 0.75rem (3 in Tailwind)

### Responsive Breakpoints
| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile |
| `sm:` | 640px | Tablet |
| `lg:` | 1024px | Desktop |

---

## Navigation

### Desktop (≥1024px)
- Horizontal bar: Logo | Communities | Families | Members | Directory | [email] | Admin | Logout
- All links inline, no hamburger

### Mobile (<1024px)
- Logo + hamburger button
- Hamburger reveals dropdown with all links
- Login/Admin/Logout at bottom of dropdown

### Public (not logged in)
- Home | Members | Login only

---

## Member Cards

### Grid Card
```tsx
<div className="card">
  {/* Gender-colored gradient cover (56px height) */}
  {/* Avatar centered over cover edge (56px, white border 3px, shadow) */}
  {/* Name (bold, centered) */}
  {/* Gender + blood group badges */}
  {/* Profession (subtitle) */}
  {/* Family · Location (metadata line) */}
  {/* Community name */}
</div>
```

### Popup (Click a member)
- Prev/Next navigation with counter ("2 of 12")
- Large avatar (80px) with gender-colored border
- Name with ✎ edit button
- Social icons row (✉ 📞 💬 f 📷 in 𝕏 ✎)
- 2-column info grid with inner shadow background
- Family connections badges

---

## Do's and Don'ts

### ✅ Do
- Use CSS variables for all colors (`var(--color-primary)`, not `#4a6fa5`)
- Use `.btn`, `.input`, `.card` classes consistently
- Always provide `:focus-visible` styles
- Use responsive grids (`sm:` breakpoints)
- Test on mobile viewport (375px width)
- Use avatar with gradient for missing profile photos

### ❌ Don't
- Don't use hardcoded hex colors — use CSS variables
- Don't create custom button styles — use `.btn` variants
- Don't use `<a>` with `target="_blank"` without `rel="noopener"`
- Don't forget `alt` attributes on images
- Don't use `<br>` for spacing — use margins/padding
- Don't create flat designs — always add shadow depth
