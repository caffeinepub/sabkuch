# Sabkuch.com Shopping Website

## Current State
A fully built shopping website for Sabkuch.com with:
- Sticky navbar with search, cart, and login
- Hero section with banner image
- Category grid (Electronics, Fashion, Home & Kitchen, Beauty, Sports, Books)
- Flash sale countdown banner
- Product grid with filtering/sorting
- Cart drawer
- Footer with contact info (wrong phone number: +91 98765 43210, wrong location: Mumbai, Maharashtra)
- Purple/indigo color scheme throughout

## Requested Changes (Diff)

### Add
- Ramzan special products: Dates (Khajoor), Attar/Itar Perfume, Ramzan Decoration Lights, Seviyan (Vermicelli) — affordable prices (₹99–₹699), with badge "Ramzan Special"
- Holi special products: Holi Colors Set, Pichkari Water Gun, Holi Sweets Box, White Kurta for Holi — affordable prices (₹99–₹599), with badge "Holi Special"
- New "Festivals" category to CATEGORIES list with Moon/Star icon (Ramzan + Holi products)
- Category-wise horizontal scrollable product carousel sections — below the main grid, one carousel per major category (Electronics, Fashion, Festivals, etc.) showing 4–5 products per row with left/right arrow navigation buttons. Users can hover on a category and slide through similar products
- Two new category types: "Festivals" and keep existing ones

### Modify
- Footer "Get in Touch" phone number: change from +91 98765 43210 to +91 80529 32370
- Footer location: change from "Mumbai, Maharashtra, India" to "Uttar Pradesh, India"
- Color scheme: replace purple/indigo primary with a warm coral-orange or teal-green palette. Change `--primary` from deep violet (oklch 0.38 0.18 285) to a warm teal/emerald (oklch 0.5 0.15 175) or warm coral. Background should feel lighter and more festive, less corporate blue/purple
- `bg-brand-gradient` and `bg-hero-gradient` should use the new warm color
- `text-gradient-brand` should use the new colors
- Category icon for Festivals — add a new icon (Star or Gift from lucide)
- CATEGORIES array: add "Festivals" entry
- MockProducts: add Ramzan and Holi products

### Remove
- Nothing to remove

## Implementation Plan
1. Update `mockProducts.ts`:
   - Add "Festivals" to `Category` type
   - Add CATEGORIES entry for "Festivals" with Star icon and green/gold gradient
   - Add 8 new festival products (4 Ramzan + 4 Holi) with affordable pricing and festival badges
   - Add ICON_MAP entry for Star in App.tsx

2. Update `index.css`:
   - Change `--primary` to warm teal: oklch(0.48 0.16 175)
   - Change `--primary-foreground` stays white
   - Change `--secondary` to light teal tint: oklch(0.93 0.03 175)
   - Change `--muted`, `--border`, `--ring`, `--input` to match teal hue
   - Change `--brand-purple` to teal: oklch(0.48 0.16 175)
   - Change `bg-brand-gradient` to warm teal-to-emerald gradient
   - Change `bg-hero-gradient` to match
   - Change `text-gradient-brand` to teal-to-orange gradient
   - Keep brand-orange as-is (accent stays vibrant orange)

3. Update `App.tsx`:
   - Add Star icon to ICON_MAP
   - Add category-wise horizontal carousel sections after the main products grid
   - Each carousel: title showing category name, left/right arrow buttons, horizontally scrollable row of ProductCard-style mini cards (showing 2 on mobile, 4 on desktop), smooth scroll behavior
   - The carousel should filter products by category and show them horizontally

4. Update footer in `App.tsx`:
   - Phone: `tel:+918052932370` display `+91 80529 32370`
   - Location: `Uttar Pradesh, India`
