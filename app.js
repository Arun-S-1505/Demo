// Sample product data (in a real app, this would come from your backend)
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        description: "Advanced smartwatch with health tracking features"
    },
    {
        id: 3,
        name: "Portable Power Bank",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1609592807825-98fe09c5c0da?w=500",
        description: "20000mAh high-capacity portable charger"
    },
    {
        id: 4,
        name: "Wireless Gaming Mouse",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
        description: "Ergonomic gaming mouse with RGB lighting"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const cartLink = document.getElementById('cart-link');
const closeBtn = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Display products
function displayProducts() {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="cta-button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <div class="cart-item-controls">
                    <button onclick="decreaseQuantity(${item.id})" class="quantity-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})" class="quantity-btn">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove All</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Increase quantity
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
        updateCartUI();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Modal functionality
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your purchase! This is where the checkout process would begin.');
    cart = [];
    updateCartUI();
    cartModal.style.display = 'none';
});

// Initialize the page
displayProducts();