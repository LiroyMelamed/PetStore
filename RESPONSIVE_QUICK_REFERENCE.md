# Quick Reference - REM & Responsive Utilities

## Spacing Variables Quick Lookup

| Variable | Value | Pixels |
|----------|-------|--------|
| `$spacing-xs` | 0.25rem | 4px |
| `$spacing-sm` | 0.5rem | 8px |
| `$spacing-md` | 0.875rem | 14px |
| `$spacing-lg` | 1rem | 16px |
| `$spacing-xl` | 1.5rem | 24px |
| `$spacing-2xl` | 2rem | 32px |
| `$spacing-3xl` | 2.5rem | 40px |
| `$spacing-4xl` | 3rem | 48px |

## Font Size Variables

| Variable | Value | Pixels |
|----------|-------|--------|
| `$font-xs` | 0.75rem | 12px |
| `$font-sm` | 0.875rem | 14px |
| `$font-base` | 1rem | 16px |
| `$font-lg` | 1.125rem | 18px |
| `$font-xl` | 1.25rem | 20px |
| `$font-2xl` | 1.5rem | 24px |
| `$font-3xl` | 1.875rem | 30px |
| `$font-4xl` | 2.25rem | 36px |

## Breakpoints

| Device | Variable | Value | Pixels |
|--------|----------|-------|--------|
| Mobile | `$bp-xs` | 0rem | 0px |
| Tablet | `$bp-sm` | 40rem | 640px |
| Desktop | `$bp-md` | 60rem | 960px |
| Large Desktop | `$bp-lg` | 75rem | 1200px |
| XL | `$bp-xl` | 90rem | 1440px |

---

## Common SCSS Patterns

### Responsive Padding
```scss
.element {
    padding: $spacing-md;
    
    @include respond-to("md") {
        padding: $spacing-lg;
    }
}
```

### Responsive Font Size
```scss
.heading {
    @include responsive-font($font-2xl, clamp($font-2xl, 5vw, $font-4xl), $font-4xl);
}
```

### Responsive Grid
```scss
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    
    @include respond-to("sm") {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @include respond-to("lg") {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### RTL-Aware Layout
```scss
.row {
    display: flex;
    gap: $spacing-lg;
    
    @include flex-direction-aware(row, row-reverse);
}
```

---

## Common Utility Classes

### Margin & Padding
```html
<!-- Horizontal padding -->
<div class="px-3"></div>  <!-- 0.875rem on both sides -->
<div class="px-4"></div>  <!-- 1rem on both sides -->

<!-- Vertical padding -->
<div class="py-3"></div>  <!-- 0.875rem top & bottom -->
<div class="py-5"></div>  <!-- 1.5rem top & bottom -->

<!-- All sides -->
<div class="p-3"></div>   <!-- 0.875rem all sides -->

<!-- Margin -->
<div class="mx-auto"></div> <!-- Centers horizontally -->
<div class="my-4"></div>    <!-- 1rem top & bottom -->
```

### Flexbox
```html
<!-- Container -->
<div class="flex items-center justify-between gap-3">
    <div>Left</div>
    <div>Right</div>
</div>

<!-- Column layout -->
<div class="flex flex-col gap-2">
    <div>Item 1</div>
    <div>Item 2</div>
</div>

<!-- Alignment -->
<div class="flex items-start"></div>
<div class="flex items-center"></div>
<div class="flex items-end"></div>

<!-- Justification -->
<div class="flex justify-between"></div>
<div class="flex justify-around"></div>
<div class="flex justify-center"></div>
```

### Grid
```html
<!-- Auto-responsive grid -->
<div class="auto-grid">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
</div>

<!-- Small items -->
<div class="auto-grid-small">
    <div>Item</div>
</div>

<!-- Large items -->
<div class="auto-grid-large">
    <div>Big Card</div>
</div>
```

### Display
```html
<!-- Hide on mobile, show on tablet+ -->
<div class="hidden-sm">Desktop only</div>

<!-- Show on mobile, hide on tablet+ -->
<div class="visible-sm-only">Mobile only</div>

<!-- General display -->
<div class="hidden"></div>
<div class="block"></div>
<div class="flex"></div>
<div class="grid"></div>
```

### Text
```html
<!-- Font sizes -->
<span class="text-xs">Small</span>      <!-- 12px -->
<span class="text-sm">Small</span>      <!-- 14px -->
<span class="text-base">Normal</span>   <!-- 16px -->
<span class="text-lg">Large</span>      <!-- 18px -->
<span class="text-xl">Extra Large</span> <!-- 20px -->

<!-- Colors -->
<p class="text-white">White text</p>
<p class="text-muted">Muted text</p>
<p class="text-danger">Red text</p>

<!-- Alignment -->
<p class="text-start">Aligned to start (LTR: left, RTL: right)</p>
<p class="text-end">Aligned to end (LTR: right, RTL: left)</p>
```

### Width & Height
```html
<div class="w-full">Full width</div>
<div class="w-auto">Auto width</div>

<div class="h-full">Full height</div>
<div class="h-screen">Full viewport height</div>

