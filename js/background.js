/**
 * Interactive Orbital Mesh Background
 * A high-performance canvas-based background with floating points 
 * and connecting lines that react to mouse movement.
 */

class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };

        this.config = {
            particleCount: 80,
            particleColor: 'rgba(0, 183, 255, 0.4)',
            lineColor: 'rgba(0, 183, 255, 0.15)',
            particleRadius: 2,
            maxDistance: 150,
            repulsionForce: 100
        };

        this.init();
        this.animate();
        this.bindEvents();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // Re-populate on resize
    }

    createParticles() {
        this.particles = [];
        const count = (this.canvas.width * this.canvas.height) / 15000; // Density-based count
        const actualCount = Math.min(count, 120); // Cap at 120 for performance

        for (let i = 0; i < actualCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height, this.config));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.maxDistance) {
                    const opacity = 1 - distance / this.config.maxDistance;
                    this.ctx.strokeStyle = `rgba(0, 183, 255, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        this.drawLines();
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(maxWidth, maxHeight, config) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.config = config;

        this.init();
    }

    init() {
        this.x = Math.random() * this.maxWidth;
        this.y = Math.random() * this.maxHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * this.config.particleRadius + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    update(mouse) {
        // Standard movement
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > this.maxWidth) this.vx *= -1;
        if (this.y < 0 || this.y > this.maxHeight) this.vy *= -1;

        // Mouse interaction (repulsion)
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const dirX = dx / distance;
                const dirY = dy / distance;

                this.x -= dirX * force * 2;
                this.y -= dirY * force * 2;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.config.particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimation();
});
