# SCSS Migration Quick Reference

## 🎯 Quick Start

### Import Design System in Any SCSS File
```scss
@use "../styles/variables" as *;
@use "../styles/mixins" as *;
```

## 📏 Spacing Scale
```
$spacing-xs   = 4px   (0.25rem)
$spacing-sm   = 8px   (0.5rem)
$spacing-md   = 16px  (1rem)      ← Most common
$spacing-lg   = 20px  (1.25rem)
$spacing-xl   = 24px  (1.5rem)
$spacing-2xl  = 32px  (2rem)      ← Sections
$spacing-3xl  = 40px  (2.5rem)
$spacing-4xl  = 48px  (3rem)
```

## 🔤 Font Sizes
```
$font-xs    = 12px   (0.75rem)    ← Small text
$font-sm    = 14px   (0.875rem)   ← Normal
$font-base  = 16px   (1rem)       ← Base
$font-lg    = 18px   (1.125rem)   ← Headings
$font-xl    = 20px   (1.25rem)
$font-2xl   = 24px   (1.5rem)     ← Large sections
$font-3xl   = 30px   (1.875rem)
$font-4xl   = 36px   (2.25rem)    ← Main title
```

## 📱 Responsive Breakpoints
```
Mobile:          0px (default)
Small Tablet:    640px ($bp-sm)
Tablet:          960px ($bp-md)
Desktop:         1200px ($bp-lg)
Large Desktop:   1440px ($bp-2xl)
```

## 🎨 Common Colors
```
$text      = Text color
$muted     = Muted/secondary text
$border    = Border color
$bg        = Background
$panel     = Panel background
$brand     = Brand primary color
```

## 📝 Common Usage Patterns

### Card Component
```scss
.myCard {
    @include card();           // Adds shadow & border
    padding: $spacing-md;      // 16px padding
    border-radius: $radius;    // 14px radius
}
```

### Button Component
```scss
.myButton {
    @include button();         // Primary button style
    
    &:hover {
        @include button("hover");
    }
}
```

### Grid Layout
```scss
.gridContainer {
    display: grid;
    gap: $spacing-md;          // 16px gap
    grid-template-columns: repeat(3, 1fr);
    
    @include respond-to($bp-md) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @include respond-to($bp-sm) {
        grid-template-columns: 1fr;
    }
}
```

### Flex Layout
```scss
.flexContainer {
    display: flex;
    gap: $spacing-sm;          // 8px gap
    align-items: center;
    
    @include flex-direction-aware();  // RTL aware
}
```

### Responsive Padding
```scss
.container {
    padding: 0 $spacing-md;    // Mobile
    
    @include respond-to($bp-md) {
        padding: 0 $spacing-lg;  // Tablet+
    }
}
```

### Text Alignment (RTL safe)
```scss
.header {
    @include text-align-aware(center);  // Works in RTL
}
```

## ❌ DO NOT

```scss
// ❌ WRONG - Hardcoded pixels
.card {
    padding: 16px;
    margin: 8px 0;
    gap: 12px;
    border-radius: 14px;
    font-size: 18px;
}

// ✅ CORRECT - Use variables
.card {
    padding: $spacing-md;
    margin: $spacing-xs 0;
    gap: $spacing-sm;
    border-radius: $radius;
    font-size: $font-lg;
}
```

## 🚀 Common Patterns

### Product Card
```scss
.productCard {
    @include card();
    border-radius: $radius;
    overflow: hidden;
    padding: 0;
    cursor: pointer;
    transition: transform 0.15s ease;
    
    &:hover {
        transform: translateY(-2px);
    }
}

.productImage {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.productInfo {
    padding: $spacing-md;
    display: grid;
    gap: $spacing-xs;
}

.productTitle {
    font-weight: 700;
    color: $text;
}

.productPrice {
    font-size: $font-xl;
    color: $brand;
    font-weight: 800;
}
```

### Section Header
```scss
.sectionHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 $spacing-lg;
    
    h2 {
        font-size: $font-lg;
        font-weight: 800;
        margin: 0;
        color: $text;
    }
}
```

### Form Group
```scss
.formGroup {
    display: grid;
    gap: $spacing-md;
    
    @include respond-to($bp-md) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.formControl {
    input, textarea, select {
        width: 100%;
        padding: $spacing-md;
        border: 1px solid $border;
        border-radius: $radius;
        font-size: $font-base;
    }
}
```

### Admin Table
```scss
.tableContainer {
    @include card();
    overflow: hidden;
    
    table {
        width: 100%;
        border-collapse: collapse;
        
        th {
            padding: $spacing-md;
            background: $panel;
            font-weight: 700;
            text-align: left;
        }
        
        td {
            padding: $spacing-md;
            border-top: 1px solid $border;
        }
        
        tr:hover {
            background: rgba(0, 0, 0, 0.02);
        }
    }
}
```

## 🔍 Debugging

### Find hardcoded pixels
```bash
# Search for px; patterns
grep -r "px;" src/styles/ src/components/ src/pages/
```

### Check variable usage
```bash
# Verify variables are imported
grep "@use.*variables" src/**/*.scss
```

### Validate breakpoint usage
```bash
# Check breakpoint consistency
grep "@include respond-to" src/**/*.scss
```

## 📊 Migration Checklist for New Files

When creating new `.scss` files:
- [ ] Import variables and mixins: `@use "../styles/variables" as *;`
- [ ] Use only REM-based sizing (spacing/font variables)
- [ ] No hardcoded pixel values
- [ ] Use `@include respond-to()` for responsive design
- [ ] Use `@include logical-*()` for RTL support
- [ ] Use `@include card()` for card components
- [ ] Use `@include button()` for buttons
- [ ] Test in both LTR (English) and RTL (Hebrew) modes
- [ ] Verify build: `npm run build`

## 🎯 Performance Tips

1. **Reuse mixins** - Don't repeat styles
2. **Use utility classes** - Available in `_responsive.scss`
3. **Group media queries** - Use `@include respond-to()`
4. **Limit nesting** - Maximum 3-4 levels deep
5. **Prefer variables** - Over magic numbers

## 🧪 Testing

### Responsive Design
```bash
# Test on multiple devices
DevTools → Toggle device toolbar (Ctrl+Shift+M)
# Test breakpoints: 375px, 640px, 960px, 1200px, 1440px
```

### RTL Mode
```bash
# In DevTools console
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'he';
```

### Build Check
```bash
npm run build
# Look for: "✓ built" message
# No "Undefined variable" errors
```

---

**Last Updated:** 2024
**Version:** 1.0 (Complete)
**Status:** Production Ready ✅
