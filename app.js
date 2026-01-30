const item = [];
let items = document.querySelector("#iits-items");
let allItems = items.querySelectorAll(".item");
let dev = document.querySelector("#iits-developer");
let searchSection = document.querySelector("#searchSection");
let searchForm = document.querySelector("#searchForm");
let searchBox = document.querySelector("#iits-searchBox");
let searchBtn = document.querySelector("#btn");
let adminSection = document.querySelector("#iits-adminSection");
let adminBtn = document.querySelector("#iits-adminBtn");
let cancelBtn = document.querySelector("#iits-cancelBtn");
let addNewForm = document.querySelector("#iits-addNewForm");
let Name = document.querySelector("#name");
let pic = document.querySelector("#pic");
let price = document.querySelector("#price");
let description = document.querySelector("#desc");
let itemType = document.querySelector("#typeItem");
let toggle = document.querySelector("#all_toggle");
let coffee = document.querySelector("#coffee_toggle");
let burger = document.querySelector("#burger_toggle");
const cart = [];
let cartCounter = document.querySelector("#iits-cart_counter");
let cartDecrementBound = false;
let isAdminLoggedIn = false;
function syncCartStorage() {
  localStorage.setItem("iits_cart", JSON.stringify(cart));
  cartCounter.textContent = cart.length;
}

const savedCart = JSON.parse(localStorage.getItem("iits_cart") || "[]");
savedCart.forEach((savedItem) => {
  cart.push(savedItem);
});
syncCartStorage();

function updateCartItemsById(updatedItem) {
  cart.forEach((cartItem, index) => {
    if (String(cartItem.id) === String(updatedItem.id)) {
      cart[index] = updatedItem;
    }
  });
  const storedCart = JSON.parse(localStorage.getItem("iits_cart") || "[]");
  const updatedStored = storedCart.map((storedItem) =>
    String(storedItem.id) === String(updatedItem.id)
      ? { ...storedItem, ...updatedItem }
      : storedItem
  );
  localStorage.setItem("iits_cart", JSON.stringify(updatedStored));
}

function removeCartItemsById(itemId) {
  for (let i = cart.length - 1; i >= 0; i--) {
    if (String(cart[i].id) === String(itemId)) {
      cart.splice(i, 1);
    }
  }
  const storedCart = JSON.parse(localStorage.getItem("iits_cart") || "[]");
  const filtered = storedCart.filter((storedItem) => String(storedItem.id) !== String(itemId));
  localStorage.setItem("iits_cart", JSON.stringify(filtered));
}

items.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".deleteItemBtn");
  if (deleteBtn) {
    if (!isAdminLoggedIn) return;
    const itemCard = deleteBtn.closest(".item");
    if (!itemCard) return;
    const itemId = itemCard.getAttribute("data-id");
    const index = item.findIndex((entry) => String(entry.id) === String(itemId));
    if (index === -1) return;
    if (confirm("Are you sure you want to delete this item?")) {
      item.splice(index, 1);
      removeCartItemsById(itemId);
      renderMenu();
    }
    return;
  }

  const updateBtn = event.target.closest(".updateItemBtn");
  if (updateBtn) {
    if (!isAdminLoggedIn) return;
    const itemCard = updateBtn.closest(".item");
    if (!itemCard) return;
    const itemId = itemCard.getAttribute("data-id");
    const index = item.findIndex((entry) => String(entry.id) === String(itemId));
    if (index === -1) return;
    const current = item[index];

    const nameValue = prompt("Update name:", current.name);
    if (nameValue === null) return;
    const urlValue = prompt("Update image URL:", current.url || "");
    if (urlValue === null) return;
    const priceValue = prompt("Update price:", current.price ?? "");
    if (priceValue === null) return;
    const descValue = prompt("Update description:", current.desc || "");
    if (descValue === null) return;
    const typeValue = prompt("Update type (coffee/burger):", current.type || "");
    if (typeValue === null) return;

    const updatedType = typeValue.trim().toLowerCase() || current.type;
    if (updatedType !== "coffee" && updatedType !== "burger") {
      alert("Please select a valid item type");
      return;
    }

    let updatedPrice = current.price;
    const trimmedPrice = priceValue.trim();
    if (trimmedPrice !== "") {
      const parsedPrice = Number(trimmedPrice);
      if (Number.isNaN(parsedPrice)) {
        alert("Please enter a valid price");
        return;
      }
      updatedPrice = parsedPrice;
    }

    const updatedItem = {
      ...current,
      name: nameValue.trim() || current.name,
      url: urlValue.trim() || current.url,
      desc: descValue.trim() || current.desc,
      type: updatedType,
      price: updatedPrice,
    };

    item[index] = updatedItem;
    updateCartItemsById(updatedItem);
    renderMenu();
    return;
  }

  const btn = event.target.closest(".addToCartBtn");
  if (!btn) return;
  const itemCard = btn.closest(".item");
  if (!itemCard) return;
  const itemId = itemCard.getAttribute("data-id");
  const found = item.find((entry) => String(entry.id) === String(itemId));
  if (found) {
    cart.push(found);
    syncCartStorage();
  }
});


