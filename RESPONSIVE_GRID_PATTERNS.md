# 🎨 PetStore Responsive CSS Grid Patterns Reference

## Pattern 1: Product Grid (2 → 5 Columns)

Perfect for product listings, category grids, brand displays.

```scss
.productGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  // Mobile: 2 items
    gap: $spacing-md;                        // Mobile gap: 16px
    width: 100%;

    // Tablet: 3 columns
    @include respond-to($bp-sm) {
        grid-template-columns: repeat(3, 1fr);
        gap: $spacing-lg;                    // Tablet gap: 24px
    }

    // Medium: 4 columns  
    @include respond-to($bp-md) {
        grid-template-columns: repeat(4, 1fr);
        gap: $spacing-lg;
    }

    // Desktop: 5 columns
    @include respond-to($bp-lg) {
        grid-template-columns: repeat(5, 1fr);
        gap: $spacing-xl;                    // Desktop gap: 32px
    }
}

.productCard {
    display: flex;
    flex-direction: column;
    height: 100%;                            // Fill grid cell
    border-radius: $radius;
    overflow: hidden;
    
    .cardImage {
        height: clamp(100px, 25vw, 180px);  // Responsive image height
        object-fit: cover;
        flex-shrink: 0;
    }
    
    .cardContent {
        flex-grow: 1;                        // Grow to fill remaining space
        padding: $spacing-md;
        display: grid;
        gap: $spacing-xs;
    }
}
```

---

## Pattern 2: Section Responsive Container

Use for all major sections on homepage, catalog, etc.

```scss
.section {
    padding: 0 $spacing-md;                 // Mobile: 16px horizontal
    margin: $spacing-2xl 0;                 // Mobile: 32px vertical
    width: 100%;

    @include respond-to($bp-sm) {
        padding: 0 $spacing-lg;             // Tablet: 24px
        margin: $spacing-3xl 0;             // Tablet: 48px
    }

    @include respond-to($bp-lg) {
        padding: 0 $spacing-xl;             // Desktop: 32px
        max-width: 1400px;                  // Constrain width
        margin: $spacing-3xl auto;          // Center with auto margins
    }
}

.sectionHeader {
    margin-bottom: $spacing-md;
    
    h2 {
        font-size: $font-lg;                // Mobile: 18px
        
        @include respond-to($bp-md) {
            font-size: $font-xl;            // Tablet+: 24px
        }
    }
}

.sectionContent {
    // Your grid here
}
```

---

## Pattern 3: Footer Grid (1 → 4 Columns)

Responsive footer with different column counts.

```scss
.footerGrid {
    display: grid;
    gap: $spacing-md;
    grid-template-columns: 1fr;             // Mobile: 1 column
    padding: $spacing-2xl $spacing-md;
    max-width: 1400px;
    margin: 0 auto;

    @include respond-to($bp-sm) {
        grid-template-columns: repeat(2, minmax(0, 1fr));  // Tablet: 2 cols
        gap: $spacing-lg;
        padding: $spacing-2xl $spacing-lg;
    }

    @include respond-to($bp-md) {
        grid-template-columns: repeat(4, minmax(0, 1fr));  // Desktop: 4 cols
        gap: $spacing-lg;
        padding: $spacing-2xl $spacing-xl;
    }
}

.footerColumn {
    display: grid;
    gap: $spacing-md;
}

.footerTitle {
    font-weight: 800;
    font-size: $font-xs;
    text-transform: uppercase;
}

.footerList {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
        margin-bottom: $spacing-xs;
        
        a {
            color: $muted;
            transition: color 0.2s ease;
            
            &:hover {
                color: $brand;
            }
        }
    }
}
```

---

## Pattern 4: Hero Banner (Full Width with Negative Margin)

For hero sections that bleed to edges on mobile.

```scss
.heroBanner {
    width: calc(100% + $spacing-md * 2);    // Bleed to edges
    margin-left: -$spacing-md;
    margin-right: -$spacing-md;
    margin-top: $spacing-md;
    margin-bottom: $spacing-xl;
    border-radius: $radius;
    overflow: hidden;

    @include respond-to($bp-sm) {
        width: 100%;                        // Stop bleeding at tablet
        margin-left: 0;
        margin-right: 0;
        border-radius: $radius;
    }

    img {
        width: 100%;
        height: clamp(160px, 35vw, 400px);  // Responsive height
        object-fit: cover;
        display: block;
    }
}
```

---

## Pattern 5: Category Cubes (Centered Content)

For centered category displays.

```scss
.categoryCube {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    height: 100%;                           // Fill grid cell
    padding: $spacing-lg;
    border: 1px solid $border;
    border-radius: $radius;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 34px rgba(17, 24, 39, 0.08);
    }
}

.categoryIcon {
    width: 3rem;
    height: 3rem;
    border-radius: $radius;
    display: grid;
    place-items: center;
    background: #FFF7ED;
    font-size: $font-2xl;
    flex-shrink: 0;
}

.categoryName {
    font-weight: 700;
    font-size: $font-sm;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    text-align: center;
}
```

