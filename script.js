(() => {
  const STORAGE_KEY = 'didus_mi_tut_opened';
  const page = document.body?.dataset.page || '';
  document.body?.classList.add('js-ready');

  if (page === 'mi-tut') {
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (_) {}
  }

  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.requestAnimationFrame(() => {
    revealItems.forEach((item) => {
      if (reduceMotion) item.style.animationDelay = '0ms';
      item.classList.add('is-visible');
    });
  });

  const secondFolder = document.querySelector('[data-folder-step="2"]');
  const toast = document.querySelector('.toast');
  let toastTimer = null;

  const wasFirstOpened = () => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    catch (_) { return false; }
  };

  const showToast = () => {
    if (!toast) return;
    toast.removeAttribute('aria-hidden');
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.setAttribute('aria-hidden', 'true');
    }, 3300);
  };

  if (secondFolder && !wasFirstOpened()) {
    secondFolder.classList.add('is-waiting');
    secondFolder.addEventListener('click', (event) => {
      if (wasFirstOpened()) return;
      event.preventDefault();
      showToast();
    });
  }

  document.querySelectorAll('[data-folder-step="1"]').forEach((folder) => {
    folder.addEventListener('click', () => {
      try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (_) {}
    });
  });
})();
