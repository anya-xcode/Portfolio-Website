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

    // 6. Typing Effect for Hero
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const phrases = [
            'Building Full-Stack Web Applications',
            'Creating User-Friendly Interfaces',
            'Solving Complex Problems with Code',
            'Crafting Scalable MERN Stack Apps',
            'Turning Ideas into Reality'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before new phrase
            }

            setTimeout(typeEffect, typingSpeed);
        }

        // Start typing after a short delay
        setTimeout(typeEffect, 1000);
    }

    // 7. Minimal CSS for reveal effect (Injected)
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

    // 8. Project Filtering (Full Stack / AI ML)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const viewMoreContainer = document.getElementById('view-more-container');

    function filterProjects(category) {
        let visibleCount = 0;
        let hasHiddenInCategory = false;

        projectCards.forEach((card) => {
            const isMatch = card.getAttribute('data-category') === category;
            
            if (isMatch) {
                // If it's a match, we decide to show it based on hidden-project class
                if (card.classList.contains('hidden-project')) {
                    if (viewMoreBtn && viewMoreBtn.classList.contains('expanded')) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.add('show'), 10);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('show');
                        hasHiddenInCategory = true;
                    }
                } else {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 10);
                }
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
            }
        });

        // Show/Hide View More button based on category
        if (hasHiddenInCategory || (viewMoreBtn && viewMoreBtn.classList.contains('expanded') && category === 'full-stack')) {
            viewMoreContainer.style.display = 'flex';
        } else {
            viewMoreContainer.style.display = 'none';
        }
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                const category = btn.getAttribute('data-filter');
                filterProjects(category);
                
                // Reset View More button if switching categories
                if (viewMoreBtn && viewMoreBtn.classList.contains('expanded')) {
                    // We don't necessarily reset it, but the filter function handles the display
                }
            });
        });
    }

    // 9. View More Projects Toggle (Updated for Filter)
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            const isExpanded = viewMoreBtn.classList.contains('expanded');
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            
            if (isExpanded) {
                viewMoreBtn.classList.remove('expanded');
                viewMoreBtn.innerHTML = '<span>View More Projects</span> <i class="fas fa-chevron-down"></i>';
            } else {
                viewMoreBtn.classList.add('expanded');
                viewMoreBtn.innerHTML = '<span>Show Less</span> <i class="fas fa-chevron-up"></i>';
            }
            
            filterProjects(activeCategory);
        });
    }

    // Initialize with Full Stack
    filterProjects('full-stack');

    // 10. Resume Dropdowns (nav + hero)
    const resumeDropdowns = document.querySelectorAll('.resume-dropdown');

    function closeAllResumeMenus(except) {
        resumeDropdowns.forEach(dd => {
            if (dd === except) return;
            dd.classList.remove('open');
            const toggle = dd.querySelector('.resume-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    resumeDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.resume-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !dropdown.classList.contains('open');
            closeAllResumeMenus(dropdown);
            dropdown.classList.toggle('open', willOpen);
            toggle.setAttribute('aria-expanded', String(willOpen));
        });

        // Close once a resume is picked
        dropdown.querySelectorAll('.resume-menu a').forEach(link => {
            link.addEventListener('click', () => closeAllResumeMenus());
        });
    });

    // Close on outside click or Escape
    document.addEventListener('click', () => closeAllResumeMenus());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllResumeMenus();
    });

    // 11. Footer - auto year + back to top
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});