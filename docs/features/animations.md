# Animations & Effects Feature

## Particle Background

### Description
Interactive particle system creating a futuristic cosmic atmosphere.

### Behavior
- Particles float and drift across the screen
- Mouse interaction causes nearby particles to react
- Performance-optimized with requestAnimationFrame
- Responsive to screen resize

---

## Glassmorphism Effects

### Description
Modern frosted glass UI elements with blur and transparency.

### Applied To
- Project cards
- About section card
- Chat window
- Navigation bar

### CSS Technique
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## Neon Glow Effects

### Description
Cyberpunk-style glowing borders and text shadows.

### Colors Used
- Cyan: `#00f0ff`
- Magenta: `#ff00ff`
- Purple: `#a855f7`

### Applications
- Skill badges
- Button hovers
- Section titles
- Chat bubble

---

## Scroll Animations

### Description
Elements animate into view as user scrolls.

### Implementation
- Intersection Observer API
- CSS transitions triggered by `.visible` class
- Staggered delays for sequential elements

---

## Hover Effects

### Description
Interactive feedback on hoverable elements.

### Effects
- 3D card tilt on project cards
- Scale transform on buttons
- Glow intensification on skill badges
- Color transitions on links
