# 📱 PetStore Responsive Grid - Visual Reference Guide

## 🎯 Column Scaling Visualization

### Mobile (320px - 640px)
```
┌─────────────────────────┐
│  PETSTORE              │  ← Navbar (responsive)
├─────────────────────────┤
│ ┌─────────┬─────────┐   │
│ │Product 1│Product 2│   │
│ └─────────┴─────────┘   │ ← 2 columns
│ ┌─────────┬─────────┐   │
│ │Product 3│Product 4│   │
│ └─────────┴─────────┘   │
│ ┌─────────┬─────────┐   │
│ │Product 5│Product 6│   │
│ └─────────┴─────────┘   │
│ Padding: 16px (mobile)  │
│ Gap: 16px               │
└─────────────────────────┘
```

### Tablet Portrait (640px - 960px)
```
┌──────────────────────────────┐
│ PETSTORE                     │ ← Navbar (expanded)
├──────────────────────────────┤
│ ┌────────┬────────┬────────┐ │
│ │Prod 1  │Prod 2  │Prod 3  │ │
│ └────────┴────────┴────────┘ │ ← 3 columns
│ ┌────────┬────────┬────────┐ │
│ │Prod 4  │Prod 5  │Prod 6  │ │
│ └────────┴────────┴────────┘ │
│ Padding: 24px (tablet)       │
│ Gap: 24px                    │
└──────────────────────────────┘
```

### Tablet Landscape (960px - 1200px)
```
┌────────────────────────────────────┐
│ PETSTORE                          │ ← Full navbar
├────────────────────────────────────┤
│ ┌────┬────┬────┬────┐             │
│ │Pr1 │Pr2 │Pr3 │Pr4 │             │
│ └────┴────┴────┴────┘             │ ← 4 columns
│ ┌────┬────┬────┬────┐             │
│ │Pr5 │Pr6 │Pr7 │Pr8 │             │
│ └────┴────┴────┴────┘             │
│ Padding: 24px                      │
│ Gap: 24px                          │
└────────────────────────────────────┘
```

### Desktop (1200px+) ⭐
```
┌─────────────────────────────────────────┐
│ PETSTORE                               │ ← Full navbar
├─────────────────────────────────────────┤
│ ┌──┬──┬──┬──┬──┐                       │
│ │P1│P2│P3│P4│P5│                       │
│ └──┴──┴──┴──┴──┘                       │ ← 5 columns!
│ ┌──┬──┬──┬──┬──┐                       │
│ │P6│P7│P8│P9│10│                       │
│ └──┴──┴──┴──┴──┘                       │
│ Max-width: 1400px (centered)           │
│ Padding: 32px                          │
│ Gap: 32px                              │
└─────────────────────────────────────────┘
```

---

## 📐 Spacing Diagram

### Padding & Margins
```
Mobile (16px):
┌──────────────────────────┐
│16 ┌──────────────────┐16 │
│px │   Main Content   │ px│
│   └──────────────────┘   │
└──────────────────────────┘
    ↑16px sections↑

Tablet (24px):
┌────────────────────────────────┐
│24 ┌──────────────────────┐24  │
│px │   Main Content       │ px │
│   └──────────────────────┘   │
└────────────────────────────────┘
    ↑24px sections↑

Desktop (32px):
┌──────────────────────────────────┐
│32 ┌────────────────────────┐32  │
│px │   Main Content         │ px │
│   └────────────────────────┘   │
└──────────────────────────────────┘
    ↑32px sections↑
```

---

## 🎨 Grid Gap Visualization

### 2 Columns (Mobile)
```
┌─────────┬16px┬─────────┐
│Product 1│    │Product 2│
└─────────┴────┴─────────┘
16px gap between items
```

### 3 Columns (Tablet)
```
┌────────┬24px┬────────┬24px┬────────┐
│Prod 1  │    │Prod 2  │    │Prod 3  │
└────────┴────┴────────┴────┴────────┘
24px gap between items
```

