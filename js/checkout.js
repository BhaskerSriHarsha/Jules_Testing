document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Retrieve form values (can be used for more complex processing later)
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const shippingAddress = document.getElementById('shipping-address').value;
            const city = document.getElementById('city').value;
            const postalCode = document.getElementById('postal-code').value;
            const country = document.getElementById('country').value;
            const cardNumber = document.getElementById('card-number').value; // Simulated

            // Basic validation (optional, more robust validation can be added)
            if (!fullName || !email || !shippingAddress || !city || !postalCode || !country) {
                alert('Please fill in all required fields.');
                return;
            }

            // Simulate order processing
            alert(`Thank you for your order, ${fullName}!\nYour order has been placed and will be shipped to:\n${shippingAddress}, ${city}, ${postalCode}, ${country}.\nA confirmation email will be sent to ${email}.`);

            // Clear the shopping cart
            localStorage.removeItem('cartItems'); // Clear from localStorage
            // If cartItems is managed globally in another script (like cart.js), ensure it's cleared there too.
            // For now, we assume cart.js would re-initialize an empty cart on next load if needed.
            // Or, if cart.js's cartItems is accessible:
            // if (typeof cartItems !== 'undefined') {
            //     cartItems = [];
            // }


            // Redirect to homepage
            window.location.href = 'index.html';
        });
    }
});
