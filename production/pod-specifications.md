# Tide & Bloom POD Production Specifications

## Master Artwork Standards

### Seamless Prints
- Final tile sizes: 4000×4000 px minimum; 6000×6000 px preferred
- Resolution: 300 DPI
- Color mode: RGB master; vendor-specific CMYK exports only when requested
- Format: PNG or high-quality JPG depending on vendor
- Must tile seamlessly on all four edges
- No visible seams, clipped motifs, accidental gaps, or edge halos
- Preserve layered source file separately

### Placement Graphics
- Transparent PNG
- 300 DPI
- Minimum 4500×5400 px for apparel front/back graphics
- No background color unless intentionally part of the artwork
- Clean transparency with no white fringe
- Keep editable source file

### Logos and Small Marks
- Transparent PNG and SVG whenever possible
- Minimum 3000 px on longest side for raster exports
- Test legibility at pocket, label, sticker, and embroidery sizes

## Required Collection Asset Set

Each collection must include:

1. Hero seamless print
2. Secondary seamless print
3. Coordinate print
4. Stripe
5. Mini print
6. Texture print
7. Front graphic
8. Back graphic
9. Pocket graphic
10. Sleeve graphic
11. Badge logo
12. Collection logo
13. Sticker pack
14. Embroidery patch artwork
15. Product mockups
16. Source files

## File Naming

Use this pattern:

`TB-COL01-ASSET-NAME-V01.ext`

Examples:
- `TB-COL01-HERO-PRINT-V01.png`
- `TB-COL01-FRONT-GRAPHIC-V01.png`
- `TB-COL01-COLLECTION-LOGO-V01.svg`

## Quality Control Checklist

Before approval:

- [ ] Correct dimensions
- [ ] 300 DPI metadata
- [ ] Seamless repeat verified
- [ ] Transparent background verified where required
- [ ] No trademarked characters, logos, or protected phrases
- [ ] No accidental artifacts or broken anatomy
- [ ] Color palette matches the collection brief
- [ ] Motif line weight is consistent
- [ ] Product-scale test completed
- [ ] Source file archived
- [ ] Vendor mockup reviewed

## Vendor Export Rule

Never overwrite the master artwork. Create vendor-specific exports inside a separate `exports/` folder using the vendor name and product SKU in the filename.
