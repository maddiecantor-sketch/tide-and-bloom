const STORE_KEY = 'tide-bloom-store-v1';

const defaultState = { cart: [], wishlist: [] };

function readStore() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORE_KEY) || '{}') };
  } catch {
    return { ...defaultState };
  }
}

function writeStore(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('tidebloom:store-updated', { detail: state }));
}

export function getStore() {
  return readStore();
}

export function addToCart(product, quantity = 1, options = {}) {
  const state = readStore();
  const key = `${product.id}:${options.size || ''}:${options.color || ''}`;
  const existing = state.cart.find((item) => item.key === key);
  if (existing) existing.quantity += quantity;
  else state.cart.push({ key, product, quantity, options });
  writeStore(state);
  return state;
}

export function removeFromCart(key) {
  const state = readStore();
  state.cart = state.cart.filter((item) => item.key !== key);
  writeStore(state);
  return state;
}

export function updateCartQuantity(key, quantity) {
  const state = readStore();
  const item = state.cart.find((entry) => entry.key === key);
  if (!item) return state;
  if (quantity <= 0) state.cart = state.cart.filter((entry) => entry.key !== key);
  else item.quantity = quantity;
  writeStore(state);
  return state;
}

export function toggleWishlist(product) {
  const state = readStore();
  const exists = state.wishlist.some((item) => item.id === product.id);
  state.wishlist = exists
    ? state.wishlist.filter((item) => item.id !== product.id)
    : [...state.wishlist, product];
  writeStore(state);
  return state;
}

export function getCartCount(state = readStore()) {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(state = readStore()) {
  return state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}
