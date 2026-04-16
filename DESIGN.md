# Design System Document

## 1. Design Philosophy: "Essential Clarity"
This design system embraces minimalism through reduction. Every element serves a purpose, removing all non-essential visual weight. The aesthetic is inspired by Scandinavian design principles: clean lines, purposeful whitespace, and a restrained color palette that communicates calm professionalism.

---

## 2. Color Strategy

### Monochromatic Foundation
The palette uses a restrained monochromatic scheme with a single accent color.

- **Primary:** `#2563eb` (Blue) - Action buttons, active states
- **Background:** `#ffffff` - Main canvas
- **Surface:** `#fafafa` - Card backgrounds
- **On Background/Surface:** `#1a1a1a` - Primary text
- **On Surface Light:** `#6b7280` - Secondary text
- **Border:** `#e5e5e5` - Dividers and outlines
- **Border Light:** `#f0f0f0` - Subtle separators

### No Gradients
Gradients are prohibited. Solid colors only to maintain visual clarity.

### Urgency Colors (Functional Only)
- **Green:** `#22c55e` - Low urgency
- **Yellow:** `#eab308` - Medium urgency
- **Red:** `#ef4444` - High urgency

---

## 3. Typography

### Single Typeface
Use the system font stack for optimal performance and native feel. No external font dependencies.

**System Font Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Weight System:**
- **Light (300):** Display text, hero headlines
- **Regular (400):** Body text
- **Medium (500):** Labels, buttons, emphasis
- **Semibold (600):** Titles, headings

**Type Scale:**
- Display Large: 32px / Light / -1 letter spacing
- Display Medium: 28px / Light
- Headline Large: 24px / Semibold
- Headline Medium: 20px / Semibold
- Title Large: 18px / Semibold
- Title Medium: 16px / Medium
- Body Large: 16px / Regular / 24 line height
- Body Medium: 14px / Regular / 20 line height
- Label Large: 14px / Medium
- Label Medium: 12px / Medium / uppercase / 1 letter spacing

---

## 4. Spacing & Layout

### 4px Base Grid
All spacing values are multiples of 4:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Border Radius
Subtle rounding only:
- `sm`: 4px
- `md`: 8px (default)
- `lg`: 12px
- `xl`: 16px
- `full`: 9999px (pills/badges)

---

## 5. Components

### Buttons

**Primary Button:**
- Background: `#1a1a1a`
- Text: `#ffffff`
- Padding: 16px vertical
- Border radius: 8px
- Font: 15px / Medium / 0.5 letter spacing

**Secondary Button:**
- Background: `#fafafa`
- Text: `#1a1a1a`
- Border: 1px `#e5e5e5`
- Padding: 16px vertical
- Border radius: 8px

### Cards
- Background: `#fafafa`
- Border: 1px `#e5e5e5`
- Border radius: 8px
- Padding: 16px

### Headers
- Border bottom: 1px `#f0f0f0`
- Title: 16px / Semibold / `#1a1a1a`
- Back button: 15px / Primary color

### Section Labels
- Font: 11px / Medium / uppercase
- Letter spacing: 1px
- Color: `#6b7280`

### Badges (Urgency)
- Border radius: full (pill shape)
- Padding: 4px vertical, 10px horizontal
- Font: 11px / Semibold
- Text: white on colored background

---

## 6. Principles

### Do:
- Use whitespace generously to create visual breathing room
- Maintain consistent 16px padding on screen edges
- Use subtle 1px borders to define boundaries
- Keep all text left-aligned or centered (never justified)
- Use uppercase labels sparingly for section headers

### Don't:
- Use emojis in UI - use simple text labels
- Use gradients, shadows, or glassmorphism
- Use decorative elements or illustrations
- Use borders for emphasis - use weight and color instead
- Use more than 2 font weights on a single screen