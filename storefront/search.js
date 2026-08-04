document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const category = document.getElementById('category-filter');
  const sort = document.getElementById('sort-filter');
  const results = document.getElementById('search-results');
  const resultCount = document.getElementById('result-count');

  const products = window.TideBloomCatalog?.products || [];
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))].sort();

  categories.forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    category.appendChild(option);
  });

  const render = () => {
    const term = input.value.trim().toLowerCase();
    let filtered = products.filter((product) => {
      const searchable = [product.title, product.category, product.collection, ...(product.tags || [])]
        .join(' ')
        .toLowerCase();
      const matchesTerm = !term || searchable.includes(term);
      const matchesCategory = category.value === 'all' || product.category === category.value;
      return matchesTerm && matchesCategory;
    });

    if (sort.value === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort.value === 'newest') filtered.sort((a, b) => (b.releaseOrder || 0) - (a.releaseOrder || 0));

    resultCount.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
    results.innerHTML = '';

    if (!filtered.length) {
      results.innerHTML = '<div class="empty-state"><h2>No products found</h2><p>Try another keyword or category.</p></div>';
      return;
    }

    filtered.forEach((product) => {
      results.appendChild(window.TideBloomCatalog.createProductCard(product));
    });
  };

  [input, category, sort].forEach((element) => element.addEventListener('input', render));
  window.TideBloomStore?.refreshCounts();
  render();
});
