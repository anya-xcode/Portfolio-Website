/**
 * Portfolio Interaction Scripts
 * Handles smooth scrolling, reveal animations on scroll,
 * and header state transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Reveal on Scroll (Intersection Observer)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('section, .project-card, .skill-category, .contact-card');
    revealElements.forEach(el => {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
    });

    // 4. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 5. Hero Content Reveal
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 1s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.15}s`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });

    // 6. Minimal CSS for reveal effect (Injected)
    const style = document.createElement('style');
    style.textContent = `
        .reveal-init {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .reveal-init.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Grid items staggered reveal */
        .project-card:nth-child(n) { transition-delay: calc(var(--i, 0) * 0.1s); }
        .skill-category:nth-child(n) { transition-delay: calc(var(--i, 0) * 0.1s); }
        
        header.scrolled {
            padding: 0.8rem 2rem;
            background: rgba(10, 12, 16, 0.9);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
    `;
    document.head.appendChild(style);

    // 7. View More Projects Toggle
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const hiddenProjects = document.querySelectorAll('.project-card.hidden-project');

    if (viewMoreBtn && hiddenProjects.length > 0) {
        viewMoreBtn.addEventListener('click', () => {
            const isExpanded = viewMoreBtn.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse - hide projects
                hiddenProjects.forEach(project => {
                    project.classList.remove('show');
                });
                viewMoreBtn.classList.remove('expanded');
                viewMoreBtn.innerHTML = 'View More Projects <i class="fas fa-chevron-down"></i>';
            } else {
                // Expand - show projects with staggered animation
                hiddenProjects.forEach((project, index) => {
                    setTimeout(() => {
                        project.classList.add('show');
                    }, index * 100);
                });
                viewMoreBtn.classList.add('expanded');
                viewMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
            }
        });
    }
});