/* ============================================================
   *** - ANIMATOR PORTFOLIO LOGIC
   The Line Studio Style Viewfinder HUD & Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLiveTimecode();
    initShowreelScrubber();
    initWorksFilter();
    initProjectDossierModal();
    initTerminalContactForm();
    initNavAndScroll();
    initCategoryTitleScrollAnimations();
});

/* ------------------------------------------------------------
   1. Live SMPTE 24 FPS Timecode Generator (Viewfinder HUD)
   ------------------------------------------------------------ */
function initLiveTimecode() {
    const tcEl = document.getElementById('live-timecode');
    if (!tcEl) return;

    let hours = 0;
    let minutes = 14;
    let seconds = 28;
    let frames = 9;

    setInterval(() => {
        frames++;
        if (frames >= 24) {
            frames = 0;
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }

        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        const ff = String(frames).padStart(2, '0');

        tcEl.textContent = `TC ${hh}:${mm}:${ss}:${ff}`;
    }, 1000 / 24); // Exactly 24 frames per second
}

/* ------------------------------------------------------------
   2. Showreel Timeline Scrubber & Simulation
   ------------------------------------------------------------ */
function initShowreelScrubber() {
    const playBtn = document.getElementById('play-reel-btn');
    const playhead = document.getElementById('timeline-playhead');
    const scrubTc = document.getElementById('reel-scrub-tc');

    let isPlaying = false;
    let progress = 38;
    let animationInterval = null;

    if (playBtn) {
        playBtn.addEventListener('click', toggleShowreelPlayback);
        playBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleShowreelPlayback();
            }
        });
    }

    function toggleShowreelPlayback() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            showToast('▶ SIMULATING 2035 ACTION CUTS REEL [ 24 FPS ]');
            if (playBtn) playBtn.innerHTML = '<span class="play-icon" style="margin-left:0;">⏸</span>';

            animationInterval = setInterval(() => {
                progress += 0.8;
                if (progress > 100) progress = 0;

                if (playhead) playhead.style.width = `${progress}%`;

                // Calculate fake timecode
                const totalSec = (progress / 100) * 84; // 84 seconds total reel
                const m = Math.floor(totalSec / 60);
                const s = Math.floor(totalSec % 60);
                const f = Math.floor((totalSec % 1) * 24);
                if (scrubTc) {
                    scrubTc.textContent = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
                }
            }, 50);
        } else {
            clearInterval(animationInterval);
            if (playBtn) playBtn.innerHTML = '<span class="play-icon">▶</span>';
            showToast('⏸ SHOWREEL PAUSED');
        }
    }
}

/* ------------------------------------------------------------
   3. Works Category Filter
   ------------------------------------------------------------ */
function initWorksFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const targetCategory = btn.getAttribute('data-category');

            projectCards.forEach((card) => {
                const cardCategories = card.getAttribute('data-category') || '';
                if (targetCategory === 'all' || cardCategories.includes(targetCategory)) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });

            showToast(`[ FILTER ACTIVATED: ${btn.textContent.trim()} ]`);
        });
    });
}

/* ------------------------------------------------------------
   4. Project Detail Dossier Modal
   ------------------------------------------------------------ */