### 5 Columns (Desktop)
```
┌──┬32px┬──┬32px┬──┬32px┬──┬32px┬──┐
│P1│    │P2│    │P3│    │P4│    │P5│
└──┴────┴──┴────┴──┴────┴──┴────┴──┘
32px gap between items
```

---

## 📊 Breakpoint Timeline

```
Width progression:
0px ────────────────────────────────── 2560px

Mobile  Tablet  Medium  Desktop  Large
│        │       │       │       │
0       640     960    1200    1440    px
│        │       │       │       │
2 cols   3 cols  4 cols  5 cols  5 cols
16px     24px    24px    32px    32px
```

---

## 🔄 Responsive Transformation

### Breakpoint at 640px
```
Before (Mobile 2 cols):          After (Tablet 3 cols):
┌──────┬──────┐                  ┌────┬────┬────┐
│P1    │P2    │                  │P1  │P2  │P3  │
├──────┼──────┤   @ 640px        ├────┼────┼────┤
│P3    │P4    │  ────────────→   │P4  │P5  │P6  │
├──────┼──────┤                  └────┴────┴────┘
│P5    │P6    │
└──────┴──────┘
Gap: 16px → 24px
Padding: 16px → 24px
```

### Breakpoint at 960px
```
Before (Tablet 3 cols):          After (Medium 4 cols):
┌────┬────┬────┐                ┌──┬──┬──┬──┐
│P1  │P2  │P3  │                │P1│P2│P3│P4│
├────┼────┼────┤  @ 960px       ├──┼──┼──┼──┤
│P4  │P5  │P6  │  ────────────→ │P5│P6│P7│P8│
└────┴────┴────┘                └──┴──┴──┴──┘
Gap: 24px (stays)
Padding: 24px (stays)
```

### Breakpoint at 1200px
```
Before (Medium 4 cols):          After (Desktop 5 cols):
┌──┬──┬──┬──┐                   ┌─┬─┬─┬─┬─┐
│P1│P2│P3│P4│                   │P│P│P│P│P│
├──┼──┼──┼──┤  @ 1200px         ├─┼─┼─┼─┼─┤
│P5│P6│P7│P8│  ────────────────→│P│P│P│P│P│
└──┴──┴──┴──┘                   └─┴─┴─┴─┴─┘
Gap: 24px → 32px
Padding: 24px → 32px
Max-width: 1400px (NEW!)
```

---

## 🎯 Product Card Structure

### Mobile View (Full Width)
```
┌──────────────────┐
│   Image Area     │ ← Height: 100px-180px
│   (clamp value)  │
├──────────────────┤
│ Product Title    │ ← Font: 14px
│                  │ ← Max 2 lines
├──────────────────┤
│ $19.99 USD      │ ← Font: 16px, Bold
└──────────────────┘
16px padding
```

### Desktop View (5 columns)
```
┌─────────┐
│ Image   │ ← Height: clamp values
│ Area    │   responsive
├─────────┤
│ Title   │ ← Font: 14-16px
│         │   responsive
├─────────┤
│ Price   │ ← Font: 16px
│ 20%off  │   consistent
└─────────┘
32px gap between cards
32px padding around grid
```

---

## 📱 Device Examples

### iPhone SE (375px)
```
Width: 375px
Available: 343px (375 - 32px padding)
Per item: 171.5px (343 / 2)
Layout: 2 columns
```

### iPad Mini (640px)
```
Width: 640px
Available: 592px (640 - 48px padding)
Per item: 197px (592 / 3)
Layout: 3 columns
```

### iPad Pro (960px)
```
Width: 960px
Available: 912px (960 - 48px padding)
Per item: 228px (912 / 4)
Layout: 4 columns
```

### Desktop (1200px)
```
Width: 1200px
Available: 1136px (1200 - 64px padding)
Per item: 227px (1136 / 5)
Layout: 5 columns ⭐
```

### Large Monitor (1440px)
```
Width: 1440px
Max: 1400px (centered)
Available: 1336px (1400 - 64px padding)
Per item: 267px (1336 / 5)
Layout: 5 columns ⭐
```

---

## 🎨 Color & Styling

