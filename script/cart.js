const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElem = document.getElementById("total-price");

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

// Popup for transferring items to order history
window.popup = function () {
    Swal.fire({
        title: "Scan The QR",
        text: "Clicking the button will transfer items to history.",
        imageUrl: "/images/qr.png",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "QR Code",
        confirmButtonText: "Done",
        preConfirm: async () => {
            // Prepare new order data
            const newOrder = {
                items: cart.map((item) => ({
                    name: item.name,
                    cost: item.cost,
                    quantity: item.quantity || 1, // Include quantity
                })),
                totalPrice: cart.reduce((sum, item) => sum + (item.cost * (item.quantity || 1)), 0), // Calculate total price with quantity
                orderedOn: new Date().toISOString(), // Current date and time
            };
            // Update history in localStorage
            const existingHistory = JSON.parse(localStorage.getItem("history")) || [];
            existingHistory.push(newOrder);
            localStorage.setItem("history", JSON.stringify(existingHistory));
            localStorage.removeItem("cart"); // Clear cart after transferring
        },
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload(); // Reload the page after confirming
        }
    });
};

// Remove item function
window.removeItem = function (index) {
    cart.splice(index, 1); // Remove the item from the cart
    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
    display(); // Re-display the cart
};