---

## Pattern 6: Responsive Text Sizes

For text that scales across breakpoints.

```scss
.heading {
    font-size: $font-lg;                    // Mobile: 18px
    
    @include respond-to($bp-sm) {
        font-size: $font-xl;                // Tablet: 24px
    }
    
    @include respond-to($bp-md) {
        font-size: $font-2xl;               // Desktop: 32px
    }
}

.body {
    font-size: $font-sm;                    // Mobile: 14px
    
    @include respond-to($bp-md) {
        font-size: $font-base;              // Desktop: 16px
    }
}

.caption {
    font-size: $font-xs;                    // Mobile: 12px
    
    @include respond-to($bp-md) {
        font-size: $font-sm;                // Desktop: 14px
    }
}
```

---

## Pattern 7: Flexible Flex Layout (Backup)

When grid doesn't work, use flexbox.

```scss
.flexGrid {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin: -$spacing-md / 2;               // Negative margin trick

    @include respond-to($bp-lg) {
        gap: $spacing-xl;
        margin: -$spacing-xl / 2;
    }
}

.flexItem {
    flex: 0 1 calc(50% - $spacing-md / 2);  // 2 items per row
    
    @include respond-to($bp-sm) {
        flex-basis: calc(33.333% - $spacing-md / 2);  // 3 items
    }
    
    @include respond-to($bp-md) {
        flex-basis: calc(25% - $spacing-lg / 2);      // 4 items
    }
    
    @include respond-to($bp-lg) {
        flex-basis: calc(20% - $spacing-xl / 2);      // 5 items
    }
}
```

---

## 🎯 When to Use Each Pattern

| Pattern | Use Case | Best For |
|---------|----------|----------|
| Pattern 1 | Product Grid (2→5 cols) | Products, categories, brands |
| Pattern 2 | Section Container | All major sections |
| Pattern 3 | Footer Grid (1→4 cols) | Footer layouts |
| Pattern 4 | Hero Banner | Full-width banners |
| Pattern 5 | Category Cubes | Category/icon displays |
| Pattern 6 | Text Scaling | Typography across breakpoints |
| Pattern 7 | Flex Fallback | When grid not needed |

---

## 📏 REM-Based Spacing System

```scss
// Spacing (multiples of 8px base)
$spacing-xs:   0.5rem;   // 8px
$spacing-sm:   1rem;     // 16px
$spacing-md:   1.5rem;   // 24px
$spacing-lg:   1.5rem;   // 24px
$spacing-xl:   2rem;     // 32px
$spacing-2xl:  2.5rem;   // 40px
$spacing-3xl:  3rem;     // 48px

// Font Sizes
$font-xs:    0.75rem;    // 12px
$font-sm:    0.875rem;   // 14px
$font-base:  1rem;       // 16px
$font-lg:    1.125rem;   // 18px
$font-xl:    1.5rem;     // 24px
$font-2xl:   2rem;       // 32px

// Breakpoints
$bp-sm:  640px;          // Tablet
$bp-md:  960px;          // Medium
$bp-lg:  1200px;         // Desktop
$bp-2xl: 1440px;         // Large
```

---

## ✨ Pro Tips

1. **Always use `height: 100%` on grid items** to make cards equal height
2. **Use `flex-grow: 1` on content areas** to push footer content down
3. **Use `clamp()` for responsive sizing** instead of fixed breakpoints
4. **Always include gap** - it's cleaner than margin hacks
5. **Use `grid-template-columns: repeat(N, 1fr)`** for equal width columns
6. **Use `minmax(0, 1fr)` in grid-template-columns** for better overflow handling
7. **Mobile-first approach**: Start with 1-2 columns, add more at larger breakpoints
8. **Test at actual breakpoints**: 375px, 640px, 960px, 1200px, 1440px

---

## 🔄 Migration Checklist

When migrating components to responsive grid:

- [ ] Convert fixed widths to responsive `grid-template-columns`
- [ ] Replace padding hacks with `gap`
- [ ] Add `height: 100%` to cards for equal heights
- [ ] Use `flex-grow: 1` for content areas
- [ ] Test at all 5 breakpoints
- [ ] Verify RTL mode (if applicable)
- [ ] Remove MUI Grid Container/Item (if using CSS Grid)
- [ ] Update SCSS modules with design variables
- [ ] Test product card images don't stretch
- [ ] Verify category cubes stay centered

---

## 🎉 Result

Clean, modern, responsive layouts with:
✅ Mobile-first design (2 cols base)
✅ Scalable grid (2 → 5 columns)
✅ REM-based consistent spacing
✅ Perfect breakpoint alignment
✅ Better performance than sliders
✅ Cleaner HTML structure
✅ Zero JavaScript overhead
