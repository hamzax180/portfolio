# Particle System - Technical Implementation

## Overview
The particle background creates an immersive futuristic atmosphere using Canvas API for optimal performance.

---

## Configuration

```javascript
const particleConfig = {
  count: 100,              // Number of particles
  color: '#00f0ff',        // Cyan neon color
  minSize: 1,              // Minimum particle radius
  maxSize: 3,              // Maximum particle radius
  speed: 0.5,              // Base movement speed
  connectDistance: 150,    // Max distance for line connections
  mouseRadius: 100         // Mouse interaction radius
};
```

---

## Particle Class

```javascript
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = random(config.minSize, config.maxSize);
    this.speedX = random(-config.speed, config.speed);
    this.speedY = random(-config.speed, config.speed);
    this.opacity = random(0.3, 1);
  }
  
  update(mouseX, mouseY) {
    // Move particle
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.speedY *= -1;
    }
    
    // Mouse repulsion
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < config.mouseRadius) {
      const force = (config.mouseRadius - distance) / config.mouseRadius;
      this.x -= dx * force * 0.05;
      this.y -= dy * force * 0.05;
    }
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
    ctx.fill();
  }
}
```

---

## Connection Lines

```javascript
function drawConnections(particles, ctx) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.connectDistance) {
        // Opacity based on distance
        const opacity = 1 - (distance / config.connectDistance);
        
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
```

---

## Animation Loop

```javascript
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update(mouse.x, mouse.y);
    particle.draw(ctx);
  });
  
  drawConnections(particles, ctx);
  
  requestAnimationFrame(animate);
}
```

---

## Performance Optimizations

1. **Spatial Hashing**: Only check nearby particles for connections
2. **Throttled Mouse Tracking**: Update mouse position every 16ms max
3. **Adaptive Particle Count**: Reduce on mobile devices
4. **Canvas Layer**: Separate from main content for GPU compositing

---

## Responsive Handling

```javascript
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Adjust particle count for mobile
  const isMobile = window.innerWidth < 768;
  targetCount = isMobile ? 50 : 100;
  
  // Redistribute particles
  particles.forEach(p => {
    p.x = Math.min(p.x, canvas.width);
    p.y = Math.min(p.y, canvas.height);
  });
}

window.addEventListener('resize', debounce(handleResize, 250));
```
