// Register GSAP Plugin at the very top
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CORE ELEMENTS ---
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const loader = document.querySelector(".loader");
    const backTop = document.querySelector('.back-top');
    const isMobile = window.innerWidth < 768;

    // --- 2. CURSOR & MOUSE ENGINE (With Mobile Check) ---
    window.addEventListener("mousemove", (e) => {
        const { clientX: x, clientY: y } = e;
        
        // Custom Cursor Logic (Only for Desktop)
        if (!isMobile && cursorDot && cursorOutline) {
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
            
            cursorOutline.animate(
                { left: `${x}px`, top: `${y}px` }, 
                { duration: 400, fill: "forwards" }
            );
        }

        // Background Glow Variable (Runs on both for SaaS feel)
        document.body.style.setProperty('--x', `${x}px`);
        document.body.style.setProperty('--y', `${y}px`);
    });

    // --- 3. GSAP SAAS ANIMATIONS (New Layer) ---
    const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

    heroTl.from(".glitch-text", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        skewY: 7,
        stagger: 0.2
    })
    .from(".hero-sub, .reveal-tag", {
        y: 20,
        opacity: 0,
        duration: 1
    }, "-=1")
    .from(".hero-btns .btn-cinematic", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
    }, "-=0.8");

    // Project Cards 3D Reveal & Tilt
    document.querySelectorAll(".project-card").forEach((card) => {
        // Entry Animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        });

        // 3D Tilt Logic
        if (!isMobile) {
            card.addEventListener("mousemove", (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = card.getBoundingClientRect();
                const x = (clientX - left) / width - 0.5;
                const y = (clientY - top) / height - 0.5;

                gsap.to(card, {
                    rotationY: x * 10,
                    rotationX: -y * 10,
                    transformPerspective: 1000,
                    ease: "power2.out",
                    duration: 0.5
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.8 });
            });
        }
    });

    // Magnetic Button Interactions
    document.querySelectorAll(".btn-cinematic, .btn-action").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            if (isMobile) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

    // Image Zoom Scrub
    document.querySelectorAll(".dropdown-image img").forEach((img) => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            scale: 1.2,
            ease: "none"
        });
    });

    // --- 4. PRELOADER LOGIC ---
    window.addEventListener("load", () => {
        setTimeout(() => { 
            if (loader) loader.style.transform = "translateY(-100%)"; 
        }, 1000);
    });

    // --- 5. SCROLL CONTROLLER (Progress Bar & Sticky About) ---
    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) {
            progressBar.style.width = `${(scrollPos / totalHeight) * 100}%`;
        }

        const stickySection = document.querySelector('.about-sticky');
        if (stickySection && window.innerWidth > 1000) {
            const stickyTop = stickySection.offsetTop;
            const stickyHeight = stickySection.offsetHeight;
            const viewportHeight = window.innerHeight;

            const relativeScroll = scrollPos - stickyTop;
            const scrollRange = stickyHeight - viewportHeight;

            const progress = Math.max(0, Math.min(1, relativeScroll / scrollRange));
            const contents = document.querySelectorAll('.sticky-content');

            if (relativeScroll < 50) { 
                contents.forEach(content => content.classList.remove('active'));
                return; 
            }

            contents.forEach((content, i) => {
                const step = 1 / contents.length;
                if (progress >= i * step && progress < (i + 1) * step) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }
    });

    // --- 6. REVEAL ON SCROLL (Intersection Observer) ---
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".section-reveal").forEach(el => revealObserver.observe(el));

    // --- 7. MAGNETIC EFFECT (Original Class-Based) ---
    document.querySelectorAll(".magnetic").forEach(el => {
        el.addEventListener("mousemove", (e) => {
            if(window.innerWidth < 1000) return;
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener("mouseleave", () => {
            el.style.transform = "translate(0, 0)";
        });
    });

    // --- 8. BACK TO TOP ---
    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 9. PROJECT DROPDOWN & FILTER SYSTEM ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card, .project-card-mini, .project-item');

    projectCards.forEach(card => {
        const header = card.querySelector('.project-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = card.classList.contains('active');

                // Mobile Haptic Check
                if (isMobile && window.navigator.vibrate) {
                    window.navigator.vibrate(5);
                }

                projectCards.forEach(c => c.classList.remove('active'));

                if (!isActive) {
                    card.classList.add('active');
                }
            });
        }
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.classList.remove('active');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = ''; 
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
});

