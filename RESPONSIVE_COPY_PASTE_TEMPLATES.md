# 📋 Responsive Grid Implementation - Copy/Paste Templates

Use these templates for applying responsive grid to other pages and components.

---

## Template 1: Standard Product/Item Grid

Use for any grid showing 2→5 items.

### SCSS (Copy to your .module.scss)
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  // Mobile: 2 cols
    gap: $spacing-md;
    width: 100%;

    @include respond-to($bp-sm) {
        grid-template-columns: repeat(3, 1fr);  // Tablet: 3 cols
        gap: $spacing-lg;
    }

    @include respond-to($bp-md) {
        grid-template-columns: repeat(4, 1fr);  // Medium: 4 cols
        gap: $spacing-lg;
    }

    @include respond-to($bp-lg) {
        grid-template-columns: repeat(5, 1fr);  // Desktop: 5 cols
        gap: $spacing-xl;
    }
}

.gridItem {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;

    > * {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
}

.card {
    display: flex;
    flex-direction: column;
    border: 1px solid $border;
    border-radius: $radius;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 34px rgba(17, 24, 39, 0.08);
    }
}

.cardImage {
    height: clamp(100px, 25vw, 200px);
    object-fit: cover;
    display: block;
    flex-shrink: 0;
}

.cardContent {
    padding: $spacing-md;
    flex-grow: 1;
    display: grid;
    gap: $spacing-xs;
}

.cardTitle {
    font-weight: 700;
    font-size: $font-sm;
    line-height: 1.25;
    min-height: 2.4em;
}

.cardPrice {
    color: $brand;
    font-weight: 800;
    font-size: $font-base;
}
```

### JSX (Copy to your component)
```jsx
import styles from './YourComponent.module.scss';

