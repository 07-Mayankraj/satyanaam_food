import { tostTopEnd } from "../utils/utils.js";

let database = "../newdb.json";
let fooditems;
let sortOrder = "low";

async function getData() {
  try {
    let data = await fetch(database);
    let response = await data.json();
    fooditems = response;
    displayData(response);
    tostTopEnd.fire({
      icon: "success",
      title: "Food Displayed successfully",
    });
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
      console.log(element)
      cart(element);
    });
  });
}

function cart(data) {
  let arrOfitems = JSON.parse(localStorage.getItem("cart")) || [];
  arrOfitems.push(data);
  localStorage.setItem("cart", JSON.stringify(arrOfitems));
  tostTopEnd.fire({
    icon: "success",
    title: "Added to Bag",
  });
}

// Select all radio buttons
const radioButtons = document.querySelectorAll('input[type="radio"]');

// Add an event listener to each radio button
radioButtons.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    filtered(e.target.dataset.id);
  });
});

function filtered(id) {
  const idStr = String(id);
  let filteredData = fooditems.filter((item) =>
    String(item.id).startsWith(idStr)
  );
  console.log(filteredData);
  displayData(filteredData);
}

let priceSort = document.getElementById("priceSort");
priceSort.addEventListener("change", () => {
  sortOrder = priceSort.value;
  if (!fooditems) return; // Ensure fooditems is defined

  let filteredData = [...fooditems];

  if (sortOrder === "low") {
    filteredData.sort((a, b) => a.cost - b.cost);
  } else if (sortOrder === "high") {
    filteredData.sort((a, b) => b.cost - a.cost);
  }

  displayData(filteredData);
});

// alert(screen.width)