const PROJECT_DATABASE = {
    '1': {
        num: '/ 01',
        title: 'NEON OVERDRIVE [ Speed Climax ]',
        genre: 'MUSIC VIDEO / CYBERPUNK ACTION',
        client: 'Warner Music Asia x HyperWave Records',
        year: '2035',
        color: '#FF3344',
        colorName: 'ELECTRIC VERMILION',
        photoFile: 'images/work-01-neon-overdrive.png',
        fps: '24 FPS (1s & 2s Hybrid)',
        cuts: '24 Cuts / 1,420 Keyframes',
        aspect: '2.39:1 CinemaScope',
        synopsis: 'An official high-octane anime music video climax produced for an international electronic music duo. Set on a rain-slicked elevated highway, this cut features high-speed motorcycle pursuit and close-quarters combat with extreme fisheye perspective, kinetic smear frames, and vibrant hand-drawn light streaks.',
        dopeSheet: 'Shot #08 (Impact Cut): 72 frames. 1-to-24 straight ahead acceleration. Keyframes A1-A12 drawn on 1s for hyper-impact sword slash; transition to 2s for fluid motorcycle drift. Inked with textured rough brush in TVPaint.'
    },
    '2': {
        num: '/ 02',
        title: 'PHANTOM BLADE [ Resurrection ]',
        genre: 'AAA GAME CINEMATIC / COMBAT ANIMATION',
        client: 'S-GAME x Sony PlayStation',
        year: '2034',
        color: '#00D2FF',
        colorName: 'CYBER CYAN',
        fps: '24 FPS (Dynamic Timing)',
        cuts: '18 Cuts / 980 Keyframes',
        aspect: '16:9 DCI 4K',
        synopsis: 'Boss duel climax for an AAA action game announcement trailer. The action choreography emphasizes physical anticipation, blade impact recoil, white-frame impact flashes, and dynamic fluid ink splashes, all hand-drawn frame by frame.',
        dopeSheet: 'Shot #14 (Parry Sequence): 48 frames. Frame 1-18 slow build-up; Frame 19-20 pure white impact frames; Frame 21-48 explosive follow-through recoil. Pre-visualized in Blender Grease Pencil before final clean hand-inking.'
    },
    '3': {
        num: '/ 03',
        title: 'ECLIPSE RUNNER [ Solar Ruin ]',
        genre: 'ORIGINAL ANIMATED SHORT FILM',
        client: 'Self-Produced Independent Short (Official Annecy Selection)',
        year: '2034',
        color: '#FFB800',
        colorName: 'HAZARD AMBER',
        fps: '24 FPS on 2s',
        cuts: '32 Cuts / 2,100 Keyframes',
        aspect: '2.39:1 Anamorphic',
        synopsis: 'An original auteur animated short film following a rooftop parkour sprint through gravitational anomalies during a total solar eclipse. Highlights extreme kinematic weight transfer, cloth wind drag, and dramatic high-contrast silhouette lighting.',
        dopeSheet: 'Shot #21 (Freefall Leap): 96 frames. Constant 2s rhythm maintaining absolute kinematic weight. Timing charts rigorously calibrated to simulate terminal velocity air drag.'
    },
    '4': {
        num: '/ 04',
        title: 'ASTRAL BEAST [ Spectral Titan ]',
        genre: 'FASHION & BRAND COMMERCIAL SPOT',
        client: 'Urban Fabric Lab',
        year: '2033',
        color: '#7C3AED',
        colorName: 'ROYAL VIOLET',
        fps: '24 FPS (Variable)',
        cuts: '12 Cuts / 650 Keyframes',
        aspect: '16:9 4K UHD',
        synopsis: 'A streetwear brand visual identity commercial spot. Centered on a massive bioluminescent celestial creature moving through city skyscrapers with a continuous 360-degree camera orbit and hand-drawn spectral energy ribbons.',
        dopeSheet: 'Shot #03 (Camera Orbit): 120 frames. 3D spatial camera tracking integrated with frame-by-frame 2D animated smoke plumes and spectral emission ribbons.'
    },
    '5': {
        num: '/ 05',
        title: 'VOID PROTOCOL [ Mecha Climax ]',
        genre: 'SCI-FI ANIME EPISODE CLIMAX',
        client: 'Nebula Animation Works (TV Series)',
        year: '2033',
        color: '#10B981',
        colorName: 'EMERALD ACID',
        fps: '24 FPS (Key Animation Cut)',
        cuts: '9 Cuts / 720 Keyframes',
        aspect: '16:9 Broadcast HD',
        synopsis: 'Guest key animator for a 45-second uncut close-quarters mecha dogfight and missile barrage explosion sequence for a sci-fi TV series. Widely acclaimed across the animation community.',
        dopeSheet: 'Cut #182: 450 frames uncut action. Complex mechanical joints deform under extreme perspective without losing structural volume. Timing staggered on 1s for laser sparks.'
    },
    '6': {
        num: '/ 06',
        title: 'TOKYO DRIFTWOOD [ Urban Solitude ]',
        genre: 'EXPERIMENTAL NARRATIVE SHORT',
        client: 'Tokyo Art University Residency',
        year: '2032',
        color: '#F43F5E',
        colorName: 'HOT MAGENTA',
        photoFile: 'images/work-06-tokyo-driftwood.png',
        fps: '12-24 FPS Variable',
        cuts: '15 Cuts / 890 Keyframes',
        aspect: '4:3 Classic Format',
        synopsis: 'An experimental animated short examining urban loneliness and fleeting neon reflections. Utilizes rough charcoal scans and minimal solid color psychology to evoke emotional resonance.',
        dopeSheet: 'Shot #05: 144 frames. Charcoal frame-by-frame boil effect. Intentionally broken frame rates (fluctuating between 8fps and 24fps) to convey emotional turbulence.'
    }
};

