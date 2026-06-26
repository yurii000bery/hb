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

  const giftImageCard = document.querySelector('.gift-image-card');
  const imageLightbox = document.querySelector('.image-lightbox');
  const imageLightboxClose = document.querySelector('.image-lightbox__close');

  const closeImageLightbox = () => {
    if (!imageLightbox) return;

    imageLightbox.classList.remove('is-open');
    imageLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-lock');
  };

  const openImageLightbox = () => {
    if (!imageLightbox) return;

    imageLightbox.classList.add('is-open');
    imageLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-lock');
  };

  giftImageCard?.addEventListener('click', openImageLightbox);
  imageLightboxClose?.addEventListener('click', closeImageLightbox);

  imageLightbox?.addEventListener('click', (event) => {
    if (event.target === imageLightbox) closeImageLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeImageLightbox();
  });

  // Video logic
  const autoFrame = document.querySelector('.video-frame--auto');
  const autoVideo = autoFrame?.querySelector('video');

  if (autoVideo) {
    autoVideo.muted = true;
    autoVideo.defaultMuted = true;
    autoVideo.loop = true;
    autoVideo.autoplay = true;
    autoVideo.playsInline = true;

    autoVideo.setAttribute('muted', '');
    autoVideo.setAttribute('autoplay', '');
    autoVideo.setAttribute('loop', '');
    autoVideo.setAttribute('playsinline', '');
    autoVideo.setAttribute('webkit-playsinline', '');

    const startAutoVideo = async () => {
      try {
        autoFrame?.classList.remove('needs-tap');
        await autoVideo.play();
        autoFrame?.classList.add('is-playing');
      } catch (_) {
        autoFrame?.classList.remove('is-playing');
        autoFrame?.classList.add('needs-tap');
      }
    };

    autoVideo.load();

    if (document.readyState === 'complete') {
      startAutoVideo();
    } else {
      window.addEventListener('load', startAutoVideo, { once: true });
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && autoVideo.paused) startAutoVideo();
    });

    autoFrame?.addEventListener('click', startAutoVideo);
    autoFrame?.addEventListener('touchend', startAutoVideo);
  }

  document.querySelectorAll('.video-frame:not(.video-frame--auto)').forEach((frame) => {
    const video = frame.querySelector('video');
    const overlay = frame.querySelector('.video-frame__overlay');

    if (!video) return;

    const resetVideo = (targetVideo) => {
      targetVideo.pause();
      targetVideo.currentTime = 0;
      targetVideo.removeAttribute('controls');

      const targetFrame = targetVideo.closest('.video-frame');
      const targetOverlay = targetFrame?.querySelector('.video-frame__overlay');

      targetFrame?.classList.remove('is-playing');
      if (targetOverlay) targetOverlay.style.opacity = '';
    };

    const playVideo = async () => {
      document.querySelectorAll('.video-frame:not(.video-frame--auto) video').forEach((otherVideo) => {
        if (otherVideo !== video) resetVideo(otherVideo);
      });

      try {
        video.muted = false;
        video.setAttribute('controls', 'controls');
        await video.play();

        frame.classList.add('is-playing');
        if (overlay) overlay.style.opacity = '0';
      } catch (_) {
        video.removeAttribute('controls');
        frame.classList.remove('is-playing');
        if (overlay) overlay.style.opacity = '';
      }
    };

    frame.addEventListener('click', playVideo);

    frame.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      playVideo();
    });

    video.addEventListener('ended', () => {
      video.removeAttribute('controls');
      frame.classList.remove('is-playing');
      if (overlay) overlay.style.opacity = '';
    });
  });
})();