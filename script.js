// ========================================
// CINDERELLA TEAM 1942 - MAIN SCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Video play button ---
    const playBtn = document.getElementById('videoPlayBtn');
    const robotVideo = document.getElementById('robotVideo');
    if (playBtn && robotVideo) {
        playBtn.addEventListener('click', () => {
            robotVideo.controls = true;
            robotVideo.play();
            playBtn.style.display = 'none';
        });
        playBtn.addEventListener('mouseenter', () => { playBtn.style.background = 'rgba(180,60,0,0.85)'; });
        playBtn.addEventListener('mouseleave', () => { playBtn.style.background = 'rgba(0,0,0,0.65)'; });
    }

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile hamburger menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Scroll animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Hero floating particles ---
    const hero = document.getElementById('hero');
    if (hero) {
        createParticles(hero, 25);
    }

    // --- Staggered animation for grid items ---
    const staggerContainers = document.querySelectorAll('.stats-grid, .dept-grid, .team-grid, .robots-grid, .sponsors-grid');
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.fade-in, .stat-card, .dept-card, .team-card, .robot-card, .sponsor-card');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // --- Robot image slider ---
    const slides = document.querySelectorAll('.slider-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (slides.length > 0 && dotsContainer) {
        let current = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function goTo(index) {
            slides[current].classList.remove('active');
            dotsContainer.children[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dotsContainer.children[current].classList.add('active');
            if (prevBtn) prevBtn.disabled = slides.length <= 1;
            if (nextBtn) nextBtn.disabled = slides.length <= 1;
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

        // Disable buttons if only one image
        if (slides.length <= 1) {
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
        }
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Stat counter animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => statsObserver.observe(el));
    }

    // --- Tilt effect on cards ---
    const tiltCards = document.querySelectorAll('.stat-card, .image-card, .team-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});

// --- Helper: Create floating particles ---
function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.querySelector('.hero-bg').appendChild(particle);
    }
}

// --- Helper: Animate counter ---
function animateCounter(element) {
    const text = element.textContent.trim();
    // Match numbers like "20+", "125", "28\"", "16", "8"
    const match = text.match(/^(\d+)/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
