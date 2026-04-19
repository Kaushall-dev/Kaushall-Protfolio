// ---------------- GSAP INIT ----------------
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    gsap.utils.toArray(".reveal-line span").forEach(el => {
        gsap.to(el, {
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%"
            }
        });
    });

    // ===== SMOOTH SCROLL =====
    // SAFE LENIS INIT
    let lenis;
    
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.2,
            smooth: true
        });
    
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
        requestAnimationFrame(raf);
    }

    // --- PRO BUTTON EFFECTS ---

    document.querySelectorAll(".btn-pro").forEach(btn => {

        // Ripple Click Effect
        btn.addEventListener("click", function (e) {
            const ripple = this.querySelector(".ripple");

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = e.clientX - rect.left - size / 2 + "px";
            ripple.style.top = e.clientY - rect.top - size / 2 + "px";

            ripple.style.transition = "none";
            ripple.style.transform = "scale(0)";
            ripple.style.opacity = "1";

            setTimeout(() => {
                ripple.style.transition = "all 0.6s ease";
                ripple.style.transform = "scale(3)";
                ripple.style.opacity = "0";
            }, 10);
        });

        // Strong Magnetic Effect (edge-based)
        btn.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 768) return;

            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = 0.5; // stronger pull

            gsap.to(btn, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // ---------- CORE ----------
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const loader = document.querySelector(".loader");
    const backTop = document.querySelector(".back-top");
    const isMobile = window.innerWidth < 768;

    // ---------- CURSOR ----------
    // ===== CURSOR FIX =====
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.transform =
                `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }

        // keep your glow effect
        document.body.style.setProperty('--x', `${mouseX}px`);
        document.body.style.setProperty('--y', `${mouseY}px`);
    });

    // smooth outline follow
    gsap.ticker.add(() => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        if (cursorOutline) {
            cursorOutline.style.transform =
                `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
        }
    });

    // ---------- HERO ANIMATION ----------
    const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

    heroTl
        .from(".glitch-text", {
            y: 120,
            opacity: 0,
            duration: 1.4,
            skewY: 6
        })
        .from(".hero-tagline", {
            y: 30,
            opacity: 0,
            duration: 1
        }, "-=1")
        .from(".hero-image-wrapper", {
            scale: 0.9,
            opacity: 0,
            duration: 1.2
        }, "-=1")
        .from(".cta-group .btn", {
            y: 20,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8
        }, "-=0.8");

    // ---------- PROJECT CARDS ----------
    document.querySelectorAll(".project-card").forEach((card) => {

        // Reveal animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            y: 80,
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: "expo.out"
        });

        // Tilt
        if (!isMobile) {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(card, {
                    rotationY: x * 12,
                    rotationX: -y * 12,
                    transformPerspective: 1000,
                    duration: 0.4
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
        }
    });

    // ---------- IMAGE SCROLL ZOOM ----------
    document.querySelectorAll(".dropdown-image img").forEach((img) => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            scale: 1.15,
            ease: "none"
        });
    });

    // ---------- LOADER ----------
    window.addEventListener("load", () => {
        setTimeout(() => {
            if (loader) loader.style.transform = "translateY(-100%)";
        }, 800);
    });

    // ---------- SCROLL PROGRESS ----------
    window.addEventListener("scroll", () => {

        const scrollPos = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) {
            progressBar.style.width = `${(scrollPos / totalHeight) * 100}%`;
        }

        // Sticky About Section
        const stickySection = document.querySelector(".about-sticky");

        if (stickySection && window.innerWidth > 1000) {

            const stickyTop = stickySection.offsetTop;
            const stickyHeight = stickySection.offsetHeight;
            const viewportHeight = window.innerHeight;

            const progress = (scrollPos - stickyTop) / (stickyHeight - viewportHeight);
            const contents = document.querySelectorAll(".sticky-content");

            contents.forEach((content, i) => {
                const step = 1 / contents.length;

                if (progress >= i * step && progress < (i + 1) * step) {
                    content.classList.add("active");
                } else {
                    content.classList.remove("active");
                }
            });
        }
    });

    // ---------- REVEAL ----------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".section-reveal").forEach(el => observer.observe(el));

    // ---------- BACK TO TOP ----------
    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ---------- PROJECT DROPDOWN ----------
    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {
        const header = card.querySelector(".project-header");

        if (header) {
            header.addEventListener("click", () => {

                const isActive = card.classList.contains("active");

                cards.forEach(c => c.classList.remove("active"));

                if (!isActive) {
                    card.classList.add("active");
                }

                if (isMobile && navigator.vibrate) {
                    navigator.vibrate(5);
                }
            });
        }
    });

    // ---------- FILTER ----------
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const category = card.dataset.category;

                if (filter === "all" || category === filter) {
                    card.style.display = "block";

                    gsap.fromTo(card,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // ===== SMOOTH BUTTON MAGNETIC =====
    document.querySelectorAll(".btn-pro").forEach(btn => {
        let xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
        let yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

        btn.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 768) return;

            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            xTo(x * 0.2);
            yTo(y * 0.2);
        });

        btn.addEventListener("mouseleave", () => {
            xTo(0);
            yTo(0);
        });
    });

    // HERO PARALLAX
    const hero = document.querySelector(".hero");

    if (hero) {
        hero.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to(".glitch-text", {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.6
            });

            gsap.to(".hero-main-img", {
                x: x * 0.6,
                y: y * 0.6,
                duration: 0.6
            });
        });
    }

    // ===== CURSOR HOVER EFFECT =====
    document.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(".cursor-outline", {
                scale: 2,
                borderColor: "#fff",
                duration: 0.3
            });
        });

        el.addEventListener("mouseleave", () => {
            gsap.to(".cursor-outline", {
                scale: 1,
                borderColor: "var(--accent)",
                duration: 0.3
            });
        });
    });
});