export function normalize(value = '') {
  return String(value).trim().toLowerCase();
}

export function filterProducts(products, filters = {}) {
  const query = normalize(filters.query);
  const category = normalize(filters.category);
  const collection = normalize(filters.collection);
  const sort = filters.sort || 'featured';

  const filtered = products.filter((product) => {
    const searchable = normalize([
      product.title,
      product.category,
      product.collection,
      ...(product.tags || [])
    ].join(' '));

    return (!query || searchable.includes(query))
      && (!category || normalize(product.category) === category)
      && (!collection || normalize(product.collection) === collection);
  });

  return [...filtered].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    if (sort === 'newest') return (b.releaseOrder || 0) - (a.releaseOrder || 0);
    return (a.featuredOrder || 999) - (b.featuredOrder || 999);
  });
}

export function renderProductCard(product) {
  const image = product.image || 'assets/placeholders/product-placeholder.svg';
  return `
    <article class="product-card" data-product-id="${product.id}">
      <a class="product-card__media" href="product.html?id=${encodeURIComponent(product.id)}">
        <img src="${image}" alt="${product.title}" loading="lazy">
        ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
      </a>
      <div class="product-card__body">
        <p class="eyebrow">${product.collection || product.category}</p>
        <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.title}</a></h3>
        <div class="product-card__footer">
          <span>$${Number(product.price).toFixed(2)}</span>
          <button class="icon-button" type="button" data-wishlist-id="${product.id}" aria-label="Save ${product.title}">♡</button>
        </div>
      </div>
    </article>`;
}

export function renderCatalog(products, container) {
  if (!container) return;
  container.innerHTML = products.length
    ? products.map(renderProductCard).join('')
    : '<div class="empty-state"><h2>No products found</h2><p>Try another search or filter.</p></div>';
}
