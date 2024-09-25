const history = JSON.parse(localStorage.getItem("history")) || [];
const oldCartItemsContainer = document.getElementById("old-cart-items");
const sortButton = document.getElementById("sort-button");
let sortOrder = 'desc'; // Initial sort order: descending

function displayOrderHistory() {
    oldCartItemsContainer.innerHTML = "";
    let grandTotalPrice = 0;

    history.forEach((order) => {
        const orderElem = document.createElement("div");
        orderElem.classList.add("order-item");

        const orderDetails = `
            <h3>Ordered on: ${new Date(order.orderedOn).toLocaleString()}</h3>
            <div class="order-items">
                ${order.items.map(item => `<div>${item.name} - ${item.cost * (item.quantity || 1)} (₹${item.cost})</div>`).join('')}
            </div>
            <div class="total-price">Total Price: ₹${order.totalPrice}</div>
        `;
        
        orderElem.innerHTML = orderDetails;
        oldCartItemsContainer.appendChild(orderElem);
        grandTotalPrice += order.totalPrice;
    });
}

function sortOrderHistory() {
    // Sort based on order date
    history.sort((a, b) => {
        return sortOrder === 'desc' ? new Date(b.orderedOn) - new Date(a.orderedOn) : new Date(a.orderedOn) - new Date(b.orderedOn);
    });
    // Toggle sort order
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    displayOrderHistory(); // Refresh display
}

// Add event listener for the floating button
sortButton.addEventListener('click', sortOrderHistory);

// Initial display
displayOrderHistory();