function initProjectDossierModal() {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-content-body');
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.getElementById('modal-backdrop');
    const projectCards = document.querySelectorAll('.project-card');

    if (!modal || !modalBody) return;

    projectCards.forEach((card) => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const data = PROJECT_DATABASE[id];
            if (!data) return;

            modalBody.innerHTML = `
                <div class="modal-hero-frame" style="background-color: ${data.color};">
                    <img src="${data.photoFile}" alt="${data.title} Single Color Picture" class="single-color-img" style="background-color: ${data.color};">
                    <span class="modal-hero-color-tag">■ SINGLE COLOR PIC: ${data.color} ${data.colorName}</span>
                </div>

                <div class="modal-proj-num">${data.num} // PRODUCTION DOSSIER</div>
                <h3 class="modal-proj-title">${data.title}</h3>
                <p class="modal-proj-genre">${data.genre} • CLIENT: ${data.client}</p>

                <div class="modal-specs-grid">
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">FRAME RATE</span>
                        <span class="modal-spec-val">${data.fps}</span>
                    </div>
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">KEYFRAMES &amp; CUTS</span>
                        <span class="modal-spec-val">${data.cuts}</span>
                    </div>
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">ASPECT RATIO</span>
                        <span class="modal-spec-val">${data.aspect}</span>
                    </div>
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">PRODUCTION YEAR</span>
                        <span class="modal-spec-val">${data.year}</span>
                    </div>
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">STILL PALETTE</span>
                        <span class="modal-spec-val" style="color:${data.color};">${data.color}</span>
                    </div>
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">PICTURE TYPE</span>
                        <span class="modal-spec-val">Single Solid Color</span>
                    </div>
                </div>

                <p class="modal-synopsis-text">${data.synopsis}</p>

                <div class="modal-dope-sheet-block">
                    <div class="dope-sheet-title">/ DOPE SHEET &amp; TIMING ARCHITECTURE [ EXPOSURE ANALYSIS ]:</div>
                    <p class="dope-sheet-content">${data.dopeSheet}</p>
                </div>
            `;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            showToast(`[ OPENED DOSSIER: ${data.title} ]`);
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ------------------------------------------------------------
   5. Terminal Contact Transmission Form
   ------------------------------------------------------------ */
function initTerminalContactForm() {
    const form = document.getElementById('contact-form');
    const copyBtn = document.getElementById('copy-email-btn');
    const consoleLog = document.getElementById('console-log');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const category = document.getElementById('form-category').value;

            if (consoleLog) {
                const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
                consoleLog.innerHTML = `
                    <span class="log-prefix">> [${now}] TRANSMISSION DISPATCHED:</span> 
                    Project inquiry from <strong>${name}</strong> (${email}) [TYPE: ${category.toUpperCase()}] queued for review by ***.
                `;
            }

            showToast(`🚀 [ TRANSMITTED ] Thank you, ${name || 'Producer'}! Your message has been sent to ***.`);
            form.reset();
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const email = 'd14371340@gm.tut.edu.tw';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast(`📋 COPIED: ${email}`);
                }).catch(() => fallbackCopy(email));
            } else {
                fallbackCopy(email);
            }
        });
    }

    function fallbackCopy(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`📋 COPIED: ${text}`);
    }
}

/* ------------------------------------------------------------
   6. Navigation, Smooth Scroll & Back to Top
   ------------------------------------------------------------ */
function initNavAndScroll() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ------------------------------------------------------------
   7. HUD Toast Notification System
   ------------------------------------------------------------ */
function showToast(message) {
    const toast = document.getElementById('hud-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ------------------------------------------------------------
   8. Category Titles Kinetic Scroll Animations & Parallax
   ------------------------------------------------------------ */
function initCategoryTitleScrollAnimations() {
    const sectionHeaders = document.querySelectorAll('.section-header-row');
    const subHeaders = document.querySelectorAll('.vault-title, .toolstack-label, .works-filter-bar, .huge-talk-text, .timeline-block, .award-item, .skill-card');

    subHeaders.forEach((sub) => {
        sub.classList.add('scroll-reveal-target');
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                const rect = entry.target.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    entry.target.classList.remove('in-view');
                }
            }
        });
    }, observerOptions);

    sectionHeaders.forEach((header) => {
        headerObserver.observe(header);
    });

    subHeaders.forEach((sub) => {
        headerObserver.observe(sub);
    });

    // Parallax kinetic drift for section numbers on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                sectionHeaders.forEach((header) => {
                    const numberEl = header.querySelector('.section-number');
                    if (numberEl && header.classList.contains('in-view')) {
                        const rect = header.getBoundingClientRect();
                        const offset = (rect.top - window.innerHeight / 2) * 0.05;
                        numberEl.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
