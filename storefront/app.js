const products = [
  { title: "Amalfi Citrus One-Piece", category: "Women's Swim", price: 88, icon: "👙" },
  { title: "Amalfi Men's Swim Trunks", category: "Men's Swim", price: 68, icon: "🩳" },
  { title: "Little Limone Swimsuit", category: "Kids Swim", price: 52, icon: "🍋" },
  { title: "Amalfi Cabana Towel", category: "Home & Beach", price: 48, icon: "🏖️" },
  { title: "Citrus Club Market Tote", category: "Accessories", price: 38, icon: "👜" },
  { title: "Postcard Club Tee", category: "Graphic Apparel", price: 42, icon: "👕" }
];

let bagCount = 0;

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = products.map((product, index) => `
    <article class="product-card">
      <div class="product-image" aria-label="Placeholder for ${product.title} production mockup">${product.icon}</div>
      <div class="product-copy">
        <h3>${product.title}</h3>
        <div class="product-meta">
          <span>${product.category}</span>
          <span>$${product.price.toFixed(2)}</span>
        </div>
        <button class="add-button" data-product-index="${index}">Add to bag</button>
      </div>
    </article>
  `).join("");

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-index]");
    if (!button) return;
    bagCount += 1;
    document.getElementById("bag-count").textContent = bagCount;
    button.textContent = "Added";
    setTimeout(() => { button.textContent = "Add to bag"; }, 900);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
