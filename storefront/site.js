(() => {
  const STORE_KEY = 'tideAndBloomStore';

  function readStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      return {
        cart: Array.isArray(parsed.cart) ? parsed.cart : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : []
      };
    } catch (error) {
      console.warn('Could not read Tide & Bloom store state.', error);
      return { cart: [], wishlist: [] };
    }
  }

  function updateHeaderCounts() {
    const state = readStore();
    const cartCount = state.cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const wishlistCount = state.wishlist.length;

    document.querySelectorAll('[data-cart-count]').forEach((element) => {
      element.textContent = String(cartCount);
      element.setAttribute('aria-label', `${cartCount} items in bag`);
    });

    document.querySelectorAll('[data-wishlist-count]').forEach((element) => {
      element.textContent = String(wishlistCount);
      element.setAttribute('aria-label', `${wishlistCount} saved items`);
    });
  }

  function addSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const main = document.querySelector('main');
    if (!main) return;
    if (!main.id) main.id = 'main-content';

    const link = document.createElement('a');
    link.href = `#${main.id}`;
    link.className = 'skip-link';
    link.textContent = 'Skip to main content';
    document.body.prepend(link);
  }

  function setActiveNavigation() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a[href]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.endsWith(page)) link.setAttribute('aria-current', 'page');
    });
  }

  function normalizeExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    });
  }

  function handleImageErrors() {
    document.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        image.hidden = true;
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.setAttribute('role', 'img');
        fallback.setAttribute('aria-label', image.alt || 'Product image coming soon');
        fallback.textContent = 'Image coming soon';
        image.insertAdjacentElement('afterend', fallback);
      }, { once: true });
    });
  }

  function announce(message) {
    let region = document.getElementById('site-announcer');
    if (!region) {
      region = document.createElement('div');
      region.id = 'site-announcer';
      region.className = 'sr-only';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = '';
    window.setTimeout(() => { region.textContent = message; }, 10);
  }

  window.TideBloomSite = { updateHeaderCounts, announce, readStore };

  document.addEventListener('DOMContentLoaded', () => {
    addSkipLink();
    updateHeaderCounts();
    setActiveNavigation();
    normalizeExternalLinks();
    handleImageErrors();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORE_KEY) updateHeaderCounts();
  });
})();
