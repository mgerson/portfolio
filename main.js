/* ============================================================
   ALEX MORGAN — PORTFOLIO  |  main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Custom Cursor ─────────────────────────────────────── */
  const cursor   = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower && matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animFollower);
    })();

    document.querySelectorAll('a, button, .pf-btn, .testi__arrow, .service-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('is-hovered'); follower.classList.add('is-hovered'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('is-hovered'); follower.classList.remove('is-hovered'); });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
  }

  /* ── Hero Canvas Particles ─────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx    = canvas.getContext('2d');
    let W, H, particles = [], animId;
    const GOLD = 'rgba(212,168,67,';

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x  = Math.random() * W;
        this.y  = init ? Math.random() * H : H + 10;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vy = -(Math.random() * 0.4 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.a  = Math.random() * 0.5 + 0.1;
        this.da = (Math.random() * 0.004 + 0.002) * (Math.random() < 0.5 ? 1 : -1);
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.a  += this.da;
        if (this.a > 0.6 || this.a < 0.05) this.da *= -1;
        if (this.y < -10) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = GOLD + this.a + ')';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor(W / 7), 180);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    }

    resize();
    initParticles();
    loop();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animId);
      resize();
      initParticles();
      loop();
    });
    ro.observe(canvas.parentElement);
  }

  /* ── Typed Text Effect ─────────────────────────────────── */
  const typedEl  = document.getElementById('typed-text');
  const cursorEl = document.querySelector('.typed-cursor');
  if (typedEl) {
    const phrases = [
      'Desenvolvedor Full Stack',
      'Designer UI/UX',
      'Especialista em React',
      'Engenheiro Node.js',
      'Solucionador de Problemas'
    ];
    let pi = 0, ci = 0, deleting = false;

    function type() {
      const phrase = phrases[pi];
      typedEl.textContent = deleting
        ? phrase.substring(0, ci--)
        : phrase.substring(0, ci++);

      let delay = deleting ? 50 : 90;
      if (!deleting && ci > phrase.length)     { delay = 1800; deleting = true; }
      else if (deleting && ci < 0)             { deleting = false; ci = 0; pi = (pi + 1) % phrases.length; delay = 300; }

      setTimeout(type, delay);
    }
    setTimeout(type, 800);
  }

  /* ── Navigation ────────────────────────────────────────── */
  const nav        = document.querySelector('.nav');
  const navToggle  = document.getElementById('nav-toggle');
  const navMenu    = document.getElementById('nav-menu');
  const navLinks   = document.querySelectorAll('.nav__link[href^="#"]');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 90;
    sections.forEach(sec => {
      const top = sec.offsetTop, h = sec.offsetHeight;
      const id  = sec.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ── Scroll Animations (Intersection Observer) ─────────── */
  const aosCfg = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const aosObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        aosObs.unobserve(e.target);
      }
    });
  }, aosCfg);
  document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

  /* ── Stats Counter Animation ───────────────────────────── */
  function animCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (!target) return;
    const suffix   = el.textContent.replace(/[0-9]/g, '');
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => {
    el.dataset.target = parseInt(el.textContent, 10);
    counterObs.observe(el);
  });

  /* ── Skill Bars ────────────────────────────────────────── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.dataset.w || '0') + '%';
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill__fill[data-w]').forEach(el => skillObs.observe(el));

  /* ── Portfolio Filter ──────────────────────────────────── */
  const pfBtns = document.querySelectorAll('.pf-btn');
  const pfCards = document.querySelectorAll('.p-card');

  pfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      pfCards.forEach(card => {
        const cat = card.dataset.cat || '';
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
        }
      });
    });
  });

  /* ── Testimonials Slider ───────────────────────────────── */
  const slides  = document.querySelectorAll('.testi-slide');
  const dots    = document.querySelectorAll('.testi__dot');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  let current   = 0, autoSlide;

  function showSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d   => d.classList.remove('active'));
    current = (n + slides.length) % slides.length;
    if (slides[current]) slides[current].classList.add('active');
    if (dots[current])   dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => showSlide(current + 1), 5000);
  }

  if (slides.length) {
    showSlide(0);
    startAuto();
    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(current + 1); startAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startAuto(); }));
  }

  /* ── Contact Form ──────────────────────────────────────── */
  const contactForm   = document.getElementById('contact-form');
  const formStatus    = contactForm?.querySelector('.form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'A enviar…';
      btn.disabled    = true;

      /* Simulate async send — replace with real fetch() to your endpoint */
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = 'Mensagem enviada! Responderei em até 24 horas.';
          formStatus.className   = 'form-status success';
        }
        contactForm.reset();
        btn.textContent = orig;
        btn.disabled    = false;
        setTimeout(() => {
          if (formStatus) formStatus.className = 'form-status';
        }, 6000);
      }, 1400);
    });
  }

  /* ── Back to Top ───────────────────────────────────────── */
  const btt = document.querySelector('.btt');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id  = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Service card hover — sync hovered state ───────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
  });

  /* ── Lazy tilt on project cards (desktop) ──────────────── */
  if (matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.p-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const rx = ((e.clientY - top)  / height - 0.5) * -8;
        const ry = ((e.clientX - left) / width  - 0.5) *  8;
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.style.transition = 'transform 0.05s linear';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform .3s ease';
      });
    });
  }

  /* ── Page load animation ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 50);
  });

  /* Fallback if DOMContentLoaded already fired */
  if (document.readyState !== 'loading') {
    document.body.style.opacity = '1';
  }

})();
