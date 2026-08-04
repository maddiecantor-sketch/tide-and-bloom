#!/usr/bin/env node

/**
 * Tide & Bloom Shopify CSV Exporter
 *
 * Reads production/product-catalog.json and creates exports/shopify-products.csv.
 * This is a starter exporter. Product media URLs and real variant inventory data
 * must be added before importing into a live Shopify store.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'production', 'product-catalog.json');
const exportDir = path.join(root, 'exports');
const outputPath = path.join(exportDir, 'shopify-products.csv');

function csv(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function loadProducts() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing product catalog: ${sourcePath}`);
  }

  const parsed = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  return Array.isArray(parsed) ? parsed : parsed.products || [];
}

function buildRows(products) {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option2 Name',
    'Option2 Value',
    'Variant SKU',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Image Src',
    'Image Alt Text',
    'SEO Title',
    'SEO Description',
    'Status'
  ];

  const rows = [headers.map(csv).join(',')];

  products.forEach((product) => {
    const sizes = product.sizes?.length ? product.sizes : ['One Size'];
    const colors = product.colors?.length ? product.colors : ['Default'];
    const handle = product.handle || slugify(product.title || product.name);
    let firstVariant = true;

    sizes.forEach((size) => {
      colors.forEach((color) => {
        const skuBase = product.sku || product.id || handle.toUpperCase();
        const sku = `${skuBase}-${slugify(size).toUpperCase()}-${slugify(color).toUpperCase()}`;
        const row = [
          handle,
          firstVariant ? product.title || product.name : '',
          firstVariant ? product.description || '' : '',
          firstVariant ? 'Tide & Bloom' : '',
          firstVariant ? product.shopifyCategory || '' : '',
          firstVariant ? product.category || '' : '',
          firstVariant ? (product.tags || []).join(', ') : '',
          firstVariant ? 'FALSE' : '',
          'Size',
          size,
          'Color',
          color,
          sku,
          product.retailPrice || product.price || '',
          product.compareAtPrice || '',
          'TRUE',
          'TRUE',
          firstVariant ? product.image || '' : '',
          firstVariant ? `${product.title || product.name} product image` : '',
          firstVariant ? product.seoTitle || product.title || product.name : '',
          firstVariant ? product.seoDescription || product.description || '' : '',
          'draft'
        ];
        rows.push(row.map(csv).join(','));
        firstVariant = false;
      });
    });
  });

  return rows.join('\n');
}

try {
  const products = loadProducts();
  if (!products.length) throw new Error('Product catalog contains no products.');
  fs.mkdirSync(exportDir, { recursive: true });
  fs.writeFileSync(outputPath, buildRows(products));
  console.log(`Exported ${products.length} products to ${outputPath}`);
} catch (error) {
  console.error(`Shopify export failed: ${error.message}`);
  process.exitCode = 1;
}
