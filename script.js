// Ubuntu Food Truck — small, framework-free enhancements (mockup build)

document.getElementById('year').textContent = new Date().getFullYear();

// Measure the real header height so the hero can fill exactly the rest of
// the viewport on load — same technique as the Clementine Web Co. site.
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-h', `${siteHeader.offsetHeight}px`);
  };
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal — progressive enhancement, content is fully visible without JS
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Catering inquiry form — progressive enhancement over Web3Forms.
// NOTE: the access_key in index.html is a placeholder until a real one is
// generated for this client (see build-brief.md) — submissions will fail
// until it's swapped in.
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form && status) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending…';
    status.removeAttribute('data-state');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const result = await response.json();

      if (result.success) {
        status.textContent = "Got it — we'll be in touch soon.";
        status.setAttribute('data-state', 'success');
        form.reset();
      } else {
        throw new Error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      status.innerHTML = 'Something went wrong sending that — call or text '
        + '<a href="tel:+17275550163">(727) 555-0163</a> directly.';
      status.setAttribute('data-state', 'error');
    }
  });
}
