import { tostTopEnd, showProductPopup } from "../utils/utils.js";

let database = "../newdb.json";
let fooditems;
let sortOrder = "low";
var tempData;

if (window.innerWidth > 500) {
  Swal.fire({
    title: "Suggestion",
    icon: "info",
    html: `Your current screen size is ${window.innerWidth}*${window.innerHeight} but <br>This site is optimized for mobile for the best experience.`,
  });
}

document.querySelector(".searchbar").addEventListener("input", search);

function search() {
  let input = document.querySelector(".searchbar").value;
  let newData = fooditems.filter((element) => {
    return element.name.toLowerCase().includes(input.toLowerCase());
  });
  console.log(newData);
  displayData(newData);
}

async function getData() {
  try {
    let data = await fetch(database);
    let response = await data.json();
    fooditems = response;
    displayData(response);
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      confirmButtonText: "Okay!",
    });
  }
}
getData();

let menu = document.querySelector(".menu-container");

function displayData(data) {
  tempData = data;
  menu.innerHTML = "";
  data.forEach((element) => {
    let foodItem = document.createElement("div");
    foodItem.classList = "food-item";

    foodItem.innerHTML = `
      <div class="left">
      <img src="${element.image}" alt="${element.name}" width="300" height="200" />
      </div>
      <div class="right">
        <h3><span class="fas fa-seedling"> ${element.name}</h3>
        <p>${element.description}</p> 
        <div>
          <div class="price"><strong>₹${element.cost}<strong></div> <br>
          <button class="cart-btn fas fa-shopping-cart"> Add</button>
        </div>
      </div>
      <br>
    `;
    menu.append(foodItem);

    let button = foodItem.querySelector(".cart-btn");
    button.addEventListener("click", () => {
      console.log(element);
      cart(element);
    });
  });
}

function cart(data) {
  let arrOfitems = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Check if the item is already in the cart
  let itemExists = arrOfitems.some(item => item.id === data.id);

  if (itemExists) {
    // Item already in cart, show message
    tostTopEnd.fire({
      icon: "info",
      title: "Item already in the cart",
    });
  } else {
    // Add item to the cart
    arrOfitems.push(data);
    localStorage.setItem("cart", JSON.stringify(arrOfitems));
    tostTopEnd.fire({
      icon: "success",
      title: "Added to Bag",
    });
  }
}

// Select all radio buttons
const radioButtons = document.querySelectorAll(".radioo");

// Add an event listener to each radio button
radioButtons.forEach((radio) => {
  radio.addEventListener("click", (e) => {
    filtered(e.target.dataset.id);
  });
});

function filtered(id) {
  const idStr = String(id);
  var filteredData = fooditems.filter((item) =>
    String(item.id).startsWith(idStr)
  );
  console.log(filteredData);
  tempData = filteredData;
  displayData(filteredData);
}

let priceSort = document.getElementById("priceSort");
priceSort.addEventListener("change", () => {
  sortOrder = priceSort.value;
  let filteredData = [...fooditems];

  if (sortOrder === "low") {
    filteredData.sort((a, b) => a.cost - b.cost);
  } else if (sortOrder === "high") {
    filteredData.sort((a, b) => b.cost - a.cost);
  }

  displayData(filteredData);
});

const toggleMenu = () => {
  const icon = document.querySelector(".fa-utensils, .fa-times");
  const popupMenu = document.querySelector(".popup-menu");
  const menuShowButton = document.querySelector(".show-menu");
  if (icon.classList.contains("fa-utensils")) {
    icon.classList = "fas fa-times close-menu";
    popupMenu.style.display = "flex";
    menuShowButton.style.backgroundColor = "#D01818";
  } else {
    icon.classList = "fas fa-utensils";
    popupMenu.style.display = "none";
    menuShowButton.style.backgroundColor = "#007bff";
  }
};

document.querySelector(".fa-utensils").addEventListener("click", toggleMenu);
document.querySelector(".popup-menu").addEventListener("click", toggleMenu);

// popup
let foodItem = document.querySelectorAll(".menu-container");

for (let f of foodItem) {
  f.addEventListener("click", (e) => {
    console.log(e.target.innerText);
    let food = e.target.alt;
    let clickedProduct = tempData.find((item) => item.name === food);
    showProductPopup(clickedProduct);
  });
}
