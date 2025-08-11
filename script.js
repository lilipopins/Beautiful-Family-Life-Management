
// Reveal on scroll using IntersectionObserver
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { root: null, rootMargin: '0px', threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Back to top button
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backBtn.classList.add('show');
  else backBtn.classList.remove('show');
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Lightbox for images
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbCap = document.getElementById('lightboxCaption');
document.querySelectorAll('img.lightboxable').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('close')) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCap.textContent = '';
  }
});

// Contact form: fallback to mailto, optional Formspree endpoint
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Simple validation
  if (!name || !email || !message) {
    statusEl.style.color = '#c53030';
    statusEl.textContent = 'Merci de compléter tous les champs.';
    return;
  }

  const endpoint = form.getAttribute('data-form-endpoint');

  if (endpoint) {
    // Optional: post to Formspree (set your endpoint in data-form-endpoint)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        statusEl.style.color = '#2f855a';
        statusEl.textContent = 'Merci ! Votre message a été envoyé.';
        form.reset();
      } else {
        throw new Error('Erreur réseau');
      }
    } catch (err) {
      statusEl.style.color = '#c53030';
      statusEl.textContent = 'Envoi impossible pour le moment.';
    }
  } else {
    // Fallback mailto
    const subject = encodeURIComponent('Contact — Beautiful Family Life');
    const body = encodeURIComponent(`Nom: ${name}%0AEmail: ${email}%0A%0A${message}`);
    window.location.href = `mailto:support@familylife.com?subject=${subject}&body=${body}`;
  }
});
