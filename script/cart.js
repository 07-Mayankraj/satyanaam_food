const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElem = document.getElementById("total-price");

function display() {
  let totalPrice = 0;
  let count = 0;
  cartItemsContainer.innerHTML = "";
  cart.forEach((item, index) => {
    const cartItemElem = document.createElement("div");
    cartItemElem.innerHTML = "";
    cartItemElem.classList.add("cart-item");

    cartItemElem.innerHTML = `
          <div class="cart-details">
            <h3>${++count}. ${item.name}</h3>
            <div>
                <div class="item-price">₹<span id="item-total-${index}">${
      item.cost
    }</span></div>
                <div class="item-price">(₹${item.cost})</div>
            </div>
          </div>
          <div class="end">
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${index})">-</button>
                <span id="quantity-${index}">1</span>
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
            <button class="remove-button" onclick="removeItem(${index})">Remove</button>
          </div>
        `;

    cartItemsContainer.appendChild(cartItemElem);
    totalPrice += item.cost;
  });

  totalPriceElem.innerText = totalPrice;

  window.increaseQuantity = function (index) {
    const quantityElem = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantityElem.innerText);
    quantity++;
    quantityElem.innerText = quantity;

    // Update item total price
    const itemTotalElem = document.getElementById(`item-total-${index}`);
    const itemTotal = cart[index].cost * quantity;
    itemTotalElem.innerText = itemTotal;

    // Update total price
    totalPrice += cart[index].cost;
    totalPriceElem.innerText = totalPrice;
  };

  window.decreaseQuantity = function (index) {
    const quantityElem = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantityElem.innerText);
    if (quantity > 1) {
      quantity--;
      quantityElem.innerText = quantity;

      // Update item total price
      const itemTotalElem = document.getElementById(`item-total-${index}`);
      const itemTotal = cart[index].cost * quantity;
      itemTotalElem.innerText = itemTotal;

      // Update total price
      totalPrice -= cart[index].cost;
      totalPriceElem.innerText = totalPrice;
    }
  };
}
display();

window.removeItem = function (index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  display();
};
