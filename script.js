document.addEventListener('DOMContentLoaded', () => {
    
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
            // Reset toggle lines
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
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

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in');
    revealElements.forEach(el => revealObserver.observe(el));

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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
});
