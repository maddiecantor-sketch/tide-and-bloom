import { getStore, getCartSubtotal, removeFromCart, updateCartQuantity } from './store.js';

const items = document.getElementById('cart-items');
const subtotal = document.getElementById('subtotal');
const checkout = document.getElementById('checkout-button');

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function render() {
  const state = getStore();
  subtotal.textContent = money(getCartSubtotal(state));

  if (!state.cart.length) {
    items.innerHTML = `
      <div class="empty-state">
        <h2>Your bag is empty</h2>
        <p>Start with the Amalfi Citrus Club collection.</p>
        <a class="button button--secondary" href="amalfi.html">Shop Amalfi</a>
      </div>`;
    checkout.disabled = true;
    return;
  }

  checkout.disabled = false;
  items.innerHTML = state.cart.map((item) => `
    <article class="cart-line" data-key="${item.key}">
      <div class="cart-line__image">
        <img src="${item.product.image || 'assets/placeholders/product-placeholder.svg'}" alt="${item.product.title}">
      </div>
      <div class="cart-line__content">
        <p class="eyebrow">${item.product.collection || ''}</p>
        <h2>${item.product.title}</h2>
        <p>${[item.options.size, item.options.color].filter(Boolean).join(' · ')}</p>
        <label>Quantity
          <input type="number" min="1" value="${item.quantity}" data-quantity="${item.key}">
        </label>
        <button type="button" class="text-button" data-remove="${item.key}">Remove</button>
      </div>
      <strong>${money(item.product.price * item.quantity)}</strong>
    </article>`).join('');
}

items.addEventListener('change', (event) => {
  const key = event.target.dataset.quantity;
  if (key) updateCartQuantity(key, Number(event.target.value));
  render();
});

items.addEventListener('click', (event) => {
  const key = event.target.dataset.remove;
  if (key) removeFromCart(key);
  render();
});

checkout.addEventListener('click', () => {
  alert('Checkout will connect to Shopify once the store and payment provider are configured.');
});

render();
