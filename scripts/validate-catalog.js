#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const candidates = [
  path.join(root, 'production', 'product-catalog.json'),
  path.join(root, 'production', 'master-product-architecture.json'),
  path.join(root, 'collections', 'collections.json')
];

let errors = 0;
let warnings = 0;

function report(level, message) {
  if (level === 'error') {
    errors += 1;
    console.error(`ERROR: ${message}`);
  } else {
    warnings += 1;
    console.warn(`WARN: ${message}`);
  }
}

function loadJson(file) {
  if (!fs.existsSync(file)) {
    report('error', `Required data file is missing: ${path.relative(root, file)}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    report('error', `Invalid JSON in ${path.relative(root, file)}: ${error.message}`);
    return null;
  }
}

function extractArray(data, keys) {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

function validateProducts(data) {
  const products = extractArray(data, ['products', 'catalog', 'items']);
  if (!products.length) {
    report('error', 'No products found in production/product-catalog.json.');
    return;
  }

  const ids = new Set();
  const skus = new Set();

  products.forEach((product, index) => {
    const label = product.title || product.name || product.id || `product ${index + 1}`;
    const id = product.id || product.handle || product.sku;
    const sku = product.sku || product.baseSku;
    const price = Number(product.price ?? product.retailPrice ?? product.retail_price);

    if (!id) report('error', `${label} is missing an id, handle, or SKU.`);
    if (id && ids.has(id)) report('error', `Duplicate product identifier: ${id}`);
    if (id) ids.add(id);

    if (sku && skus.has(sku)) report('error', `Duplicate SKU: ${sku}`);
    if (sku) skus.add(sku);

    if (!(product.title || product.name)) report('error', `${label} is missing a title.`);
    if (!product.collection) report('error', `${label} is missing a collection.`);
    if (!product.category) report('error', `${label} is missing a category.`);
    if (!Number.isFinite(price) || price <= 0) report('error', `${label} has an invalid retail price.`);

    const media = product.media || product.images || [];
    const mediaText = JSON.stringify(media).toLowerCase();
    if (!mediaText || mediaText === '[]') report('warning', `${label} has no product media assigned yet.`);
    if (mediaText.includes('placeholder')) report('warning', `${label} still contains placeholder media.`);

    const status = String(product.status || '').toLowerCase();
    if (status === 'active' && mediaText.includes('placeholder')) {
      report('error', `${label} cannot be active while placeholder media remains.`);
    }
  });

  console.log(`Validated ${products.length} products.`);
}

function validateCollections(data) {
  const collections = extractArray(data, ['collections', 'items']);
  if (!collections.length) {
    report('error', 'No collections found in collections/collections.json.');
    return;
  }

  const ids = new Set();
  collections.forEach((collection, index) => {
    const label = collection.name || collection.title || `collection ${index + 1}`;
    const id = collection.id || collection.handle || collection.slug;
    if (!id) report('error', `${label} is missing an id or handle.`);
    if (id && ids.has(id)) report('error', `Duplicate collection identifier: ${id}`);
    if (id) ids.add(id);
    if (!(collection.name || collection.title)) report('error', `Collection ${index + 1} is missing a name.`);
    if (!Array.isArray(collection.colors) || collection.colors.length < 2) {
      report('warning', `${label} should define at least two collection colors.`);
    }
  });

  console.log(`Validated ${collections.length} collections.`);
}

const productCatalog = loadJson(candidates[0]);
loadJson(candidates[1]);
const collections = loadJson(candidates[2]);

if (productCatalog) validateProducts(productCatalog);
if (collections) validateCollections(collections);

console.log(`Validation complete: ${errors} error(s), ${warnings} warning(s).`);
process.exitCode = errors > 0 ? 1 : 0;