<div class="max-w-lg">Max width: 32rem</div>
<div class="max-w-4xl">Max width: 56rem</div>
```

### Borders & Radius
```html
<div class="border">Full border</div>
<div class="border-t">Top border only</div>
<div class="border-b">Bottom border only</div>

<div class="rounded">Normal radius (14px)</div>
<div class="rounded-lg">Large radius (10px)</div>
<div class="rounded-full">Pill shape</div>
```

### Shadows
```html
<div class="shadow-sm">Subtle shadow</div>
<div class="shadow">Standard shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
```

---

## Responsive Padding Pattern

Automatically adjusts based on screen size:
```html
<div class="container">
    Content here
</div>
```

| Screen | Padding | Pixels |
|--------|---------|--------|
| Mobile | 1rem | 16px |
| Tablet | 1.5rem | 24px |
| Desktop | 2rem | 32px |
| Large | 3rem | 48px |

---

## Media Query Usage in SCSS

```scss
// Tablet and up
@include respond-to("sm") {
    // tablet styles
}

// Desktop and up
@include respond-to("md") {
    // desktop styles
}

// Large desktop and up
@include respond-to("lg") {
    // large desktop styles
}

// XL and up
@include respond-to("xl") {
    // XL styles
}

// 2XL and up
@include respond-to("2xl") {
    // 2XL styles
}
```

---

## RTL Specific Patterns

### Direction-Aware Flexbox
```scss
.sidebar {
    display: flex;
    @include flex-direction-aware(column, column);
    // Same on both RTL and LTR
}

.header {
    display: flex;
    @include flex-direction-aware(row, row-reverse);
    // LTR: row | RTL: row-reverse
}
```

### Direction-Aware Text
```scss
.title {
    @include text-align-aware(left, right);
    // LTR: text-align: left | RTL: text-align: right
}
```

### Direction-Aware Spacing
```scss
.content {
    @include logical-padding($top: $spacing-lg, $right: $spacing-md, $bottom: $spacing-lg, $left: $spacing-md);
    // Automatically flips left/right in RTL mode
}
```

---

## Aspect Ratio Classes

```html
<div class="aspect-square">1:1</div>
<div class="aspect-video">16:9</div>
```

---

## Color Classes

```html
<!-- Background colors -->
<div class="bg-white">White background</div>
<div class="bg-gray">Gray background</div>
<div class="bg-brand">Brand color background</div>
<div class="bg-danger">Danger color background</div>

<!-- Text colors -->
<div class="text-white">White text</div>
<div class="text-gray">Gray text</div>
<div class="text-brand">Brand color text</div>
<div class="text-danger">Danger color text</div>

<!-- Opacity -->
<div class="opacity-50">50% opacity</div>
<div class="opacity-75">75% opacity</div>
<div class="opacity-100">100% opacity</div>
```

---

## Gap Classes

```html
<div class="flex gap-1">Small gap</div>
<div class="flex gap-3">Medium gap</div>
<div class="flex gap-5">Large gap</div>
```

---

## Tips & Tricks

### 1. Centering Content
```html
<!-- Flex center -->
<div class="flex items-center justify-center">Centered</div>

<!-- Margin center -->
<div class="mx-auto">Horizontally centered</div>
```

### 2. Responsive Text
```html
<h1 class="heading-responsive">Scales with viewport</h1>
<p class="text-responsive">Body text scales smoothly</p>
```

### 3. Auto-Responsive Grid
```html
<!-- Automatically creates 2-4 columns based on space -->
<div class="auto-grid">
    <card/>
    <card/>
    <card/>
</div>
```

### 4. Mobile-Only Sections
```html
<div class="visible-sm-only">
    <!-- Only shown on mobile -->
</div>

<div class="hidden-sm">
    <!-- Hidden on mobile, shown on tablet+ -->
</div>
```

---

## Common Pixel-to-REM Conversions

| Pixels | REM | Variable |
|--------|-----|----------|
| 4px | 0.25rem | `$spacing-xs` |
| 8px | 0.5rem | `$spacing-sm` |
| 12px | 0.75rem | `$font-xs` |
| 14px | 0.875rem | `$spacing-md`, `$font-sm` |
| 16px | 1rem | `$spacing-lg`, `$font-base` |
| 18px | 1.125rem | `$font-lg` |
| 20px | 1.25rem | `$font-xl` |
| 24px | 1.5rem | `$spacing-xl`, `$font-2xl` |
| 32px | 2rem | `$spacing-2xl` |
| 36px | 2.25rem | `$font-4xl` |

---

## Troubleshooting

### Spacing doesn't match mockup?
- Check the variable name (e.g., `$spacing-lg` not `$spacing-large`)
- Remember: base is 16px, so calculations are px/16
- Example: 24px = 24/16 = 1.5rem = `$spacing-xl`

### RTL not working?
- Make sure language is set to 'he'
- Check `document.dir` in browser console
- Clear localStorage and refresh

### Mobile view looks cramped?
- Use `@include respond-to("sm")` to increase padding on larger screens
- Apply `@include container-padding()` to containers

### Grid doesn't wrap?
- Use `.auto-grid` instead of manual grid-template-columns
- Or use `@include respond-to()` to change columns at breakpoints
