/* Full JS for Portfolio: menu, theme, reveal, animations, tilt */

// Elements
const mobileToggle = document.getElementById('mobile-toggle');
const mobileDropdown = document.getElementById('mobile-dropdown');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// SAFETY: only attach if elements exist
if (mobileToggle && mobileDropdown) {
  mobileToggle.addEventListener('click', () => {
    const open = mobileDropdown.classList.toggle('open');
    mobileToggle.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileDropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  // close when link clicked
  mobileDropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileDropdown.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded','false');
      mobileDropdown.setAttribute('aria-hidden','true');
    });
  });

  // click outside to close
  document.addEventListener('click', (e) => {
    if (!mobileDropdown.classList.contains('open')) return;
    if (!mobileDropdown.contains(e.target) && !mobileToggle.contains(e.target)) {
      mobileDropdown.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded','false');
      mobileDropdown.setAttribute('aria-hidden','true');
    }
  });

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDropdown.classList.contains('open')) {
      mobileDropdown.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded','false');
      mobileDropdown.setAttribute('aria-hidden','true');
    }
  });
}

// Theme toggle & persist
if (themeToggle) {
  // load
  try {
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');
  } catch (err) { /* ignore */ }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    try {
      localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    } catch (err) {}
    // update icon
    const icon = themeToggle.querySelector('i');
    if (icon) icon.className = body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
  });

  // set initial icon
  const iconInit = themeToggle.querySelector('i');
  if (iconInit) iconInit.className = body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

// Scroll reveal using IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-show');
      // optionally unobserve to avoid repeat
      io.unobserve(entry.target);
    }
  });
},{ threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Floating hero (applies CSS animation)
const heroProfile = document.querySelector('.hero-profile');
if (heroProfile) {
  heroProfile.style.willChange = 'transform';
  heroProfile.style.animation = 'floatHero 6s ease-in-out infinite';
}

// Add neon-hover class to interactive items
document.querySelectorAll('.cta, .project-card, .skill').forEach(el => el.classList.add('neon-hover'));

// 3D tilt for project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ( (y - rect.height / 2) / 18 ).toFixed(2);
    const ry = ( (rect.width / 2 - x) / 18 ).toFixed(2);
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

// Accessibility: focus first mobile link when opened
if (mobileDropdown) {
  const firstLink = mobileDropdown.querySelector('a');
  const mo = new MutationObserver(muts => {
    if (mobileDropdown.classList.contains('open')) {
      setTimeout(() => firstLink && firstLink.focus(), 200);
    }
  });
  mo.observe(mobileDropdown, { attributes: true, attributeFilter: ['class'] });
}
