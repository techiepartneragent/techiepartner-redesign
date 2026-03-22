/**
 * TechiPartner Website - Vanilla JS
 * Scroll animations, 3D effects, canvas particles, and interactive UI
 */

'use strict';

// ═══════════════════════════════════════════════════════
// HERO CANVAS — Particle network animation
// ═══════════════════════════════════════════════════════

(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const COUNT = 80;
  const CONNECT_DIST = 130;
  const MOUSE_DIST = 160;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // update
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repel
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.6;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) { p.vx = (p.vx / speed) * 1.2; p.vy = (p.vy / speed) * 1.2; }
    });

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => { resize(); });
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
})();


// ═══════════════════════════════════════════════════════
// CURSOR GLOW
// ═══════════════════════════════════════════════════════

(function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


// ═══════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════

(function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
  }, { passive: true });
})();


// ═══════════════════════════════════════════════════════
// NAVBAR: scroll effect + active link
// ═══════════════════════════════════════════════════════

(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ═══════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════

(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let open = false;
  const lines = hamburger.querySelectorAll('.ham-line');

  function toggle() {
    open = !open;
    mobileMenu.classList.toggle('open', open);
    // Animate hamburger → X
    if (open) {
      lines[0].style.transform = 'rotate(45deg) translate(3px, 3px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(3px, -3px)';
    } else {
      lines[0].style.transform = '';
      lines[1].style.opacity = '';
      lines[2].style.transform = '';
    }
  }

  hamburger.addEventListener('click', toggle);
  mobileMenu.querySelectorAll('.mobile-nav, a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => { if (open) toggle(); });
  });
})();


// ═══════════════════════════════════════════════════════
// SCROLL REVEAL — Intersection Observer
// ═══════════════════════════════════════════════════════

(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();


// ═══════════════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════════════

(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + (progress < 1 ? '' : '+');
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + '+';
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ═══════════════════════════════════════════════════════
// 3D TILT CARDS
// ═══════════════════════════════════════════════════════

(function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 8;
      const rotY =  dx * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;

      // Update shine position
      const shine = card.querySelector('.card-shine');
      if (shine) {
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        shine.style.setProperty('--mouse-x', mouseX + '%');
        shine.style.setProperty('--mouse-y', mouseY + '%');
        // Override the CSS variable on the shine element directly
        shine.style.background = `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
})();


// ═══════════════════════════════════════════════════════
// PARALLAX SCROLL — Orbs and decorative elements
// ═══════════════════════════════════════════════════════

(function initParallax() {
  const orbs = document.querySelectorAll('.orb');

  function onScroll() {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i % 2 === 0) ? 0.15 : -0.1;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ═══════════════════════════════════════════════════════
// PORTFOLIO FILTER
// ═══════════════════════════════════════════════════════

(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active', 'border-brand-500', 'text-brand-400');
        b.classList.add('border-white/10', 'text-slate-400');
      });
      btn.classList.add('active', 'border-brand-500', 'text-brand-400');
      btn.classList.remove('border-white/10', 'text-slate-400');

      // Filter items
      items.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s, transform 0.4s';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.transition = 'opacity 0.3s, transform 0.3s';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
})();


// ═══════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════

(function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');

    // Loading state
    span.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending...`;
    btn.disabled = true;

    // Simulate send (replace with real endpoint)
    await new Promise(r => setTimeout(r, 1400));

    // Show success
    form.style.display = 'none';
    success.classList.remove('hidden');
  });
})();


// ═══════════════════════════════════════════════════════
// SMOOTH ANCHOR SCROLLING
// ═══════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ═══════════════════════════════════════════════════════
// SCROLL-DRIVEN 3D HERO TEXT DEPTH
// ═══════════════════════════════════════════════════════

(function initHeroDepth() {
  const hero = document.getElementById('home');
  const heroContent = hero ? hero.querySelector('.relative.z-10') : null;
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight;
    if (scrollY > heroH) return;
    const progress = scrollY / heroH;
    heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
    heroContent.style.opacity = 1 - progress * 1.5;
  }, { passive: true });
})();


// ═══════════════════════════════════════════════════════
// STAGGER REVEAL for grid items
// ═══════════════════════════════════════════════════════

(function initStaggeredReveal() {
  // Add stagger delays to service cards and portfolio items
  document.querySelectorAll('.grid .reveal').forEach((el, i) => {
    if (!el.style.transitionDelay) {
      // Only add delay if not already set inline
    }
  });
})();


// ═══════════════════════════════════════════════════════
// MAGNETIC BUTTON effect on primary CTAs
// ═══════════════════════════════════════════════════════

(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy - 2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


// ═══════════════════════════════════════════════════════
// PAGE LOAD — fade in
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
