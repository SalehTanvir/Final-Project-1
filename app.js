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
let description = document.querySelector("#desc");
let itemType = document.querySelector("#typeItem");
let toggle = document.querySelector("#all_toggle");
let coffee = document.querySelector("#coffee_toggle");
let burger = document.querySelector("#burger_toggle");


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
  return `<div class="item col-md-6 col-lg-4 p-3" data-category="${event.type}",
}">
  <div class="card">
    <div class="img-container">
      <img
        src="${event.url}"
        alt="${event.type}"
      />
      <span class="category-pill">${event.type}</span>
    </div>
    <div class="card-body">
      <h5 class="card-title">${event.name}</h5>
      <p class="card-text">
        ${event.desc}
      </p>
      <button class="addToCartBtn btn w-100">Add to cart</button>
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

/* New Item Function */
function addItem() {
  addNewForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let lastObject = item[item.length - 1];
    let lastId = lastObject.id | 0;
    let newObject = {
      id: lastId + 1,
      name: Name.value,
      url: pic.value,
      desc: description.value,
      type: itemType.value,
    };
    if (newObject.type === "coffee" || newObject.type === "burger") {
      item.push(newObject);
      Name.value = "";
      pic.value = "";
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
  let cartCounter = document.querySelector("#iits-cart_counter");
  let addToCartBtn = document.querySelectorAll(".addToCartBtn");
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      cartCounter.textContent = parseInt(cartCounter.textContent) + 1;
    });
  });
  let cartDecrement = document.querySelector("#cart_dec");
  cartDecrement.addEventListener("click", function () {
    if (parseInt(cartCounter.textContent) > 0) {
      cartCounter.textContent = parseInt(cartCounter.textContent) - 1;
    }
  });
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
      adminSection.style.display = "block";
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
