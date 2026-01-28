/**
 * Tech/Neon Cursor with Magnetic Pull Effect
 */

class NeonCursor {
    constructor() {
        if (this.isTouchDevice()) return;
        
        this.cursor = null;
        this.dot = null;
        this.ring = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.ringX = 0;
        this.ringY = 0;
        this.magnetX = 0;
        this.magnetY = 0;
        this.isMagnetic = false;
        this.magnetStrength = 0.35;
        this.magnetRadius = 80;
        
        this.init();
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               window.matchMedia('(pointer: coarse)').matches;
    }
    
    init() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'neon-cursor';
        
        this.dot = document.createElement('div');
        this.dot.className = 'neon-dot';
        
        this.ring = document.createElement('div');
        this.ring.className = 'neon-ring';
        
        this.cursor.appendChild(this.dot);
        this.cursor.appendChild(this.ring);
        document.body.appendChild(this.cursor);
        
        document.body.classList.add('neon-cursor-active');
        
        this.bindEvents();
        this.setupMagnetics();
        this.animate();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursor.classList.add('visible');
            this.checkMagnetic(e);
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.classList.remove('visible');
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.classList.add('visible');
        });
        
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        });
    }
    
    setupMagnetics() {
        const magneticElements = document.querySelectorAll(
            'a, button, .btn, .project-card, .skill-item, .skill-category, .stat-item, .detail-card, .contact-card, nav a, .social-links a'
        );
        
        magneticElements.forEach(el => {
            el.setAttribute('data-magnetic', 'true');
            
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.isMagnetic = false;
                this.magnetX = 0;
                this.magnetY = 0;
            });
        });
    }
    
    checkMagnetic(e) {
        const magneticElements = document.querySelectorAll('[data-magnetic="true"]');
        let closestDist = Infinity;
        let closestEl = null;
        
        magneticElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
            
            if (dist < this.magnetRadius && dist < closestDist) {
                closestDist = dist;
                closestEl = { el, centerX, centerY, rect };
            }
        });
        
        if (closestEl) {
            this.isMagnetic = true;
            const pullX = (closestEl.centerX - e.clientX) * this.magnetStrength;
            const pullY = (closestEl.centerY - e.clientY) * this.magnetStrength;
            this.magnetX = pullX;
            this.magnetY = pullY;
        } else {
            this.isMagnetic = false;
            this.magnetX = 0;
            this.magnetY = 0;
        }
    }
    
    animate() {
        const ease = 0.12;
        
        // Target positions with magnetic pull
        const targetX = this.mouseX + this.magnetX;
        const targetY = this.mouseY + this.magnetY;
        
        // Smooth trailing for ring
        this.ringX += (targetX - this.ringX) * ease;
        this.ringY += (targetY - this.ringY) * ease;
        
        // Dot follows with slight smoothing when magnetic
        const dotEase = this.isMagnetic ? 0.25 : 1;
        const dotX = this.mouseX + (this.magnetX * dotEase);
        const dotY = this.mouseY + (this.magnetY * dotEase);
        
        this.dot.style.left = dotX + 'px';
        this.dot.style.top = dotY + 'px';
        this.ring.style.left = this.ringX + 'px';
        this.ring.style.top = this.ringY + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NeonCursor();
});
