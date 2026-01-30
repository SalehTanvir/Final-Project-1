const cartItemsContainer = document.querySelector("#cart-items");
const cartEmptyText = document.querySelector("#cart-empty");
const cartCount = document.querySelector("#cart-count");
const cartClearBtn = document.querySelector("#cart-clear");

function loadCart() {
  return JSON.parse(localStorage.getItem("iits_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("iits_cart", JSON.stringify(cart));
}

function renderCart() {
  const cart = loadCart();
  cartItemsContainer.innerHTML = "";

  cart.forEach((cartItem, index) => {
    const imageUrl =
      cartItem.url ||
      cartItem.image ||
      cartItem.img ||
      cartItem.thumbnail ||
      "https://via.placeholder.com/600x400?text=No+Image";
    const priceText = cartItem.price != null ? `$${Number(cartItem.price).toFixed(2)}` : "Price unavailable";
    const row = document.createElement("div");
    row.className = "cart-item d-flex align-items-center gap-3";
    row.innerHTML = `
      <img
        src="${imageUrl}"
        alt="${cartItem.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=No+Image';"
      />
      <div class="flex-grow-1">
        <div class="fw-bold">${cartItem.name}</div>
        <div class="fw-bold">${priceText}</div>
        <small class="text-secondary">${cartItem.type}</small>
      </div>
      <button class="btn" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(row);
  });

  cartEmptyText.style.display = cart.length === 0 ? "block" : "none";
  cartCount.textContent = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
  const btn = event.target.closest("button[data-index]");
  if (!btn) return;
  const index = Number(btn.getAttribute("data-index"));
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
});

cartClearBtn.addEventListener("click", function () {
  saveCart([]);
  renderCart();
});

renderCart();
