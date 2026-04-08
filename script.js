document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate toggle lines
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');

            if (navToggle) {
                // Reset toggle lines
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in');

    if (revealElements.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 4. Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Booking Form Handling
    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('formStatus');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (name && email) {
                // Animate button to show progress
                const btn = bookingForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Processing...';
                btn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    formStatus.innerHTML = '<p style="color: var(--secondary); font-weight: 500;"><i class="fas fa-check-circle"></i> Inquiry sent successfully. Our team will contact you shortly.</p>';
                    bookingForm.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            }
        });
    }

    // 6. Smooth Scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - (navHeight - 20),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 7. Hero Scroll Animation
    const hero = document.querySelector('.hero');

    if (hero && !reducedMotion) {
        let ticking = false;

        const updateHeroMotion = () => {
            const rect = hero.getBoundingClientRect();
            const travel = Math.max(rect.height * 0.9, 1);
            const progress = Math.min(Math.max((0 - rect.top) / travel, 0), 1);
            const parallaxY = Math.min(window.scrollY * 0.45, 420);
            const fade = Math.max(1 - (progress * 0.55), 0.45);
            const tilt = progress * 4;

            hero.style.setProperty('--hero-progress', progress.toFixed(3));
            hero.style.setProperty('--hero-parallax-y', `${parallaxY.toFixed(2)}px`);
            hero.style.setProperty('--hero-fade', fade.toFixed(3));
            hero.style.setProperty('--hero-image-tilt', `${tilt.toFixed(2)}deg`);

            ticking = false;
        };

        const onHeroScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeroMotion);
                ticking = true;
            }
        };

        updateHeroMotion();
        window.addEventListener('scroll', onHeroScroll, { passive: true });
        window.addEventListener('resize', updateHeroMotion);
    }

    // 8. Modern scroll animation for sections after About
    const animatedSections = document.querySelectorAll(
        '#experience, #gallery, .pool-parallax, #reviews, #contact, .map-section, .footer'
    );

    if (animatedSections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else if (entry.intersectionRatio < 0.05) {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: [0.08, 0.25, 0.45],
            rootMargin: '0px 0px -8% 0px'
        });

        animatedSections.forEach((section) => sectionObserver.observe(section));

        if (!reducedMotion) {
            let sectionTicking = false;

            const updateSectionProgress = () => {
                const viewportHeight = window.innerHeight || 1;

                animatedSections.forEach((section) => {
                    const rect = section.getBoundingClientRect();
                    const progressRaw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                    const progress = Math.min(Math.max(progressRaw, 0), 1);
                    section.style.setProperty('--section-progress', progress.toFixed(3));
                });

                sectionTicking = false;
            };

            const onSectionScroll = () => {
                if (!sectionTicking) {
                    requestAnimationFrame(updateSectionProgress);
                    sectionTicking = true;
                }
            };

            updateSectionProgress();
            window.addEventListener('scroll', onSectionScroll, { passive: true });
            window.addEventListener('resize', updateSectionProgress);
        }
    }

    // 9. Mouse-based 3D tilt for hero image
    const tiltCards = document.querySelectorAll('.interactive-tilt');

    tiltCards.forEach((card) => {
        const maxTilt = reducedMotion ? 6 : 10;
        const baseTransform = 'perspective(1200px) rotateX(0deg) rotateY(-5deg)';
        card.style.transform = baseTransform;

        const handleMove = (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const rotateY = ((x - 0.5) * (maxTilt * 2)).toFixed(2);
            const rotateX = (((0.5 - y) * (maxTilt * 2))).toFixed(2);

            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
            card.classList.add('is-tilting');
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('pointermove', handleMove);

        card.addEventListener('mouseleave', () => {
            card.style.transform = baseTransform;
            card.classList.remove('is-tilting');
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = baseTransform;
            card.classList.remove('is-tilting');
        });
    });
});
