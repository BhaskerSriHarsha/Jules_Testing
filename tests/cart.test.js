// Test helper functions
const resultsDiv = document.getElementById('test-results');

function appendResult(message, passed) {
    const p = document.createElement('p');
    p.textContent = message;
    p.style.color = passed ? 'green' : 'red';
    if (resultsDiv) {
        resultsDiv.appendChild(p);
    } else {
        // Fallback if resultsDiv is not available (e.g. running in a different environment)
        console.log((passed ? 'PASS: ' : 'FAIL: ') + message);
    }
}

function assertEquals(actual, expected, message) {
    if (actual === expected) {
        appendResult(`PASS: ${message} (Expected: ${expected}, Actual: ${actual})`, true);
    } else {
        appendResult(`FAIL: ${message} (Expected: ${expected}, Actual: ${actual})`, false);
    }
}

function assertDeepEquals(actual, expected, message) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        appendResult(`PASS: ${message}`, true);
    } else {
        appendResult(`FAIL: ${message} (Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)})`, false);
    }
}

function assertTrue(value, message) {
    if (value === true) {
        appendResult(`PASS: ${message}`, true);
    } else {
        appendResult(`FAIL: ${message} (Expected: true, Actual: ${value})`, false);
    }
}

function assertNotNull(value, message) {
    if (value !== null && value !== undefined) {
        appendResult(`PASS: ${message}`, true);
    } else {
        appendResult(`FAIL: ${message} (Expected: not null/undefined, Actual: ${value})`, false);
    }
}

// --- Test Setup ---
function setup() {
    localStorage.clear();
    // Reset cartItems in cart.js. This is tricky as it's not directly exposed.
    // We'll re-initialize it by calling the part of cart.js that does this.
    // For tests, we'll assume cart.js initializes cartItems to [] if localStorage is empty.
    // Or, if cart.js is loaded, it will initialize its own cartItems.
    // We will directly manipulate the global cartItems for testing if it's made available,
    // or rely on localStorage and the cart.js loading mechanism.

    // Let's assume cart.js will re-initialize `cartItems` from an empty localStorage.
    // If cart.js is included before this script, its `cartItems` will be initialized.
    // We need to ensure it's reset for each test.
    // A better way would be if cart.js exposed a reset function.
    // For now, we'll manually reset the cartItems if it's global or test through localStorage.
    // In cart.js, cartItems is a global `let` variable. We can't directly reset it from here
    // without cart.js providing a function. So, tests will primarily verify localStorage
    // and then re-initialize by simulating a load if needed.
    cartItems = []; // Assuming cartItems is globally accessible for testing or cart.js initializes it this way.
                   // This is a simplification. Real scenario: cart.js should have an init/reset method.
}

// --- Test Cases ---

// Test: addToCart()
function testAddToCart() {
    setup(); // Clear localStorage and reset cartItems array
    appendResult('--- Running testAddToCart ---', true);

    addToCart('Silk Saree', '75.00', 'silk.jpg');
    let items = JSON.parse(localStorage.getItem('cartItems'));
    assertNotNull(items, 'Cart items in localStorage should not be null after adding.');
    assertEquals(items.length, 1, 'Cart should have 1 item in localStorage.');
    assertEquals(items[0].name, 'Silk Saree', 'Product name should be correct in localStorage.');
    assertEquals(items[0].price, 75.00, 'Product price should be correct in localStorage.');

    // Test cartItems directly (if accessible and updated by addToCart)
    // This depends on how cart.js manages its internal cartItems state after addToCart.
    // For this test, we assume cartItems global variable is updated by addToCart
    assertEquals(cartItems.length, 1, 'In-memory cartItems should have 1 item.');
    assertEquals(cartItems[0].name, 'Silk Saree', 'Product name in cartItems.');

    addToCart('Cotton Saree', '40.00', 'cotton.jpg');
    items = JSON.parse(localStorage.getItem('cartItems'));
    assertEquals(items.length, 2, 'Cart should have 2 items in localStorage after second add.');
    assertEquals(cartItems.length, 2, 'In-memory cartItems should have 2 items.');
    appendResult('--- testAddToCart finished ---', true);
}

// Test: removeFromCart()
function testRemoveFromCart() {
    setup();
    appendResult('--- Running testRemoveFromCart ---', true);

    addToCart('Silk Saree', '75.00', 'silk.jpg');
    addToCart('Cotton Saree', '40.00', 'cotton.jpg');
    addToCart('Designer Saree', '120.00', 'designer.jpg');

    removeFromCart('Cotton Saree'); // Remove the middle item
    let items = JSON.parse(localStorage.getItem('cartItems'));
    assertNotNull(items, 'Cart items should not be null after removing.');
    assertEquals(items.length, 2, 'Cart should have 2 items in localStorage after removing one.');
    assertEquals(items[0].name, 'Silk Saree', 'First item should remain.');
    assertEquals(items[1].name, 'Designer Saree', 'Third item should now be second.');

    // Also test in-memory cartItems if it's distinct and managed by cart.js
    assertEquals(cartItems.length, 2, 'In-memory cartItems should have 2 items after removal.');
    assertEquals(cartItems[0].name, 'Silk Saree', 'First item in cartItems should remain.');
    assertEquals(cartItems[1].name, 'Designer Saree', 'Third item in cartItems should now be second.');

    removeFromCart('Silk Saree');
    items = JSON.parse(localStorage.getItem('cartItems'));
    assertEquals(items.length, 1, 'Cart should have 1 item after removing another.');
    assertEquals(items[0].name, 'Designer Saree', 'Only designer saree should remain.');

    removeFromCart('Designer Saree');
    items = JSON.parse(localStorage.getItem('cartItems'));
    assertEquals(items.length, 0, 'Cart should be empty after removing all items.');
    appendResult('--- testRemoveFromCart finished ---', true);
}