export default function YourGrid({ items }) {
    return (
        <div className={styles.grid}>
            {items.map(item => (
                <div key={item.id} className={styles.gridItem}>
                    <div className={styles.card}>
                        <img 
                            src={item.image} 
                            alt={item.title}
                            className={styles.cardImage}
                        />
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <div className={styles.cardPrice}>${item.price}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
```

---

## Template 2: Section with Responsive Container

Use for any main section on a page.

### SCSS
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.section {
    padding: 0 $spacing-md;                 // Mobile: 16px
    margin: $spacing-2xl auto;              // Mobile: 32px
    width: 100%;

    @include respond-to($bp-sm) {
        padding: 0 $spacing-lg;             // Tablet: 24px
        margin: $spacing-3xl auto;          // Tablet: 48px
    }

    @include respond-to($bp-lg) {
        padding: 0 $spacing-xl;             // Desktop: 32px
        max-width: 1400px;                  // Constrain width
    }
}

.sectionHeader {
    margin-bottom: $spacing-md;

    h2 {
        font-size: $font-lg;                // Mobile: 18px
        font-weight: 800;
        margin: 0;

        @include respond-to($bp-md) {
            font-size: $font-xl;            // Desktop: 24px
        }
    }
}

.sectionContent {
    // Your grid here
}
```

### JSX
```jsx
export default function MySection() {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>My Section Title</h2>
            </div>
            <div className={styles.sectionContent}>
                {/* Your grid component here */}
            </div>
        </section>
    );
}
```

---

## Template 3: Footer Multi-Column Grid

Use for footer with 1→4 columns.

### SCSS
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.footer {
    margin-top: $spacing-2xl;
    border-top: 1px solid $border;
    background: #FFFFFF;
    box-shadow: 0 -6px 16px rgba(17, 24, 39, 0.04);
    padding: 0 $spacing-md;

    @include respond-to($bp-sm) {
        padding: 0 $spacing-lg;
    }

    @include respond-to($bp-lg) {
        padding: 0 $spacing-xl;
    }
}

.footerGrid {
    display: grid;
    gap: $spacing-md;
    grid-template-columns: 1fr;                     // Mobile: 1 col
    padding: $spacing-2xl 0;
    max-width: 1400px;
    margin: 0 auto;

    @include respond-to($bp-sm) {
        grid-template-columns: repeat(2, minmax(0, 1fr));  // Tablet: 2 cols
        gap: $spacing-lg;
    }

    @include respond-to($bp-md) {
        grid-template-columns: repeat(4, minmax(0, 1fr));  // Desktop: 4 cols
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
    color: $muted;
    letter-spacing: 0.06em;
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

### JSX
```jsx
export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.footerColumn}>
                    <h3 className={styles.footerTitle}>About</h3>
                    <ul className={styles.footerList}>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                {/* More columns... */}
            </div>
        </footer>
    );
}
```

---

## Template 4: Hero Banner (Full Bleed)

Use for hero sections that bleed to edges on mobile.

### SCSS
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.hero {
    width: calc(100% + $spacing-md * 2);    // Bleed to edges
    margin-left: -$spacing-md;
    margin-right: -$spacing-md;
    margin-top: $spacing-md;
    margin-bottom: $spacing-xl;
    border-radius: $radius;
    overflow: hidden;
    background: #f8fafc;

    @include respond-to($bp-sm) {
        width: 100%;                        // Stop bleeding
        margin-left: 0;
        margin-right: 0;
        border-radius: $radius;
    }
}

.heroBanner {
    display: block;
}

.heroImage {
    width: 100%;
    height: clamp(160px, 35vw, 400px);      // Responsive height
    object-fit: cover;
    display: block;
}

.heroSlider {
    // For Slick carousel inside hero
}

.slickDots {
    bottom: $spacing-xs;

    li button:before {
        font-size: 10px;
        color: white;
        opacity: 0.6;
    }

    li.slick-active button:before {
        color: white;
        opacity: 1;
    }
}
```

### JSX
```jsx
export default function HeroBanner({ image, alt }) {
    return (
        <div className={styles.hero}>
            <img 
                src={image} 
                alt={alt}
                className={styles.heroImage}
            />
        </div>
    );
}
```

---

## Template 5: Icon Grid (Categories)

Use for category displays with icons.

### SCSS
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  // Mobile: 2 cols
    gap: $spacing-md;

    @include respond-to($bp-sm) {
        grid-template-columns: repeat(3, 1fr);  // Tablet: 3 cols
        gap: $spacing-lg;
    }

    @include respond-to($bp-lg) {
        grid-template-columns: repeat(5, 1fr);  // Desktop: 5 cols
        gap: $spacing-xl;
    }
}

.cube {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    border: 1px solid $border;
    border-radius: $radius;
    background: #FFF;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    height: 100%;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 34px rgba(17, 24, 39, 0.08);
    }
}

.icon {
    width: 3rem;
    height: 3rem;
    display: grid;
    place-items: center;
    border-radius: $radius;
    background: #FFF7ED;
    font-size: $font-2xl;
    flex-shrink: 0;
}

.label {
    font-weight: 700;
    font-size: $font-sm;
    text-align: center;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
}
```

### JSX
```jsx
export default function CategoryGrid({ categories }) {
    return (
        <div className={styles.grid}>
            {categories.map(cat => (
                <div key={cat.id} className={styles.cube}>
                    <div className={styles.icon}>{cat.icon}</div>
                    <div className={styles.label}>{cat.name}</div>
                </div>
            ))}
        </div>
    );
}
```

---

## Template 6: Two-Column Layout

Use for pages needing sidebar + content.

### SCSS
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.container {
    display: grid;
    gap: $spacing-md;
    grid-template-columns: 1fr;            // Mobile: 1 col

    @include respond-to($bp-md) {
        grid-template-columns: 200px 1fr;  // Desktop: sidebar + content
        gap: $spacing-lg;
    }

    @include respond-to($bp-lg) {
        grid-template-columns: 250px 1fr;  // Large: wider sidebar
        gap: $spacing-xl;
    }

    padding: 0 $spacing-md;
    max-width: 1400px;
    margin: 0 auto;
}

.sidebar {
    // Sidebar styles
}

.content {
    // Content styles
}
```

### JSX
```jsx
export default function TwoColumnLayout({ sidebar, content }) {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>{sidebar}</div>
            <div className={styles.content}>{content}</div>
        </div>
    );
}
```

---

## Template 7: Flexible Responsive Text

Use for typography that scales.

### SCSS
```scss
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.h1 {
    font-size: $font-xl;                // Mobile: 24px
    font-weight: 900;
    line-height: 1.1;

    @include respond-to($bp-md) {
        font-size: $font-3xl;           // Desktop: 48px
    }
}

.h2 {
    font-size: $font-lg;                // Mobile: 18px
    font-weight: 800;

    @include respond-to($bp-md) {
        font-size: $font-2xl;           // Desktop: 32px
    }
}

.h3 {
    font-size: $font-base;              // Mobile: 16px
    font-weight: 800;

    @include respond-to($bp-md) {
        font-size: $font-xl;            // Desktop: 24px
    }
}

.body {
    font-size: $font-sm;                // Mobile: 14px
    line-height: 1.6;

    @include respond-to($bp-md) {
        font-size: $font-base;          // Desktop: 16px
    }
}

.caption {
    font-size: $font-xs;                // Mobile: 12px

    @include respond-to($bp-md) {
        font-size: $font-sm;            // Desktop: 14px
    }
}
```

### JSX
```jsx
export default function Text() {
    return (
        <>
            <h1 className={styles.h1}>Responsive Heading</h1>
            <p className={styles.body}>Responsive body text</p>
            <p className={styles.caption}>Responsive caption</p>
        </>
    );
}
```

---

## Quick Reference: Grid Column Patterns

### 2-Column Scaling (Mobile→Tablet)
```scss
grid-template-columns: repeat(2, 1fr);  // @include respond-to($bp-sm)
grid-template-columns: repeat(3, 1fr);  // @include respond-to($bp-md)
grid-template-columns: repeat(4, 1fr);  // @include respond-to($bp-lg)
```

### 1-Column to Multiple
```scss
grid-template-columns: 1fr;             // Mobile
@include respond-to($bp-sm) {
    grid-template-columns: repeat(2, 1fr);  // Tablet
}
@include respond-to($bp-md) {
    grid-template-columns: repeat(4, 1fr);  // Desktop
}
```

### Auto-Fit (Advanced)
```scss
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// Automatically creates columns based on available space
```

---

## Common Mistakes to Avoid

❌ **Don't use fixed widths**
```scss
// ❌ WRONG
.grid {
    grid-template-columns: 300px 300px 300px;
}
```

✅ **Do use fractions**
```scss
// ✅ CORRECT
.grid {
    grid-template-columns: repeat(3, 1fr);
}
```

---

❌ **Don't forget gap**
```scss
// ❌ WRONG - cards touching
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
```

✅ **Do add gap**
```scss
// ✅ CORRECT - proper spacing
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-md;
}
```

---

❌ **Don't use fixed heights on cards**
```scss
// ❌ WRONG - content overflows or cuts off
.card {
    height: 300px;
}
```

✅ **Do use flex**
```scss
// ✅ CORRECT - adapts to content
.card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.cardContent {
    flex-grow: 1;
}
```

---

## When to Use Each Template

| Template | Use Case | Example Pages |
|----------|----------|---------------|
| 1 | Product grids | Catalog, Home products |
| 2 | Main sections | Home sections |
| 3 | Footer layouts | Any footer |
| 4 | Hero banners | Home page hero |
| 5 | Icon grids | Categories, brands |
| 6 | Two columns | Product detail |
| 7 | Scaling text | All typography |

---

## 🎯 Implementation Steps

1. **Copy template** that matches your use case
2. **Replace variable names** with your component names
3. **Adjust column counts** for your breakpoints
4. **Import design variables** (`@use "../../styles/variables" as *;`)
5. **Test at all breakpoints** (375px, 640px, 960px, 1200px)
6. **Verify mobile first** - start mobile, add complexity

---

## 📝 Responsive Grid Checklist

- [ ] Starts with `grid-template-columns: repeat(N, 1fr)`
- [ ] Has `gap` defined
- [ ] Uses `@include respond-to()` for breakpoints
- [ ] Contains `height: 100%` on grid items
- [ ] Uses `flex-grow: 1` for content
- [ ] Tested at 5 breakpoints
- [ ] No horizontal scroll on mobile
- [ ] Images scale properly
- [ ] Works in RTL mode

---

**Copy these templates into your components and adapt as needed! 🚀**
