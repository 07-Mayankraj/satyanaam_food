import { tostTopEnd } from "../utils/utils.js";

let database = "../db.json";

async function getData() {
  try {
    let data = await fetch(database);
    let respone = await data.json();
    displayData(respone);
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
  data.forEach((element) => {
    let foodItem = document.createElement("div");
    foodItem.classList = "food-item";

    foodItem.innerHTML += `
          
              <img src="${element.image}" alt="${element.name}" width="300" height="200" />
              <h3>${element.name}</h3>
              <p>
               ${element.description}
              </p>
              <div class="price">${element.cost} Rs</div> <br>
         <br>
      `;
    let button = document.createElement("button");
    button.classList = "cart-btn";
    button.textContent = "Add To Plate";
    foodItem.append(button);

    button.addEventListener("click", () => {
      cart(element);
    });

    menu.append(foodItem);
    console.log(element);
  });
}

function cart(data) {
    let arrOfitems = JSON.parse(localStorage.getItem("cart")) || [];
    arrOfitems.push(data);
    localStorage.setItem("cart", JSON.stringify(arrOfitems));
    tostTopEnd.fire({
      icon: "success",
      title: "added to wishlist",
    });
}
