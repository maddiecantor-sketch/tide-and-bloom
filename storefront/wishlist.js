document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('wishlist-grid');
  const products = window.TideBloomCatalog?.products || [];
  const wishlistIds = window.TideBloomStore?.getWishlist() || [];
  const saved = products.filter((product) => wishlistIds.includes(product.id));

  window.TideBloomStore?.refreshCounts();
  grid.innerHTML = '';

  if (!saved.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h2>Your wishlist is waiting</h2>
        <p>Save pieces from the collection to compare styles and build matching sets.</p>
        <a class="button button--primary" href="amalfi.html">Explore Amalfi Citrus Club</a>
      </div>`;
    return;
  }

  saved.forEach((product) => {
    const card = window.TideBloomCatalog.createProductCard(product);
    const remove = document.createElement('button');
    remove.className = 'button button--ghost';
    remove.type = 'button';
    remove.textContent = 'Remove from wishlist';
    remove.addEventListener('click', () => {
      window.TideBloomStore.toggleWishlist(product.id);
      window.location.reload();
    });
    card.appendChild(remove);
    grid.appendChild(card);
  });
});
