# SVG Icons Guide

## Changing Icon Colors

To make your SVG icons responsive to Tailwind color classes, follow these steps:

### 1. Update the SVG File

Replace hardcoded colors with `currentColor`:

**Before:**
```svg
<path d="..." stroke="white" />
```

**After:**
```svg
<path d="..." stroke="currentColor" />
```

Or for filled icons:
```svg
<path d="..." fill="currentColor" />
```

### 2. Use Color Classes in Components

Import the SVG with `?react` and apply Tailwind classes:

```tsx
import MyIcon from './my-icon.svg?react'

export function MyComponent() {
  return (
    <button className="text-white hover:text-purple-600">
      <MyIcon className="transition-colors duration-300" />
    </button>
  )
}
```

### 3. Available Color Classes

- `text-offwhite` - White text
- `text-darkpurple` - Dark purple text
- `text-inkblack` - Black text
- `active:text-darkpurple` - Color on click
- `hover:text-*` - Color on hover

The icon inherits the parent's `text-*` color automatically.

---

**Example:** Check `NavBottom.tsx` for a complete implementation.
