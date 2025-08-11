
// Lightbox
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
    lbImg.src = ''; lbCap.textContent = '';
  }
});

// Back to top
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backBtn.classList.add('show');
  else backBtn.classList.remove('show');
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Tabs behavior — show only one section at a time
const buttons = document.querySelectorAll('.tabbar button');
const sections = document.querySelectorAll('.app-section');
function setActive(target){
  // target = section id or "none"
  sections.forEach(s => s.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));
  if (target && target !== 'none'){
    const el = document.getElementById(target);
    if (el){
      el.classList.add('active');
      document.querySelector(`.tabbar button[data-target="${target}"]`)?.classList.add('active');
      // scroll to tab bar so section starts under it
      document.querySelector('.tabbar').scrollIntoView({behavior:'smooth', block:'start'});
      // reveal animation
      el.querySelectorAll('.reveal').forEach(x=>x.classList.add('show'));
      // update hash
      history.replaceState(null, '', `#${target}`);
    }
  } else {
    // show only hero + footer
    history.replaceState(null, '', '#');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
buttons.forEach(btn => btn.addEventListener('click', ()=> setActive(btn.dataset.target)));

// Deep-link support on load
window.addEventListener('DOMContentLoaded', ()=>{
  const hash = (location.hash || '').replace('#','');
  if (hash){
    setActive(hash);
  }
  // reveal hero/footer
  document.querySelectorAll('section.hero-banner, footer').forEach(x=>x.classList.add('show'));
});

// Contact form (mailto fallback / Formspree optional)
const form = document.getElementById('contactForm');
if (form){
  const statusEl = document.getElementById('formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message){
      statusEl.style.color = '#c53030';
      statusEl.textContent = 'Merci de compléter tous les champs.';
      return;
    }
    const endpoint = form.getAttribute('data-form-endpoint');
    if (endpoint){
      try {
        const res = await fetch(endpoint, { method:'POST', headers:{'Accept':'application/json'}, body:new FormData(form) });
        if (res.ok){ statusEl.style.color = '#2f855a'; statusEl.textContent = 'Merci ! Votre message a été envoyé.'; form.reset(); }
        else { throw new Error('Erreur réseau'); }
      } catch (err){
        statusEl.style.color = '#c53030';
        statusEl.textContent = 'Envoi impossible pour le moment.';
      }
    } else {
      const subject = encodeURIComponent('Contact — Beautiful Family Life');
      const body = encodeURIComponent(`Nom: ${name}%0AEmail: ${email}%0A%0A${message}`);
      window.location.href = `mailto:support@familylife.com?subject=${subject}&body=${body}`;
    }
  });
}