/* Search Function */
function searchBar(e) {
    let searchValue = "";
    let count = 0;
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      searchValue = searchBox.value;
      items.innerHTML = "";
      item.forEach(function (event) {
        if (
          event.name.toLowerCase().trim().includes(searchValue.toLowerCase().trim()) &&
          e == "All"
        ) {
          items.innerHTML += menuObj(event);
          count++;
        } else if (
          event.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          e == event.type
        ) {
          items.innerHTML += menuObj(event);
          count++;
        }
      });
      if (count == 0) {
        items.innerHTML = "No item found";
      }
    });
  }
  searchBar("All");
  
  
  /* Search and Filter */
  toggle.addEventListener("click", function () {
    renderMenu();
    searchBar("All");
  });
  coffee.addEventListener("click", function () {
    items.innerHTML = "";
    item.forEach(function (event) {
      if (event.type == "coffee") {
        items.innerHTML += menuObj(event);
      }
      searchBar("coffee");
    });
  });
  burger.addEventListener("click", function () {
    items.innerHTML = "";
    item.forEach(function (event) {
      if (event.type == "burger") {
        items.innerHTML += menuObj(event);
      }
    });
    searchBar("burger");
  });

  /* Taking Inner html  */
function menuObj(event) {
  const imageUrl =
    event.url ||
    event.image ||
    event.img ||
    event.thumbnail ||
    "https://via.placeholder.com/600x400?text=No+Image";
  const priceText = event.price != null ? `$${Number(event.price).toFixed(2)}` : "Price unavailable";
  const updateButtonHtml = isAdminLoggedIn
    ? `<button class="updateItemBtn btn w-100 mt-2">Update item</button>`
    : "";
  const deleteButtonHtml = isAdminLoggedIn
    ? `<button class="deleteItemBtn btn btn-danger w-100 mt-2">Delete item</button>`
    : "";
  return `<div class="item col-md-6 col-lg-4 p-3" data-category="${event.type}" data-id="${event.id}">
  <div class="card">
    <div class="img-container">
      <img
        src="${imageUrl}"
        alt="${event.type}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=No+Image';"
      />
      <span class="category-pill">${event.type}</span>
    </div>
    <div class="card-body">
      <h5 class="card-title">${event.name}</h5>
      <p class="card-text fw-bold mb-1">${priceText}</p>
      <p class="card-text">
        ${event.desc}
      </p>
      <button class="addToCartBtn btn w-100">Add to cart</button>
      ${updateButtonHtml}
      ${deleteButtonHtml}
    </div>
  </div>
</div>`;
}
function renderMenu() {
  items.innerHTML = "";
  item.forEach((item) => {
    items.innerHTML += menuObj(item);
  });
  counter();
  syncCartStorage();
}
/* Gettig Data from API */
async function getData() {
  items.innerHTML = "loading...";
  const Url = "https://64b2e33138e74e386d55b072.mockapi.io/api/hanover";
  const option = {
    method: "GET",
  };
  try {
    let get = await fetch(Url, option);
    let data = await get.json();
    data.forEach((avl) => {
      item.push(avl);
    });
  } catch {
    console.log("Data is Not Available");
  }
  renderMenu();
}
getData();
syncCartStorage();

const cartToggle = document.querySelector("#iits-cart");
cartToggle.addEventListener("click", function () {
  window.location.href = "cart.html";
});

/* New Item Function */
function addItem() {
  addNewForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let lastObject = item[item.length - 1];
    let lastId = lastObject.id | 0;
    const priceValue = price.value.trim();
    const parsedPrice = Number(priceValue);
    let newObject = {
      id: lastId + 1,
      name: Name.value,
      url: pic.value,
      desc: description.value,
      type: itemType.value,
      price: parsedPrice,
    };
    if (newObject.type === "coffee" || newObject.type === "burger") {
      if (priceValue === "" || Number.isNaN(parsedPrice) || parsedPrice < 0) {
        alert("Please enter a valid price");
        return;
      }
      item.push(newObject);
      Name.value = "";
      pic.value = "";
      price.value = "";
      description.value = "";
      itemType.value = "";
      renderMenu();
    } else {
      alert("Please select a valid item");
    }
  });
}
addItem();

/* Cart value Counting Function */
function counter() {
  let cartDecrement = document.querySelector("#cart_dec");
  if (!cartDecrementBound) {
    cartDecrement.addEventListener("click", function () {
      if (cart.length > 0) {
        cart.pop();
        syncCartStorage();
      }
    });
    cartDecrementBound = true;
  }
}

/* Admin Function */
function inactiveAdmin(event) {
    adminSection.style.display = "none";
  }
  inactiveAdmin();
  function activeAdmin(event) {
    let name = prompt("Enter your name: ");
    let password = prompt("Enter your password: ");
    if (name === "iits" && password === "23") {
      isAdminLoggedIn = true;
      adminSection.style.display = "block";
      renderMenu();
    }
    else {
      alert("Wrong ID or Password");
    }
    cancelBtn.addEventListener("click", inactiveAdmin);
  }
  adminBtn.addEventListener("click", activeAdmin);
 /* Name Change */
let changeDev = document.getElementById("iits-developer");
changeDev.innerHTML = "Abu Saleh Tanvir";
