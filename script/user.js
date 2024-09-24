const history = JSON.parse(localStorage.getItem("history")) || [];
const oldCartItemsContainer = document.getElementById("old-cart-items");
const totalPriceElem = document.getElementById("total-price");

function displayOrderHistory() {
  oldCartItemsContainer.innerHTML = "";
  let grandTotalPrice = 0;

  history.forEach((order, index) => {
    const orderElem = document.createElement("div");
    orderElem.classList.add("order-item");

    const orderDetails = `
      <h3>Order ${index + 1} (Ordered on: ${new Date(order.orderedOn).toLocaleString()})</h3>
      <div class="order-items">
        ${order.items.map(item => `<div>${item.name} - ${item.cost*(item.quantity||1)} (₹${item.cost})</div>`).join('')}
      </div>
      <div class="total-price">Total Price: ₹${order.totalPrice}</div>
    `;
    
    orderElem.innerHTML = orderDetails;
    oldCartItemsContainer.appendChild(orderElem);
    grandTotalPrice += order.totalPrice; // Add to grand total if needed
  });

}

displayOrderHistory();
