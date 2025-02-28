const API_URL = 'http://localhost:5000';
let cart = [];
let token = localStorage.getItem('token');

// Sample product data with Unsplash images
const sampleProducts = [
    {
        id: 1,
        name: "Classic Chocolate Brownie",
        description: "Rich and fudgy classic chocolate brownie",
        price: 3.99,
        image_url: "https://images.unsplash.com/photo-1589375025852-a66cca98b1b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Walnut Brownie",
        description: "Classic brownie loaded with premium walnuts",
        price: 4.49,
        image_url: "https://images.unsplash.com/photo-1612886623532-0a13c47f6f0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Triple Chocolate Brownie",
        description: "Three types of premium chocolate in one brownie",
        price: 4.99,
        image_url: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Caramel Swirl Brownie",
        description: "Chocolate brownie with caramel swirls",
        price: 4.99,
        image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const authBtn = document.getElementById('authBtn');
const cartModal = document.getElementById('cartModal');
const authModal = document.getElementById('authModal');
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const authForm = document.getElementById('authForm');
const toggleAuth = document.getElementById('toggleAuth');

// Event Listeners
cartBtn.addEventListener('click', () => cartModal.style.display = 'block');
authBtn.addEventListener('click', () => authModal.style.display = 'block');

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        cartModal.style.display = 'none';
        authModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
    if (e.target === authModal) authModal.style.display = 'none';
});

// Authentication
let isLoginMode = true;
toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    document.querySelector('#authForm h2').textContent = isLoginMode ? 'Login' : 'Register';
    toggleAuth.textContent = isLoginMode ? 'Register' : 'Login';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Authentication failed');

        const data = await response.json();
        if (data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            authModal.style.display = 'none';
            authBtn.textContent = 'Logout';
            alert(isLoginMode ? 'Login successful!' : 'Registration successful!');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Products
async function fetchProducts() {
    try {
        // For demo purposes, using sample data instead of API call
        displayProducts(sampleProducts);
        
        // Uncomment below for actual API integration
        /*const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        displayProducts(products);*/
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayProducts(products) {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product)})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Cart
function addToCart(product) {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cartCount').textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.product.name} x ${item.quantity}</span>
            <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

// Checkout
checkoutBtn.addEventListener('click', async () => {
    if (!token) {
        alert('Please login to checkout');
        cartModal.style.display = 'none';
        authModal.style.display = 'block';
        return;
    }

    try {
        const orderData = {
            items: cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.price
            })),
            total_amount: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
            shipping_address: prompt('Please enter your shipping address:'),
            contact_phone: prompt('Please enter your contact phone number:')
        };

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Failed to create order');

        cart = [];
        updateCartUI();
        cartModal.style.display = 'none';
        alert('Order placed successfully!');
    } catch (error) {
        alert(error.message);
    }
});

// Initialize
fetchProducts();