// Test: testLocalStoragePersistence()
function testLocalStoragePersistence() {
    setup();
    appendResult('--- Running testLocalStoragePersistence ---', true);

    addToCart('Persistent Saree', '100.00', 'persistent.jpg');
    // At this point, 'Persistent Saree' is in localStorage and in the current `cartItems` array.

    // Simulate page reload:
    // 1. `cartItems` in memory is effectively cleared.
    // 2. `cart.js` (when loaded on a new page) would re-initialize `cartItems` from localStorage.
    let itemsFromStorage = JSON.parse(localStorage.getItem('cartItems'));
    assertNotNull(itemsFromStorage, 'Items should exist in localStorage before simulated reload.');
    assertEquals(itemsFromStorage.length, 1, 'One item should be in localStorage.');

    // Simulate cart.js re-initializing its cartItems
    // In a real scenario, cart.js would do this: cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // We'll mimic this by directly assigning to our test's version of cartItems
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    assertNotNull(cartItems, 'Cart items should not be null after re-initializing from localStorage.');
    assertEquals(cartItems.length, 1, 'Cart should have 1 item after re-initializing.');
    assertEquals(cartItems[0].name, 'Persistent Saree', 'Correct item name after re-initializing.');
    assertEquals(cartItems[0].price, 100.00, 'Correct item price after re-initializing.');
    appendResult('--- testLocalStoragePersistence finished ---', true);
}


// Test: testClearCart (simulating checkout)
function testClearCart() {
    setup();
    appendResult('--- Running testClearCart ---', true);

    addToCart('Item 1', '10.00', 'item1.jpg');
    addToCart('Item 2', '20.00', 'item2.jpg');

    // Simulate the action that clears the cart (e.g., part of checkout.js logic)
    localStorage.removeItem('cartItems');
    cartItems = []; // Reset in-memory cart

    let itemsFromStorage = JSON.parse(localStorage.getItem('cartItems'));
    assertTrue(itemsFromStorage === null || itemsFromStorage.length === 0, 'localStorage should be empty or null after cart clear.');
    assertEquals(cartItems.length, 0, 'In-memory cartItems should be empty after cart clear.');
    appendResult('--- testClearCart finished ---', true);
}


// Test: displayCartItems (for total calculation)
// This is tricky as displayCartItems directly manipulates DOM.
// We need to mock the DOM elements it expects or refactor cart.js to separate total calculation.
// For now, let's assume we can mock essential DOM elements.
function testCalculateTotalViaDisplayCartItems() {
    setup();
    appendResult('--- Running testCalculateTotalViaDisplayCartItems ---', true);

    // Mock DOM elements required by displayCartItems
    document.body.innerHTML += '<div id="cart-items-container"></div>';
    document.body.innerHTML += '<span id="cart-total"></span>';

    addToCart('Saree A', '50.00', 'sareeA.jpg');
    addToCart('Saree B', '100.00', 'sareeB.jpg');

    displayCartItems(); // This function should update the mocked cart-total span

    const totalSpan = document.getElementById('cart-total');
    assertNotNull(totalSpan, 'Total span element should exist.');
    assertEquals(totalSpan.textContent, '$150.00', 'Cart total should be correctly displayed.');

    // Clean up mocked elements
    const container = document.getElementById('cart-items-container');
    if(container) container.remove();
    if(totalSpan) totalSpan.remove();
    appendResult('--- testCalculateTotalViaDisplayCartItems finished ---', true);
}


// Run all tests
function runAllTests() {
    // Note: cart.js must be loaded for these tests to access its functions like addToCart.
    // Ensure `cartItems` in cart.js is either global or that cart.js has an init/reset function
    // that can be called from here. The current setup() assumes `cartItems` can be globally reset.

    // Check if cart.js functions are available
    if (typeof addToCart !== 'function' || typeof removeFromCart !== 'function' || typeof displayCartItems !== 'function') {
        appendResult('FAIL: cart.js functions (addToCart, removeFromCart, displayCartItems) are not loaded. Tests cannot run.', false);
        return;
    }
     if (typeof cartItems === 'undefined') {
        appendResult('FAIL: cartItems global variable is not available from cart.js. Some tests might not work as expected.', false);
        // If cartItems is not global, tests will rely more on localStorage which is fine
        // but the setup() function's direct reset of cartItems won't work.
    }


    testAddToCart();
    testRemoveFromCart();
    testLocalStoragePersistence();
    testClearCart();
    testCalculateTotalViaDisplayCartItems(); // This test requires DOM elements
}

// Defer running tests until the DOM is loaded, so 'test-results' div is available
// and cart.js has had a chance to load.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests(); // DOMContentLoaded has already fired
}