### Product Card States
```
Normal State:
┌─────────────┐
│ Product     │ → Shadow: light
│ Card        │ → Border: thin
│             │ → Background: white
└─────────────┘

Hover State:
┌─────────────┐
│ Product     │ → Transform: up 2px
│ Card        │ → Shadow: heavier
│ (raised)    │ → Border: same
│             │ → Background: white
└─────────────┘
```

---

## 📊 REM Unit Conversion

All sizes use REM (relative to 16px base):

```
Design Size → REM → Pixel
8px         0.5rem    8px
16px        1rem      16px (base)
24px        1.5rem    24px
32px        2rem      32px
48px        3rem      48px

Font sizes:
12px        0.75rem   12px ($font-xs)
14px        0.875rem  14px ($font-sm)
16px        1rem      16px ($font-base)
18px        1.125rem  18px ($font-lg)
24px        1.5rem    24px ($font-xl)
32px        2rem      32px ($font-2xl)
```

---

## 🔄 Animation/Transition

### Card Hover
```
Default:
- transform: none
- box-shadow: light

On Hover:
- transform: translateY(-2px) ← Move up
- box-shadow: heavier
- transition: 0.15s ease ← Smooth

Mouse Leave:
- Back to default smoothly
```

---

## 📐 Header Responsive

### Mobile Header
```
┌─────────────────────┐
│ [Menu] Brand [Cart] │ ← Icons only
│ h: 64px             │ ← Compact
│ Font: 14px          │
└─────────────────────┘
```

### Desktop Header
```
┌──────────────────────────────────────────────┐
│ [Menu] Brand [Link] [Link] [Search] [Cart]   │ ← Full
│ h: 72px                                      │ ← Spacious
│ Font: 16px                                   │
└──────────────────────────────────────────────┘
```

---

## ✨ Key Responsive Features

1. **Padding Scale**
   - Mobile: 16px
   - Tablet: 24px
   - Desktop: 32px

2. **Gap Scale**
   - Mobile: 16px
   - Tablet: 24px
   - Desktop: 32px

3. **Column Scale**
   - Mobile: 2 columns
   - Tablet: 3 columns
   - Medium: 4 columns
   - Desktop: 5 columns ⭐

4. **Font Scale**
   - Mobile: $font-sm (14px)
   - Desktop: $font-base (16px)

5. **Max Width**
   - Mobile: 100%
   - Desktop: 1400px (centered)

---

## 🎯 Testing Checklist

Visual verification points:

- [ ] Mobile (375px): 2 columns, 16px spacing
- [ ] Tablet (640px): 3 columns, 24px spacing
- [ ] Medium (960px): 4 columns, 24px spacing
- [ ] Desktop (1200px): 5 columns, 32px spacing
- [ ] Cards have equal heights
- [ ] Images scale proportionally
- [ ] No horizontal scrolling
- [ ] Hover states work smoothly
- [ ] Padding increases at breakpoints
- [ ] Gaps increase at breakpoints

---

## 🚀 Browser DevTools Tips

### Measure Columns
```
1. DevTools → Elements
2. Right-click product grid
3. Select "Inspect"
4. DevTools shows: width/height of each column
5. Verify: width / columns = per-item width
```

### Check Spacing
```
1. DevTools → Elements
2. Hover over grid container
3. See: padding (colored), gap (hatched)
4. Verify: padding matches breakpoint
5. Verify: gap matches breakpoint
```

### Responsive Testing
```
1. DevTools → Device Mode (Ctrl+Shift+M)
2. Select device from dropdown
3. Or drag to custom width
4. Watch columns scale smoothly
5. Verify at 375, 640, 960, 1200px
```

---

## 📖 Quick Reference

### Columns by Breakpoint
```
< 640px:   2 cols
640px:     3 cols
960px:     4 cols
1200px:    5 cols
```

### Spacing by Breakpoint
```
< 640px:   16px (md)
640px:     24px (lg)
960px:     24px (lg)
1200px:    32px (xl)
```

### Max Widths
```
Mobile:    100% minus padding
Tablet:    100% minus padding
Desktop:   1400px (centered)
```

---

**This visual reference guide helps you understand and test the responsive grid layout!**
