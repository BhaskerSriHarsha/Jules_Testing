// Initial localStorage Check
try {
    localStorage.setItem('__testStorage', 'test');
    localStorage.removeItem('__testStorage');
    console.log('localStorage is available and writable.');
} catch (e) {
    console.error('localStorage is not available or not writable:', e);
    // alert('Warning: Your browser settings might prevent the cart from being saved across sessions.');
}

// Initialize cartItems from localStorage or as an empty array
let cartItems = [];
try {
    const storedCartItems = localStorage.getItem('cartItems');
    console.log('Raw cartItems from localStorage:', storedCartItems);
    if (storedCartItems) {
        try {
            cartItems = JSON.parse(storedCartItems);
            console.log('Parsed cartItems from localStorage:', cartItems);
        } catch (e) {
            console.error("Failed to parse cartItems from localStorage:", e);
            cartItems = []; // Default to empty array on parsing error
            console.log('cartItems defaulted to empty array due to parsing error.');
        }
    } else {
        cartItems = [];
        console.log('No cartItems found in localStorage, defaulted to empty array.');
    }
} catch (e) {
    console.error("localStorage.getItem('cartItems') failed:", e);
    cartItems = []; // Default to empty array if localStorage read fails
    console.log('cartItems defaulted to empty array due to localStorage read failure.');
}


// Function to add product to cart
function addToCart(name, price, image) {
    console.log('addToCart called with:', name, price, image);
    const product = { name, price: parseFloat(price), image };
    console.log('Product object created:', product);

    console.log('cartItems before adding new item:', JSON.parse(JSON.stringify(cartItems))); // Deep copy for logging
    cartItems.push(product);
    console.log('cartItems after adding new item:', JSON.parse(JSON.stringify(cartItems))); // Deep copy for logging

    updateCart(); // This will attempt to save to localStorage
    alert(`${name} has been added to your cart!`); // Optional: provide feedback
}

// Function to update cart data and localStorage
function updateCart() {
    console.log('updateCart called. Attempting to save to localStorage.');
    try {
        console.log('Before localStorage.setItem: cartItems =', JSON.parse(JSON.stringify(cartItems)));
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('After localStorage.setItem: Successfully saved to localStorage.');
    } catch (e) {
        console.error("localStorage.setItem('cartItems') failed in updateCart:", e);
        // In-memory cartItems is still updated, so cart works for the current session.
    }

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
    console.log('removeFromCart called for item:', productName);
    console.log('cartItems before removal:', JSON.parse(JSON.stringify(cartItems))); // Deep copy for logging

    cartItems = cartItems.filter(item => item.name !== productName);

    console.log('cartItems after removal:', JSON.parse(JSON.stringify(cartItems))); // Deep copy for logging
    updateCart(); // This will attempt to save to localStorage
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
