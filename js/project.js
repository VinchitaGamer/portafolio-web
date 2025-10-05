// Project Page JavaScript - Optimized + CMS data loader

async function loadProjectFromCMS() {
    try {
        // Derivar ID desde el nombre del archivo: proyecto-<id>.html
        const fname = (window.location.pathname.split('/').pop() || '').toLowerCase();
        const match = fname.match(/^proyecto-(.+)\.html$/);
        const id = match ? match[1] : '';
        if (!id) return;

        const res = await fetch(`content/projects/${id}.json`, { cache: 'no-store' });
        if (!res.ok) return; // fallback al estático
        const p = await res.json();

        // Título, subtítulo, breadcrumb
        const title = p.title || id;
        const subtitle = p.subtitle || '';
        const tech = (p.tech || '').split(',').map(s => s.trim()).filter(Boolean);

        const titleEl = document.querySelector('.project-title');
        const subEl = document.querySelector('.project-subtitle');
        const breadcrumbSpan = document.querySelector('.project-breadcrumb span');
        if (titleEl) titleEl.textContent = title;
        if (subEl) subEl.textContent = subtitle;
        if (breadcrumbSpan) breadcrumbSpan.textContent = title;

        // Tech stack
        const techWrap = document.querySelector('.project-tech-stack');
        if (techWrap && tech.length) {
            techWrap.innerHTML = tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        }

        // Descripción
        const descWrap = document.querySelector('.project-description');
        if (descWrap && p.description) {
            const firstP = descWrap.querySelector('p');
            if (firstP) firstP.textContent = p.description;
        }

        // Features (si existen)
        if (Array.isArray(p.features)) {
            let ul = document.querySelector('.feature-list');
            if (!ul && descWrap) {
                ul = document.createElement('ul');
                ul.className = 'feature-list';
                descWrap.appendChild(ul);
            }
            if (ul) {
                ul.innerHTML = p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
            }
        }

        // Resultados (si existen)
        if (p.results) {
            const stats = document.querySelector('.project-stats');
            if (stats) {
                const items = [];
                if (p.results.satisfaction) items.push({ num: p.results.satisfaction, label: 'Satisfacción del cliente' });
                if (p.results.salesIncrease) items.push({ num: p.results.salesIncrease, label: 'Aumento en Ventas' });
                if (p.results.loadTime) items.push({ num: p.results.loadTime, label: 'Tiempo de carga promedio' });
                if (items.length) {
                    stats.innerHTML = items.map(i => `
                        <div class="stat-item">
                            <span class="stat-number">${i.num}</span>
                            <span class="stat-label">${i.label}</span>
                        </div>
                    `).join('');
                }
            }
        }
    } catch (e) {
        console.warn('CMS project not loaded:', e);
    }
}

// ======================== Features (migradas del original) ========================

// Image Gallery Lightbox
function initImageLightbox() {
    const images = document.querySelectorAll('.image-item img');
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity .3s ease;`;

    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `position:relative;max-width:90%;max-height:90%;transform:scale(.8);transition:transform .3s ease;`;

    const img = document.createElement('img');
    img.src = src; img.alt = alt; img.style.cssText = `width:100%;height:auto;border-radius:10px;box-shadow:0 20px 40px rgba(0,0,0,.5);`;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `position:absolute;top:-40px;right:0;background:rgba(255,255,255,.2);border:none;color:#fff;font-size:2rem;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .3s ease;`;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(255,255,255,.3)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,.2)');

    const caption = document.createElement('p');
    caption.textContent = alt;
    caption.style.cssText = `color:#fff;text-align:center;margin-top:20px;font-size:1rem;opacity:.9;`;

    imgContainer.appendChild(img);
    imgContainer.appendChild(closeBtn);
    lightbox.appendChild(imgContainer);
    lightbox.appendChild(caption);
    document.body.appendChild(lightbox);

    requestAnimationFrame(() => { lightbox.style.opacity = '1'; imgContainer.style.transform = 'scale(1)'; });
    function close() { lightbox.style.opacity = '0'; imgContainer.style.transform = 'scale(.8)'; setTimeout(() => lightbox.remove(), 300); }
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    const esc = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);
}

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.project-description, .project-images, .project-stats')
        .forEach(el => { el.classList.add('scroll-animate'); observer.observe(el); });
}

// Stats counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, '')) || 0;
        const suffix = counter.textContent.replace(/[\d]/g, '');
        let current = 0; const increment = Math.max(1, target / 60);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { counter.textContent = target + suffix; clearInterval(timer); }
            else { counter.textContent = Math.floor(current) + suffix; }
        }, 16);
    });
}

// Tech stack hover effects
function initTechStackEffects() {
    document.querySelectorAll('.project-tech-stack .tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function(){ this.style.transform = 'translateY(-3px) scale(1.05)'; });
        tag.addEventListener('mouseleave', function(){ this.style.transform = 'translateY(0) scale(1)'; });
    });
}

// Button ripple effects + minimal CSS
function initButtonEffects() {
    document.querySelectorAll('.btn, .btn-outline').forEach(btn => {
        btn.addEventListener('click', function(e){
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2; const y = e.clientY - rect.top - size/2;
            ripple.style.width = ripple.style.height = size + 'px'; ripple.style.left = x + 'px'; ripple.style.top = y + 'px';
            ripple.classList.add('ripple'); this.appendChild(ripple); setTimeout(()=> ripple.remove(), 600);
        });
    });
}

const style = document.createElement('style');
style.textContent = `.btn,.btn-outline{position:relative;overflow:hidden}.ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.6);transform:scale(0);animation:ripple-animation .6s linear;pointer-events:none}@keyframes ripple-animation{to{transform:scale(4);opacity:0}}.scroll-animate{opacity:0;transform:translateY(30px);transition:all .6s ease}.scroll-animate.animate{opacity:1;transform:translateY(0)}`;
document.head.appendChild(style);

// Inicialización
document.addEventListener('DOMContentLoaded', async function () {
    await loadProjectFromCMS();
    // Animaciones y efectos
    initImageLightbox();
    initScrollAnimations();
    initTechStackEffects();
    initButtonEffects();
    // Contadores al entrar en vista
    const statsSection = document.querySelector('.project-stats');
    if (statsSection) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(statsSection);
    }
});

// Navbar background change on scroll - Optimized with throttling
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});