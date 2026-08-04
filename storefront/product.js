const product = {
  title: "Amalfi Citrus One-Piece",
  price: 88,
  sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  matching: [
    { title: "Men's Amalfi Swim Trunks", price: 68 },
    { title: "Girls' Amalfi One-Piece", price: 54 },
    { title: "Amalfi Cabana Towel", price: 48 }
  ]
};

let selectedSize = null;
let bagCount = 0;

const sizeOptions = document.getElementById("size-options");
const addButton = document.getElementById("add-product");
const bagCountElement = document.getElementById("bag-count");
const matchingGrid = document.getElementById("matching-grid");

product.sizes.forEach((size) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "size-option";
  button.textContent = size;
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    selectedSize = size;
    document.querySelectorAll(".size-option").forEach((option) => {
      const isSelected = option.textContent === size;
      option.classList.toggle("selected", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });
    addButton.textContent = `Add Size ${size} to Bag`;
  });
  sizeOptions.appendChild(button);
});

addButton.addEventListener("click", () => {
  if (!selectedSize) {
    addButton.textContent = "Choose a Size First";
    return;
  }

  bagCount += 1;
  bagCountElement.textContent = bagCount;
  addButton.textContent = "Added to Bag ✓";

  window.setTimeout(() => {
    addButton.textContent = `Add Size ${selectedSize} to Bag`;
  }, 1500);
});

product.matching.forEach((item) => {
  const card = document.createElement("article");
  card.className = "card matching-card";
  card.innerHTML = `
    <div class="matching-image" aria-label="Reserved approved product mockup">Approved mockup</div>
    <div class="card-body">
      <p class="eyebrow">Amalfi Citrus Club</p>
      <h3>${item.title}</h3>
      <p>$${item.price.toFixed(2)}</p>
      <button class="button button-secondary" type="button">View Product</button>
    </div>
  `;
  matchingGrid.appendChild(card);
});
