(() => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('themeToggle');

  // ===== THEME TOGGLE =====
  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Apply theme on load
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 1) Hamburger toggle (mobile)
  function setHamburgerState(isOpen) {
    if (!hamburger || !navLinks) return;
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      setHamburgerState(!isOpen);
    });
    navLinks.addEventListener('click', (e) => {
      const link = e.target && e.target.closest && e.target.closest('a');
      if (!link) return;
      setHamburgerState(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setHamburgerState(false);
    });
  }

  // 2) Navbar shadow on scroll
  function handleNavbarScroll() {
    if (!navbar) return;
    const scrolled = window.scrollY > 10;
    navbar.classList.toggle('scrolled', scrolled);
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // 3) Active nav-link highlighting based on scroll position
  const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));
  const sectionIds = navLinkEls
    .map((a) => (a.getAttribute('href') || '').replace('#', ''))
    .filter(Boolean);

  function setActiveNavLink(activeId) {
    for (const a of navLinkEls) {
      const id = (a.getAttribute('href') || '').replace('#', '');
      a.classList.toggle('active', id === activeId);
    }
  }

  function getActiveSectionId() {
    const offset = 80;
    let active = sectionIds[0] || null;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top - offset <= 0) active = id;
    }
    return active;
  }

  window.addEventListener('scroll', () => {
    const activeId = getActiveSectionId();
    if (activeId) setActiveNavLink(activeId);
  }, { passive: true });

  const initialActive = getActiveSectionId();
  if (initialActive) setActiveNavLink(initialActive);

  // 4) Scroll fade-in
  const fadeEls = Array.from(document.querySelectorAll('.fade-in'));
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  // 5) Hero floating card animations
  const floatingCards = document.querySelectorAll('.hero-float-card');
  floatingCards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.4}s`;
  });
})();


// ===== ACCESSIBILITY & POLISH ENHANCEMENTS =====
(() => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('themeToggle');

  function syncThemeButtonState() {
    if (!themeToggle) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  syncThemeButtonState();
  themeToggle?.addEventListener('click', syncThemeButtonState);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !hamburger || !navLinks) return;
    if (navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!hamburger || !navLinks || !navLinks.classList.contains('open')) return;
    const target = event.target;
    if (target instanceof Node && !navLinks.contains(target) && !hamburger.contains(target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();
