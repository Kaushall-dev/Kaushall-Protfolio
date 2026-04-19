document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CORE ELEMENTS ---
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const loader = document.querySelector(".loader");
    const backTop = document.querySelector('.back-top');

    // --- 2. CURSOR & MOUSE ENGINE ---
    window.addEventListener("mousemove", (e) => {
        const { clientX: x, clientY: y } = e;
        
        // Dot follows exactly
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        
        // Outline follows with lag for smooth feel
        cursorOutline.animate(
            { left: `${x}px`, top: `${y}px` }, 
            { duration: 400, fill: "forwards" }
        );

        // Update CSS variables for the radial background glow
        document.body.style.setProperty('--x', `${x}px`);
        document.body.style.setProperty('--y', `${y}px`);
    });

    // --- 3. PRELOADER LOGIC ---
    window.addEventListener("load", () => {
        setTimeout(() => { 
            loader.style.transform = "translateY(-100%)"; 
        }, 1000);
    });

    // --- 4. SCROLL CONTROLLER (Progress Bar & Sticky About) ---
    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Scroll Progress Bar
        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) {
            progressBar.style.width = `${(scrollPos / totalHeight) * 100}%`;
        }

        // Sticky "About" Math Logic (Only for Desktop)
        const stickySection = document.querySelector('.about-sticky');
        if (stickySection && window.innerWidth > 1000) {
            const stickyTop = stickySection.offsetTop;
            const stickyHeight = stickySection.offsetHeight;
            const viewportHeight = window.innerHeight;

            const relativeScroll = scrollPos - stickyTop;
            const scrollRange = stickyHeight - viewportHeight;

            // Calculate 0 to 1 progress
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

    // --- 5. REVEAL ON SCROLL (Intersection Observer) ---
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".section-reveal").forEach(el => revealObserver.observe(el));

    // --- 6. MAGNETIC EFFECT ---
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

    // --- 7. BACK TO TOP ---
    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 8. PROJECT DROPDOWN & FILTER SYSTEM ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card, .project-card-mini, .project-item');

    // Dropdown Toggle Logic
    projectCards.forEach(card => {
        const header = card.querySelector('.project-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = card.classList.contains('active');

                // Close all other projects for a clean "Accordion" feel
                projectCards.forEach(c => c.classList.remove('active'));

                // If it wasn't active, open it
                if (!isActive) {
                    card.classList.add('active');
                }
            });
        }
    });

    // Master Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update UI for buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Close any open dropdowns when switching filters
                card.classList.remove('active');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = ''; // Returns to default (flex/block/grid)
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