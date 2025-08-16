
document.addEventListener('DOMContentLoaded', () => {
  // Menu burger
  const btn = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#menu');
  if(btn && menu){
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // Fallback pour l'image Tarifs si le nom alternatif est présent
  const tarifsImg = document.querySelector('img[alt="Tarifs & Offre Premium"]');
  if(tarifsImg && tarifsImg.dataset.fallback){
    tarifsImg.addEventListener('error', () => {
      tarifsImg.src = tarifsImg.dataset.fallback;
    }, { once: true });
  }
});
