const products = [
  { name: 'Amalfi Citrus One-Piece', price: 88, tag: 'Women’s Swim' },
  { name: 'Amalfi Citrus Bikini Set', price: 84, tag: 'Women’s Swim' },
  { name: 'Amalfi Citrus Swim Trunks', price: 68, tag: 'Men’s Swim' },
  { name: 'Mini Amalfi One-Piece', price: 52, tag: 'Kids’ Swim' },
  { name: 'Mini Amalfi Swim Trunks', price: 48, tag: 'Kids’ Swim' },
  { name: 'Amalfi Citrus Resort Tee', price: 44, tag: 'Graphic Tee' },
  { name: 'Amalfi Cabana Towel', price: 48, tag: 'Home' },
  { name: 'Amalfi Citrus Market Tote', price: 38, tag: 'Accessories' }
];

let cartCount = 0;
const grid = document.querySelector('#amalfi-product-grid');
const cartCountNodes = document.querySelectorAll('[data-cart-count]');

function renderProducts() {
  if (!grid) return;

  grid.innerHTML = products.map((product, index) => `
    <article class="product-card">
      <div class="product-image placeholder-art" role="img" aria-label="Reserved for ${product.name} product image">
        Exact mockup pending
      </div>
      <p class="eyebrow">${product.tag}</p>
      <h3>${product.name}</h3>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="add-to-bag" type="button" data-product-index="${index}">Add to bag</button>
    </article>
  `).join('');
}

function updateCartCount() {
  cartCountNodes.forEach(node => {
    node.textContent = String(cartCount);
  });
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-product-index]');
  if (!button) return;

  cartCount += 1;
  updateCartCount();
  const originalText = button.textContent;
  button.textContent = 'Added';
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 900);
});

document.querySelector('.newsletter form')?.addEventListener('submit', event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = 'You’re on the list';
  button.disabled = true;
});

renderProducts();
updateCartCount();
