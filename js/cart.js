// Initialize cartItems from localStorage or as an empty array
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to add product to cart
function addToCart(name, price, image) {
    // For simplicity, we'll add the item even if it's already there.
    // A more advanced version might check and increment quantity.
    const product = { name, price: parseFloat(price), image };
    cartItems.push(product);
    updateCart();
    alert(`${name} has been added to your cart!`); // Optional: provide feedback
}

// Function to update cart data and localStorage
function updateCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // If on cart.html, update the display
    if (document.getElementById('cart-items-container')) {
        displayCartItems();
    }
}

// Function to display cart items on cart.html
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    let total = 0;

    if (!cartContainer) return; // Only run if the container exists

    cartContainer.innerHTML = ''; // Clear previous items

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is currently empty.</p>';
        if (cartTotalSpan) cartTotalSpan.textContent = '$0.00';
        return;
    }

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item'); // For styling

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name;
        itemImage.style.width = '100px'; // Basic styling

        const itemName = document.createElement('h4');
        itemName.textContent = item.name;

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `$${item.price.toFixed(2)}`;

        // (Optional) Add a "Remove from Cart" button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-item-btn'); // Add class for styling
        removeButton.onclick = function() { removeFromCart(item.name); }; // Assuming name is unique for now

        const itemDetailsDiv = document.createElement('div'); // For better structure
        itemDetailsDiv.classList.add('cart-item-details');
        itemDetailsDiv.appendChild(itemName);
        itemDetailsDiv.appendChild(itemPrice);

        itemDiv.appendChild(itemImage);
        itemDiv.appendChild(itemDetailsDiv);
        itemDiv.appendChild(removeButton);
        cartContainer.appendChild(itemDiv);

        total += item.price;
    });

    if (cartTotalSpan) {
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    }
}

// Function to remove item from cart (basic implementation)
function removeFromCart(productName) {
    cartItems = cartItems.filter(item => item.name !== productName);
    updateCart();
}

// Event Listeners for "Add to Cart" buttons (primarily for products.html)
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = button.dataset.price;
            const image = button.dataset.image;
            addToCart(name, price, image);
        });
    });

    // If on cart.html, load and display items
    if (document.getElementById('cart-items-container')) {
        displayCartItems();
    }
});
