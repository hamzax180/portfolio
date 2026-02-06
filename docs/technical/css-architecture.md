# CSS Architecture - Technical Implementation

## Design System

### Color Variables

```css
:root {
  /* Neon Colors */
  --neon-cyan: #00f0ff;
  --neon-magenta: #ff00ff;
  --neon-purple: #a855f7;
  --neon-blue: #3b82f6;
  
  /* Background */
  --bg-dark: #0a0a0f;
  --bg-card: rgba(255, 255, 255, 0.05);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 8rem;
  
  /* Animation */
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

---

## Glassmorphism Implementation

```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

---

## Neon Glow Effects

### Text Glow
```css
.neon-text {
  color: var(--neon-cyan);
  text-shadow:
    0 0 5px var(--neon-cyan),
    0 0 10px var(--neon-cyan),
    0 0 20px var(--neon-cyan),
    0 0 40px var(--neon-cyan);
}
```

### Box Glow
```css
.neon-border {
  border: 2px solid var(--neon-cyan);
  box-shadow:
    0 0 5px var(--neon-cyan),
    0 0 10px var(--neon-cyan),
    inset 0 0 5px rgba(0, 240, 255, 0.1);
}
```

---

## Animation Keyframes

### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Pulse Glow
```css
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 5px var(--neon-cyan);
  }
  50% {
    box-shadow: 
      0 0 10px var(--neon-cyan),
      0 0 20px var(--neon-cyan);
  }
}
```

### Float
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Tablet */
@media (min-width: 768px) {
  .container { max-width: 720px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

---

## 3D Card Tilt Effect

```css
.project-card {
  transform-style: preserve-3d;
  transition: transform var(--transition-medium);
}

.project-card:hover {
  transform: 
    perspective(1000px)
    rotateX(5deg)
    rotateY(-5deg)
    translateZ(10px);
}
```

---

## Scroll Animation Classes

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: 
    opacity var(--transition-slow),
    transform var(--transition-slow);
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered delays */
.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
```
