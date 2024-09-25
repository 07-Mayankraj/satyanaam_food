const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElem = document.getElementById("total-price");

if (cart.length == 0) {
  Swal.fire({
    icon: "info",
    title: "You cart is empty",
    text: "Redirecting to home...",
    timer: 3000,
    showConfirmButton: false,
    timerProgressBar: true,
    allowOutsideClick: false,
  });
  setTimeout(() => {
    window.location.href = "/pages/menu.html";
  }, 3000);
}

function display() {
  let totalPrice = 0;
  let count = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const cartItemElem = document.createElement("div");
    cartItemElem.classList.add("cart-item");

    // Default quantity to 1 if undefined
    const quantity = item.quantity || 1;
    const itemTotal = item.cost * quantity;

    cartItemElem.innerHTML = `
            <div class="cart-details">
                <h3>${++count}. ${item.name}</h3>
                <div>
                    <div class="item-price">₹<span id="item-total-${index}">${itemTotal}</span></div>
                    <div class="item-price">(₹${item.cost})</div>
                </div>
            </div>
            <div class="end">
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span id="quantity-${index}">${quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
                <button class="remove-button" onclick="removeItem(${index})">Remove</button>
            </div>
        `;

    cartItemsContainer.appendChild(cartItemElem);
    totalPrice += itemTotal; // Update total price based on item total
  });

  totalPriceElem.innerText = totalPrice;
}

// Increase quantity function
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
  const totalPrice = parseInt(totalPriceElem.innerText) + cart[index].cost;
  totalPriceElem.innerText = totalPrice;

  // Update the cart in localStorage
  cart[index].quantity = quantity; // Update quantity in cart
  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
};

// Decrease quantity function
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
    const totalPrice = parseInt(totalPriceElem.innerText) - cart[index].cost;
    totalPriceElem.innerText = totalPrice;

    // Update the cart in localStorage
    cart[index].quantity = quantity; // Update quantity in cart
    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
  }
};

// Initial display of cart items
display();

// Popup for transferring items to order history and sending to WhatsApp
window.popup = function () {
  Swal.fire({
    title: `<code>abc@okhdfcbank</code>`,
    html: `Save the order to history <br> or <br>  Send the order to WhatsApp.`,
    imageUrl: "/images/qr.png",
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "QR Code",
    showCancelButton: true,
    showCloseButton: true,
    allowOutsideClick: false,
    confirmButtonText: "save",
    cancelButtonText: "Send to WhatsApp",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#1ebe57",
    preConfirm: async () => {
      // Prepare new order data
      const newOrder = {
        items: cart.map((item) => ({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity || 1,
        })),
        totalPrice: cart.reduce(
          (sum, item) => sum + item.cost * (item.quantity || 1),
          0
        ), // Calculate total price with quantity
        orderedOn: new Date().toISOString(), // Current date and time
      };

      // Add the order to history and clear the cart
      addOrderToHistory(newOrder);
      localStorage.removeItem("cart"); // Clear cart after transferring
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Send cart items to WhatsApp and then move to history
      sendCartItemsToWhatsApp();
      const newOrder = {
        items: cart.map((item) => ({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity || 1,
        })),
        totalPrice: cart.reduce(
          (sum, item) => sum + item.cost * (item.quantity || 1),
          0
        ), // Calculate total price with quantity
        orderedOn: new Date().toISOString(), // Current date and time
      };

      // Add the order to history
      addOrderToHistory(newOrder);
      localStorage.removeItem("cart"); // Clear cart after transferring
      window.location.reload();
    }
  });
};

// Remove item function
window.removeItem = function (index) {
  cart.splice(index, 1); // Remove the item from the cart
  localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  display(); // Re-display the cart
};

function addOrderToHistory(order) {
  // Check if the order has items and valid total price
  if (order.items && order.items.length > 0 && order.totalPrice > 0) {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(order);
    localStorage.setItem("history", JSON.stringify(history));
  }
}

// Function to send cart items to WhatsApp
window.sendCartItemsToWhatsApp = function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Create a message string
  let message = "This is my order:\n\n";
  cart.forEach((item) => {
    const quantity = item.quantity || 1; // Default to 1 if undefined
    message += `- ${item.name}: ₹${item.cost} x ${quantity}\n`;
  });
  message += `\nTotal: ₹${cart.reduce(
    (sum, item) => sum + item.cost * (item.quantity || 1),
    0
  )}`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp link
  const phoneNumber = "7665770832";
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  // Open the WhatsApp link
  window.open(whatsappLink);
};
