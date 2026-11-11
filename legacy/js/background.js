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
        this.mouse = { x: null, y: null, radius: 180 };

        this.config = {
            particleCount: 100,
            particleColor: 'rgba(0, 210, 255, 0.7)',
            lineColor: 'rgba(0, 210, 255, 0.3)',
            particleRadius: 2.5,
            maxDistance: 170,
            repulsionForce: 120
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
        const count = (this.canvas.width * this.canvas.height) / 12000; // Increased density
        const actualCount = Math.min(count, 150); // Increased cap for premium feel

        for (let i = 0; i < actualCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height, this.config));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance);
                    this.ctx.strokeStyle = `rgba(0, 210, 255, ${opacity * 0.4})`;
                    this.ctx.lineWidth = 0.8;
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
        this.vx = (Math.random() - 0.5) * 0.4; // Slightly slower/smoother movement
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * this.config.particleRadius + 1;
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

                this.x -= dirX * force * 3;
                this.y -= dirY * force * 3;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.config.particleColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 210, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for lines
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimation();
});
