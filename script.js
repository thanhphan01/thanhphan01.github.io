/* ================================================================
   script.js — Thanh Truc Phan Personal Website
   ================================================================

   This file handles three things:
   1. Mobile navigation toggle (hamburger menu)
   2. Active nav link highlighting while you scroll
   3. Scroll reveal animations (elements fade in as you scroll down)
   4. Profile image fallback (shows initials if photo is missing)

   No libraries or frameworks — plain JavaScript only.
   ================================================================ */


/* ----------------------------------------------------------------
   1.  NAV: CUSTOM SMOOTH SCROLL + MOBILE MENU
   ---------------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

function closeMobileMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

/* ── Custom smooth scroll ─────────────────────────────────────────
   requestAnimationFrame + easeInOutCubic.
   - Any running animation is cancelled before a new one starts.
   - startAt is captured inside the first RAF frame so it shares
     the same DOMHighResTimeStamp clock as the `now` parameter,
     preventing negative elapsed times in edge-case browser states.
   - Works identically scrolling up or down.
   - Respects prefers-reduced-motion.
──────────────────────────────────────────────────────────────── */

let _animId = null;

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function navScrollTo(targetY) {
    /* Cancel any in-progress animation before doing anything else */
    if (_animId !== null) {
        cancelAnimationFrame(_animId);
        _animId = null;
    }

    /* Instant jump for reduced-motion preference */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, targetY);
        return;
    }

    const fromY    = window.scrollY;
    const distance = targetY - fromY;

    if (Math.abs(distance) < 1) return;

    const duration = Math.min(850, Math.max(500, Math.abs(distance) / 3));
    let   startAt  = null;   /* set on the very first RAF frame */

    function tick(now) {
        if (startAt === null) startAt = now;

        const elapsed  = now - startAt;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeInOutCubic(progress);

        window.scrollTo(0, fromY + distance * eased);

        if (progress < 1) {
            _animId = requestAnimationFrame(tick);
        } else {
            window.scrollTo(0, targetY);   /* snap exactly on the final frame */
            _animId = null;
        }
    }

    _animId = requestAnimationFrame(tick);
}

/* Event delegation on document — survives language switching */
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-header a[href^="#"]');

    if (!link) {
        /* Close mobile menu when clicking outside */
        if (
            navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {
            closeMobileMenu();
        }
        return;
    }

    e.preventDefault();
    closeMobileMenu();

    const id   = link.getAttribute('href');
    const navH = (document.querySelector('.nav-header') || {offsetHeight: 62}).offsetHeight;

    if (id === '#hero') {
        navScrollTo(0);
        return;
    }

    /* getElementById is more reliable than querySelector for IDs */
    const target = document.getElementById(id.slice(1));
    if (!target) return;

    const y = target.getBoundingClientRect().top + window.scrollY - navH;
    navScrollTo(Math.max(0, Math.round(y)));
});


/* ----------------------------------------------------------------
   2.  ACTIVE NAV LINK ON SCROLL
   ---------------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const navHeight = document.querySelector('.nav-header')?.offsetHeight ?? 62;
    const scrollY   = window.scrollY + navHeight + 10;
    const atBottom  = window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;
    let   found     = false;

    sections.forEach(section => {
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (link && scrollY >= top && scrollY < bottom) {
            navItems.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            found = true;
        }
    });

    if (!found && atBottom && sections.length) {
        const lastId   = sections[sections.length - 1].getAttribute('id');
        const lastLink = document.querySelector(`.nav-links a[href="#${lastId}"]`);
        if (lastLink) {
            navItems.forEach(l => l.classList.remove('active'));
            lastLink.classList.add('active');
        }
    }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


/* ----------------------------------------------------------------
   3.  SCROLL REVEAL ANIMATION
   ---------------------------------------------------------------- */

/*
   IntersectionObserver watches every element with class="reveal".
   When it enters the viewport, the "visible" class is added,
   which triggers the CSS fade-in transition (see styles.css).
*/
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                /* Stop watching once revealed — no need to hide again */
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/*
   Stagger: add a small delay to grouped items so they appear
   one after another instead of all at once.
*/
const staggerSelectors = [
    '.timeline-item',
    '.project-card',
    '.skill-group',
    '.interest-card',
    '.highlight-card',
];

staggerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.07}s`;
    });
});


/* ----------------------------------------------------------------
   4.  PROFILE IMAGE FALLBACK
   ----------------------------------------------------------------
   If assets/profile.jpg is missing, show the initials "TTP"
   on a gradient background instead of a broken image icon.
   ---------------------------------------------------------------- */
const profileImg = document.getElementById('profileImg');

if (profileImg) {
    profileImg.addEventListener('error', () => {
        /* Hide the broken image */
        profileImg.style.display = 'none';

        /* Style the ring container as an initials avatar */
        const ring = profileImg.parentElement;
        ring.style.cssText += `
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        /* Create the initials text element */
        const initials = document.createElement('span');
        /* ✏️ Change these initials if your name changes */
        initials.textContent = 'TTP';
        initials.style.cssText = `
            color: white;
            font-size: 3rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            font-family: 'Playfair Display', Georgia, serif;
            user-select: none;
        `;

        ring.appendChild(initials);
    });
}


/* ----------------------------------------------------------------
   5.  PDF CHART PREVIEWS
   ----------------------------------------------------------------
   Uses PDF.js (loaded from CDN on demand) to render the first page
   of a PDF file into a <canvas data-pdf="path"> element.
   Only triggered if the page actually contains such canvases.
   ---------------------------------------------------------------- */
const pdfCanvases = document.querySelectorAll('canvas[data-pdf]');

if (pdfCanvases.length) {
    const pdfScript = document.createElement('script');
    pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';

    pdfScript.onload = async () => {
        const lib = window.pdfjsLib;
        if (!lib) return;
        lib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        for (const canvas of pdfCanvases) {
            await renderPdfPreview(lib, canvas);
        }
    };

    document.head.appendChild(pdfScript);
}

async function renderPdfPreview(lib, canvas) {
    const pdfPath  = canvas.dataset.pdf;
    const pageNum  = parseInt(canvas.dataset.pdfPage || '1', 10);
    const wrapper  = canvas.closest('.project-preview');
    const loading  = wrapper ? wrapper.querySelector('.project-preview-loading') : null;

    try {
        const pdf      = await lib.getDocument(pdfPath).promise;
        const page     = await pdf.getPage(pageNum);
        const baseVp   = page.getViewport({ scale: 1 });
        const scale    = (wrapper ? wrapper.clientWidth : 300) / baseVp.width;
        const viewport = page.getViewport({ scale });

        canvas.width  = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

        if (loading) loading.remove();

    } catch (err) {
        console.warn('PDF preview failed:', pdfPath, err);
        if (wrapper) wrapper.style.display = 'none';
    }
}
