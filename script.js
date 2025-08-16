
document.addEventListener('DOMContentLoaded', () => {
  // Menu burger (mobile)
  const btn = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#menu');
  if(btn && menu){
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Fallback d'images : essaie les différentes variantes de noms jusqu'à trouver un fichier valide
  document.querySelectorAll('img.img-fallback').forEach(img => {
    const variants = JSON.parse(img.getAttribute('data-srcs') || '[]');
    let idx = 0;
    const tryNext = () => {
      if (idx >= variants.length) return;
      const candidate = variants[idx++];
      if (img.src.endsWith(candidate)) { tryNext(); return; }
      const test = new Image();
      test.onload = () => { img.src = candidate; };
      test.onerror = tryNext;
      test.src = candidate;
    };
    img.addEventListener('error', tryNext, { once: true });
    // au cas où la première source échoue immédiatement
    setTimeout(() => {
      if (!img.complete || img.naturalWidth === 0) tryNext();
    }, 50);
  });
});
