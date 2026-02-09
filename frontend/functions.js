/* ============================================
   HAMZA AL-AHDAL PORTFOLIO - MAIN SCRIPTS
   ============================================ */

// === Particle System ===
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };

        // Get colors based on theme
        this.updateColors();

        this.config = {
            count: window.innerWidth < 768 ? 50 : 100,
            color: this.particleColor,
            minSize: 1,
            maxSize: 3,
            speed: 0.5,
            connectDistance: 120
        };

        this.init();

        // Listen for theme changes
        this.observeTheme();
    }

    updateColors() {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLightMode) {
            // Blue particles for light mode - more visible
            this.particleColor = { r: 59, g: 130, b: 246 };
            this.lineColor = 'rgba(59, 130, 246,';
        } else {
            // Cyan particles for dark mode
            this.particleColor = { r: 0, g: 240, b: 255 };
            this.lineColor = 'rgba(0, 240, 255,';
        }
    }

    observeTheme() {
        // Watch for theme attribute changes
        const observer = new MutationObserver(() => {
            this.updateColors();
            this.config.color = this.particleColor;
            // Update existing particles
            this.particles.forEach(p => {
                p.config.color = this.particleColor;
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.count; i++) {
            this.particles.push(new Particle(this.canvas, this.config));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.config.count = window.innerWidth < 768 ? 50 : 100;
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectDistance) {
                    const opacity = 1 - (distance / this.config.connectDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `${this.lineColor} ${opacity * 0.4})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        this.speedX = (Math.random() - 0.5) * config.speed;
        this.speedY = (Math.random() - 0.5) * config.speed;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.config.color.r}, ${this.config.color.g}, ${this.config.color.b}, ${this.opacity})`;
        ctx.fill();
    }
}

// === Typewriter Effect ===
class Typewriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// === Scroll Animations ===
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => observer.observe(el));
    }
}

// === Skill Bar Animation ===
class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    entry.target.style.width = progress + '%';
                }
            });
        }, { threshold: 0.5 });

        this.bars.forEach(bar => observer.observe(bar));
    }
}

// === Counter Animation ===
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };

        update();
    }
}

// === Mobile Navigation ===
class MobileNav {
    constructor() {
        this.toggle = document.getElementById('navToggle');
        this.links = document.getElementById('navLinks');
        this.init();
    }

    init() {
        if (this.toggle && this.links) {
            this.toggle.addEventListener('click', () => {
                this.links.classList.toggle('active');
                this.toggle.classList.toggle('active');
            });

            // Close menu on link click
            this.links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.links.classList.remove('active');
                    this.toggle.classList.remove('active');
                });
            });
        }
    }
}

// === Smooth Scroll ===
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// === Initialize Everything ===
document.addEventListener('DOMContentLoaded', () => {
    // Particle System
    new ParticleSystem();

    // Typewriter
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        new Typewriter(typewriterElement, [
            'AI & Full-Stack Developer',
            'Machine Learning Enthusiast',
            'Problem Solver',
            'Computer Science Student'
        ]);
    }

    // Scroll Animations
    new ScrollAnimator();

    // Skill Bars
    new SkillBars();

    // Counter Animation
    new CounterAnimation();

    // Mobile Navigation
    new MobileNav();

    // Smooth Scroll
    new SmoothScroll();
});
