# Design System: Rudraksh Inn
**Project:** Full-Stack Hotel & Restaurant Booking System

## 1. Visual Theme & Atmosphere

**5-Star Luxury Resort Elegance**

The design embodies the refined sophistication of a premium hospitality experience. The atmosphere is **opulent yet welcoming**, balancing grandeur with warmth. Visual density is **curated and spacious**—generous whitespace allows luxury to breathe, while rich accents create moments of visual interest. The aesthetic philosophy draws from **contemporary luxury hotels**: clean lines meet ornate details, modern functionality wrapped in timeless elegance.

The overall mood is **sophisticated, inviting, and prestigious**. Every element whispers quality and attention to detail, from the subtle shimmer of gold accents to the deep, grounding neutrals that create a sense of calm and exclusivity.

---

## 2. Color Palette & Roles

### Primary Colors

**Deep Charcoal** (#2B2B2B)
- **Role:** Primary text, navigation headers, footer backgrounds
- **Character:** Rich, sophisticated darkness that anchors the design
- **Usage:** Body text, headings, primary UI elements requiring strong contrast

**Champagne Gold** (#D4AF37)
- **Role:** Primary accent, CTAs, premium highlights, interactive elements
- **Character:** Luxurious metallic warmth, evoking prestige and exclusivity
- **Usage:** Primary buttons, icons, borders on featured content, hover states, premium badges

**Warm Cream** (#F5F5DC)
- **Role:** Primary background, card surfaces, light sections
- **Character:** Soft, inviting warmth that creates a welcoming canvas
- **Usage:** Page backgrounds, card backgrounds, alternating sections, form inputs

### Supporting Colors

**Soft Ivory** (#FFFEF7)
- **Role:** Secondary background, elevated surfaces
- **Character:** Pristine, clean brightness for contrast against cream
- **Usage:** Hero sections, modal backgrounds, highlighted cards

**Rich Espresso** (#3E2723)
- **Role:** Deep accents, secondary text, footer elements
- **Character:** Warm dark brown adding depth and earthiness
- **Usage:** Secondary headings, subtle borders, footer text

**Muted Gold** (#C9A961)
- **Role:** Secondary accent, subtle highlights
- **Character:** Softer gold for less prominent interactive elements
- **Usage:** Secondary buttons, icon accents, dividers, hover transitions

**Pale Champagne** (#F0E6D2)
- **Role:** Hover states, disabled states, subtle backgrounds
- **Character:** Delicate gold-tinted neutral
- **Usage:** Button hover backgrounds, input focus rings, section dividers

### Semantic Colors

**Success Green** (#2E7D32)
- **Role:** Confirmation messages, booking success, availability indicators
- **Character:** Natural, reassuring green

**Alert Amber** (#F57C00)
- **Role:** Warnings, pending status, important notices
- **Character:** Warm, attention-grabbing orange

**Error Burgundy** (#C62828)
- **Role:** Error messages, unavailable status, critical alerts
- **Character:** Sophisticated red that maintains luxury aesthetic

**Info Navy** (#1565C0)
- **Role:** Informational messages, links, secondary actions
- **Character:** Professional, trustworthy blue

---

## 3. Typography Rules

### Font Families

**Primary Font: "Playfair Display"** (Serif)
- **Character:** Elegant, high-contrast serif with classic luxury appeal
- **Usage:** All headings (H1-H6), hero text, section titles, featured content
- **Weights:** 400 (Regular), 600 (SemiBold), 700 (Bold)

**Secondary Font: "Lato"** (Sans-Serif)
- **Character:** Clean, modern, highly readable humanist sans-serif
- **Usage:** Body text, navigation, buttons, form labels, descriptions
- **Weights:** 300 (Light), 400 (Regular), 700 (Bold)

**Accent Font: "Cormorant Garamond"** (Serif)
- **Character:** Refined, graceful serif for special emphasis
- **Usage:** Testimonials, quotes, special callouts, taglines
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold)

### Typography Scale

**Display Headings (H1)**
- Font: Playfair Display, 700
- Size: 3.5rem (56px) desktop / 2.5rem (40px) mobile
- Line Height: 1.1
- Letter Spacing: -0.02em (tight)
- Color: Deep Charcoal (#2B2B2B)
- Usage: Hero headlines, page titles

**Primary Headings (H2)**
- Font: Playfair Display, 600
- Size: 2.5rem (40px) desktop / 2rem (32px) mobile
- Line Height: 1.2
- Letter Spacing: -0.01em
- Color: Deep Charcoal (#2B2B2B)
- Usage: Section headers, major content divisions

**Secondary Headings (H3)**
- Font: Playfair Display, 600
- Size: 2rem (32px) desktop / 1.75rem (28px) mobile
- Line Height: 1.3
- Letter Spacing: normal
- Color: Deep Charcoal (#2B2B2B)
- Usage: Subsection headers, card titles

**Tertiary Headings (H4)**
- Font: Lato, 700
- Size: 1.5rem (24px)
- Line Height: 1.4
- Letter Spacing: 0.01em
- Color: Rich Espresso (#3E2723)
- Usage: Component headers, list titles

**Small Headings (H5, H6)**
- Font: Lato, 700
- Size: 1.25rem (20px) / 1rem (16px)
- Line Height: 1.5
- Letter Spacing: 0.02em
- Color: Rich Espresso (#3E2723)
- Usage: Minor headers, labels

**Body Text**
- Font: Lato, 400
- Size: 1rem (16px)
- Line Height: 1.6
- Letter Spacing: 0.01em
- Color: Deep Charcoal (#2B2B2B)
- Usage: Paragraphs, descriptions, general content

**Small Text**
- Font: Lato, 400
- Size: 0.875rem (14px)
- Line Height: 1.5
- Letter Spacing: 0.01em
- Color: Rich Espresso (#3E2723)
- Usage: Captions, metadata, helper text

**Button Text**
- Font: Lato, 700
- Size: 1rem (16px)
- Line Height: 1
- Letter Spacing: 0.05em (wide, uppercase)
- Transform: Uppercase
- Usage: All button labels

---

## 4. Component Stylings

### Buttons

**Primary Button**
- **Shape:** Gently rounded corners (border-radius: 8px)
- **Background:** Champagne Gold (#D4AF37)
- **Text:** Warm Cream (#F5F5DC), Lato Bold, uppercase, 0.05em letter-spacing
- **Padding:** 16px 32px (vertical, horizontal)
- **Border:** None
- **Shadow:** Subtle elevation (0 4px 12px rgba(212, 175, 55, 0.25))
- **Hover:** Background darkens to Muted Gold (#C9A961), shadow intensifies
- **Active:** Slight scale down (transform: scale(0.98))
- **Disabled:** Background to Pale Champagne (#F0E6D2), text to Rich Espresso at 50% opacity

**Secondary Button**
- **Shape:** Gently rounded corners (border-radius: 8px)
- **Background:** Transparent
- **Text:** Champagne Gold (#D4AF37), Lato Bold, uppercase
- **Padding:** 16px 32px
- **Border:** 2px solid Champagne Gold (#D4AF37)
- **Shadow:** None
- **Hover:** Background fills with Pale Champagne (#F0E6D2)
- **Active:** Border thickens to 3px
- **Disabled:** Border and text to Muted Gold (#C9A961) at 50% opacity

**Text Button / Link**
- **Shape:** No border radius
- **Background:** Transparent
- **Text:** Champagne Gold (#D4AF37), Lato Regular
- **Padding:** 8px 16px
- **Border:** None
- **Underline:** 1px solid on hover
- **Hover:** Text color to Muted Gold (#C9A961)

### Cards & Containers

**Primary Card (Room Cards, Featured Content)**
- **Shape:** Moderately rounded corners (border-radius: 12px)
- **Background:** Soft Ivory (#FFFEF7)
- **Border:** 1px solid Pale Champagne (#F0E6D2)
- **Shadow:** Whisper-soft elevation (0 2px 16px rgba(43, 43, 43, 0.08))
- **Padding:** 24px
- **Hover:** Shadow deepens (0 8px 24px rgba(43, 43, 43, 0.12)), subtle lift (transform: translateY(-4px))
- **Transition:** All properties 0.3s ease

**Secondary Card (Info Cards, Testimonials)**
- **Shape:** Gently rounded corners (border-radius: 8px)
- **Background:** Warm Cream (#F5F5DC)
- **Border:** None
- **Shadow:** Flat, no shadow
- **Padding:** 20px
- **Hover:** Background lightens to Pale Champagne (#F0E6D2)

**Hero Section Container**
- **Background:** Full-width image with dark overlay (rgba(43, 43, 43, 0.5))
- **Text:** Warm Cream (#F5F5DC) or Soft Ivory (#FFFEF7)
- **Padding:** 80px 20px (vertical, horizontal)
- **Alignment:** Center-aligned content

**Section Container**
- **Background:** Alternating Warm Cream (#F5F5DC) and Soft Ivory (#FFFEF7)
- **Padding:** 60px 20px (desktop) / 40px 20px (mobile)
- **Max Width:** 1280px, centered

### Inputs & Forms

**Text Input / Textarea**
- **Shape:** Gently rounded corners (border-radius: 6px)
- **Background:** Soft Ivory (#FFFEF7)
- **Border:** 1px solid Pale Champagne (#F0E6D2)
- **Text:** Deep Charcoal (#2B2B2B), Lato Regular, 1rem
- **Padding:** 12px 16px
- **Placeholder:** Rich Espresso (#3E2723) at 50% opacity
- **Focus:** Border changes to Champagne Gold (#D4AF37), 2px width, subtle glow (box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1))
- **Error:** Border changes to Error Burgundy (#C62828)
- **Disabled:** Background to Pale Champagne (#F0E6D2), text at 50% opacity

**Select Dropdown**
- **Styling:** Same as text input
- **Icon:** Champagne Gold (#D4AF37) chevron icon
- **Dropdown Menu:** Background Soft Ivory (#FFFEF7), border 1px Pale Champagne (#F0E6D2), shadow (0 4px 12px rgba(43, 43, 43, 0.12))
- **Option Hover:** Background Pale Champagne (#F0E6D2)

**Checkbox / Radio**
- **Shape:** Checkbox: 4px border-radius, Radio: circular
- **Size:** 20px × 20px
- **Border:** 2px solid Champagne Gold (#D4AF37)
- **Background:** Soft Ivory (#FFFEF7) unchecked, Champagne Gold (#D4AF37) checked
- **Checkmark:** Warm Cream (#F5F5DC) icon
- **Focus:** Glow ring (box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2))

**Form Labels**
- **Font:** Lato, 700
- **Size:** 0.875rem (14px)
- **Color:** Deep Charcoal (#2B2B2B)
- **Spacing:** 8px margin-bottom from input
- **Required Indicator:** Champagne Gold (#D4AF37) asterisk

### Navigation

**Header / Navbar**
- **Background:** Soft Ivory (#FFFEF7) with subtle shadow (0 2px 8px rgba(43, 43, 43, 0.06))
- **Height:** 80px (desktop) / 64px (mobile)
- **Logo:** Playfair Display, Champagne Gold (#D4AF37) accent
- **Links:** Lato Regular, Deep Charcoal (#2B2B2B), 1rem
- **Link Hover:** Color changes to Champagne Gold (#D4AF37), subtle underline
- **Active Link:** Champagne Gold (#D4AF37), bold weight
- **Mobile Menu:** Slide-in from right, full-height overlay with Warm Cream (#F5F5DC) background

**Footer**
- **Background:** Deep Charcoal (#2B2B2B)
- **Text:** Warm Cream (#F5F5DC), Lato Regular
- **Links:** Warm Cream (#F5F5DC), hover to Champagne Gold (#D4AF37)
- **Dividers:** Pale Champagne (#F0E6D2) at 30% opacity
- **Padding:** 60px 20px

**Breadcrumbs**
- **Font:** Lato Regular, 0.875rem
- **Color:** Rich Espresso (#3E2723)
- **Separator:** Champagne Gold (#D4AF37) chevron or slash
- **Current Page:** Champagne Gold (#D4AF37), bold

### Badges & Tags

**Status Badge (Available, Booked, Pending)**
- **Shape:** Pill-shaped (border-radius: 999px)
- **Padding:** 4px 12px
- **Font:** Lato Bold, 0.75rem (12px), uppercase
- **Available:** Background Success Green (#2E7D32) at 20% opacity, text Success Green
- **Booked:** Background Error Burgundy (#C62828) at 20% opacity, text Error Burgundy
- **Pending:** Background Alert Amber (#F57C00) at 20% opacity, text Alert Amber

**Category Tag**
- **Shape:** Subtly rounded (border-radius: 4px)
- **Background:** Pale Champagne (#F0E6D2)
- **Text:** Rich Espresso (#3E2723), Lato Regular, 0.875rem
- **Padding:** 6px 12px
- **Hover:** Background to Champagne Gold (#D4AF37), text to Warm Cream (#F5F5DC)

### Modals & Overlays

**Modal Container**
- **Background:** Soft Ivory (#FFFEF7)
- **Shape:** Moderately rounded (border-radius: 16px)
- **Shadow:** Deep elevation (0 16px 48px rgba(43, 43, 43, 0.2))
- **Max Width:** 600px
- **Padding:** 32px
- **Backdrop:** Deep Charcoal (#2B2B2B) at 60% opacity, blur effect

**Modal Header**
- **Font:** Playfair Display, 600, 2rem
- **Color:** Deep Charcoal (#2B2B2B)
- **Border Bottom:** 1px solid Pale Champagne (#F0E6D2)
- **Padding Bottom:** 16px

**Close Button**
- **Shape:** Circular (border-radius: 50%)
- **Size:** 32px × 32px
- **Background:** Transparent, hover to Pale Champagne (#F0E6D2)
- **Icon:** Deep Charcoal (#2B2B2B)

### Tables

**Table Header**
- **Background:** Pale Champagne (#F0E6D2)
- **Text:** Deep Charcoal (#2B2B2B), Lato Bold, 0.875rem, uppercase
- **Padding:** 16px
- **Border Bottom:** 2px solid Champagne Gold (#D4AF37)

**Table Row**
- **Background:** Soft Ivory (#FFFEF7), alternating Warm Cream (#F5F5DC)
- **Text:** Deep Charcoal (#2B2B2B), Lato Regular, 1rem
- **Padding:** 12px 16px
- **Border:** 1px solid Pale Champagne (#F0E6D2)
- **Hover:** Background to Pale Champagne (#F0E6D2)

### Loading States

**Spinner**
- **Color:** Champagne Gold (#D4AF37)
- **Size:** 40px (default), 24px (small)
- **Animation:** Smooth rotation, 1s duration

**Skeleton Loader**
- **Background:** Pale Champagne (#F0E6D2)
- **Animation:** Shimmer effect with Soft Ivory (#FFFEF7) gradient
- **Shape:** Matches target component (rounded corners as appropriate)

### Toasts / Notifications

**Success Toast**
- **Background:** Success Green (#2E7D32)
- **Text:** Soft Ivory (#FFFEF7)
- **Icon:** Checkmark, Soft Ivory
- **Shape:** Rounded (border-radius: 8px)
- **Shadow:** 0 4px 12px rgba(46, 125, 50, 0.3)

**Error Toast**
- **Background:** Error Burgundy (#C62828)
- **Text:** Soft Ivory (#FFFEF7)
- **Icon:** X or alert, Soft Ivory
- **Shape:** Rounded (border-radius: 8px)
- **Shadow:** 0 4px 12px rgba(198, 40, 40, 0.3)

**Info Toast**
- **Background:** Info Navy (#1565C0)
- **Text:** Soft Ivory (#FFFEF7)
- **Icon:** Info, Soft Ivory
- **Shape:** Rounded (border-radius: 8px)
- **Shadow:** 0 4px 12px rgba(21, 101, 192, 0.3)

---

## 5. Layout Principles

### Spacing System

**Base Unit:** 4px

**Spacing Scale:**
- **xs:** 4px (0.25rem) - Tight spacing within components
- **sm:** 8px (0.5rem) - Component internal padding
- **md:** 16px (1rem) - Standard element spacing
- **lg:** 24px (1.5rem) - Section internal spacing
- **xl:** 32px (2rem) - Between major sections
- **2xl:** 48px (3rem) - Large section gaps
- **3xl:** 64px (4rem) - Hero section padding
- **4xl:** 80px (5rem) - Major page divisions

### Grid System

**Container Max Width:** 1280px
**Gutter:** 24px (desktop) / 16px (mobile)

**Breakpoints:**
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
- **Wide Desktop:** > 1440px

**Column Grid:**
- **Desktop:** 12-column grid
- **Tablet:** 8-column grid
- **Mobile:** 4-column grid

### Whitespace Strategy

**Generous Breathing Room:** Luxury requires space. Maintain ample margins and padding to prevent visual crowding.

**Vertical Rhythm:** Consistent vertical spacing using the 4px base unit creates harmonious flow. Section padding follows the 2xl-4xl range.

**Content Width:** Body text constrained to 65-75 characters per line for optimal readability (approximately 700px max-width for text blocks).

**Card Spacing:** Minimum 24px gap between cards in grids, 32px for featured content.

### Alignment & Hierarchy

**Primary Alignment:** Center-aligned for hero sections and major headings; left-aligned for body content and forms.

**Visual Hierarchy:**
1. **Hero/Primary CTA:** Largest, Champagne Gold accent, maximum contrast
2. **Section Headers:** Playfair Display, generous top margin (3xl)
3. **Content Blocks:** Consistent padding (lg-xl), clear separation
4. **Supporting Elements:** Smaller scale, muted colors (Rich Espresso)

**Z-Index Layers:**
- **Base:** 0 (page content)
- **Elevated:** 10 (cards, dropdowns)
- **Fixed:** 100 (sticky headers)
- **Overlay:** 1000 (modals, toasts)
- **Top:** 9999 (critical alerts)

### Responsive Behavior

**Mobile-First Approach:** Design for smallest screens first, progressively enhance for larger viewports.

**Stacking:** Multi-column layouts stack vertically on mobile (< 640px).

**Touch Targets:** Minimum 44px × 44px for all interactive elements on mobile.

**Image Scaling:** Hero images scale proportionally, maintaining aspect ratio. Use `object-fit: cover` for consistency.

**Navigation:** Hamburger menu on mobile, full horizontal navigation on desktop (> 1024px).

---

## 6. Imagery & Media

### Photography Style

**Aesthetic:** High-quality, professionally shot images with warm tones. Imagery should evoke luxury, comfort, and hospitality.

**Color Grading:** Warm, golden-hour lighting preferred. Avoid overly cool or harsh lighting.

**Subjects:** Hotel interiors, gourmet food presentations, elegant table settings, serene room views.

**Overlays:** Dark overlays (rgba(43, 43, 43, 0.4-0.6)) on hero images to ensure text legibility.

### Icons

**Style:** Line icons (stroke-based) for modern, clean aesthetic
**Weight:** 2px stroke width
**Color:** Champagne Gold (#D4AF37) for primary actions, Deep Charcoal (#2B2B2B) for secondary
**Size:** 24px standard, 32px for prominent features, 16px for inline

**Icon Library:** Lucide React (as specified in tech stack)

### Animations & Transitions

**Duration:** 
- **Fast:** 150ms (micro-interactions, hover states)
- **Standard:** 300ms (most transitions, modals)
- **Slow:** 500ms (page transitions, complex animations)

**Easing:** 
- **Default:** ease-in-out (smooth, natural feel)
- **Entrance:** ease-out (elements entering view)
- **Exit:** ease-in (elements leaving view)

**Hover Effects:**
- Buttons: Background color change + shadow intensification
- Cards: Subtle lift (translateY) + shadow deepening
- Links: Color change + underline appearance

**Page Transitions:** Fade-in on load (opacity 0 to 1, 300ms)

**Scroll Animations:** Subtle fade-up for section reveals (optional, enhance UX without overwhelming)

---

## 7. Accessibility & Usability

### Contrast Ratios

All text meets WCAG AA standards:
- **Large Text (18px+):** Minimum 3:1 contrast
- **Normal Text:** Minimum 4.5:1 contrast
- **Interactive Elements:** Minimum 3:1 contrast against background

**Verified Combinations:**
- Deep Charcoal (#2B2B2B) on Warm Cream (#F5F5DC): ✓ Excellent
- Champagne Gold (#D4AF37) on Deep Charcoal (#2B2B2B): ✓ Good
- Warm Cream (#F5F5DC) on Champagne Gold (#D4AF37): ✓ Sufficient for large text

### Focus States

**Keyboard Navigation:** All interactive elements have visible focus indicators
**Focus Ring:** 3px solid Champagne Gold (#D4AF37) with 2px offset
**Skip Links:** "Skip to main content" link for screen readers

### Semantic HTML

Use proper heading hierarchy (H1 → H2 → H3), semantic tags (`<nav>`, `<main>`, `<footer>`, `<article>`), and ARIA labels where appropriate.

---

## 8. Voice & Tone

**Brand Voice:** Sophisticated, welcoming, attentive

**Copywriting Style:**
- **Headings:** Confident, aspirational ("Experience Unparalleled Luxury")
- **Body:** Warm, informative, professional
- **CTAs:** Action-oriented, inviting ("Reserve Your Stay", "Discover Our Rooms")
- **Errors:** Helpful, apologetic, solution-focused

**Terminology:**
- "Guest" instead of "User"
- "Reserve" instead of "Book" (more elegant)
- "Experience" instead of "Service"
- "Curated" instead of "Selected"

---

## Summary

This design system for **Rudraksh Inn** creates a cohesive, luxurious digital experience that mirrors the elegance of a 5-star resort. The palette of **Deep Charcoal, Champagne Gold, and Warm Cream** establishes a sophisticated foundation, while thoughtful typography, generous spacing, and refined component styling ensure every interaction feels premium and intentional.

The system prioritizes **visual hierarchy, accessibility, and responsive design**, ensuring guests enjoy a seamless experience across all devices. From the whisper-soft shadows on cards to the bold, inviting CTAs, every design decision reinforces the brand's commitment to excellence and hospitality.
