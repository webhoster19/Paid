// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Sample data
const products = {
    burger: [
        { id: 1, name: "Double Beef Burger", price: "RM 12", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", calories: "560 kcal", time: "15-20 min", size: "300g" },
        { id: 2, name: "Cheese Burger", price: "RM 10", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add", calories: "480 kcal", time: "10-15 min", size: "250g" },
        { id: 3, name: "Bacon Burger", price: "RM 14", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b", calories: "620 kcal", time: "15-20 min", size: "320g" }
    ],
    chicken: [
        { id: 4, name: "Chicken Crispy", price: "RM 11", image: "https://images.unsplash.com/photo-1562967914-608f82629710", calories: "450 kcal", time: "12-18 min", size: "280g" },
        { id: 5, name: "Spicy Chicken", price: "RM 13", image: "https://images.unsplash.com/photo-1562967914-608f82629710", calories: "500 kcal", time: "15-20 min", size: "300g" },
        { id: 6, name: "Grilled Chicken", price: "RM 15", image: "https://images.unsplash.com/photo-1562967914-608f82629710", calories: "380 kcal", time: "20-25 min", size: "320g" }
    ],
    fish: [
        { id: 7, name: "Fish Fillet", price: "RM 14", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764", calories: "420 kcal", time: "15-20 min", size: "280g" },
        { id: 8, name: "Salmon Burger", price: "RM 18", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764", calories: "480 kcal", time: "20-25 min", size: "300g" },
        { id: 9, name: "Fish & Chips", price: "RM 16", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764", calories: "550 kcal", time: "15-20 min", size: "350g" }
    ]
};

// Cart state
let cart = [];
let currentCategory = 'burger';
let currentProduct = null;

// DOM elements
const welcomePage = document.getElementById('welcome-page');
const menuPage = document.getElementById('menu-page');
const productPage = document.getElementById('product-page');
const cartPage = document.getElementById('cart-page');
const confirmationPage = document.getElementById('confirmation-page');
const productsContainer = document.querySelector('.products-container');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.getElementById('total-price');

// Initialize the app
function initApp() {
    // Set up Telegram MainButton for welcome page
    tg.MainButton.setText("GET STARTED");
    tg.MainButton.show();
    tg.MainButton.onClick(showMenuPage);
    
    // Set up event listeners
    setupCategoryButtons();
    
    // Load initial category
    loadProducts(currentCategory);
}

// Show menu page
function showMenuPage() {
    welcomePage.classList.remove('active');
    menuPage.classList.add('active');
    productPage.classList.remove('active');
    cartPage.classList.remove('active');
    confirmationPage.classList.remove('active');
    
    // Update Telegram MainButton
    tg.MainButton.setText("VIEW CART");
    tg.MainButton.show();
    tg.MainButton.offClick(showMenuPage);
    tg.MainButton.onClick(showCartPage);
}

// Show product details page
function showProductPage(product) {
    currentProduct = product;
    menuPage.classList.remove('active');
    productPage.classList.add('active');
    
    // Update product details
    document.getElementById('detail-product-img').src = product.image;
    document.getElementById('detail-product-name').textContent = product.name;
    document.getElementById('detail-product-price').textContent = product.price;
    document.getElementById('detail-product-calories').textContent = product.calories;
    document.getElementById('detail-product-time').textContent = product.time;
    document.getElementById('detail-product-size').textContent = product.size;
    
    // Update Telegram MainButton
    tg.MainButton.setText(`ADD TO CART - ${product.price}`);
    tg.MainButton.show();
    tg.MainButton.offClick(showCartPage);
    tg.MainButton.onClick(() => {
        addToCart(product);
        showCartPage();
    });
}

// Show cart page
function showCartPage() {
    menuPage.classList.remove('active');
    productPage.classList.remove('active');
    cartPage.classList.add('active');
    
    renderCartItems();
    
    // Update Telegram MainButton
    if (cart.length > 0) {
        tg.MainButton.setText(`CHECKOUT - ${calculateTotal()}`);
        tg.MainButton.show();
        tg.MainButton.offClick(showCartPage);
        tg.MainButton.onClick(showConfirmationPage);
    } else {
        tg.MainButton.hide();
    }
}

// Show confirmation page
function showConfirmationPage() {
    cartPage.classList.remove('active');
    confirmationPage.classList.add('active');
    
    // Update Telegram MainButton
    tg.MainButton.setText("BACK TO MENU");
    tg.MainButton.show();
    tg.MainButton.offClick(showConfirmationPage);
    tg.MainButton.onClick(() => {
        // Clear cart after order is placed
        cart = [];
        showMenuPage();
    });
}

// Set up category buttons
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            document.querySelector('.category-btn.active').classList.remove('active');
            button.classList.add('active');
            
            // Load products for selected category
            currentCategory = button.dataset.category;
            loadProducts(currentCategory);
        });
    });
}

// Load products for a category
function loadProducts(category) {
    productsContainer.innerHTML = '';
    
    products[category].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            const product = products[category].find(p => p.id === productId);
            showProductPage(product);
        });
    });
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Show cart notification
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
            </div>
            <div class="cart-item-controls">
                <button class="cart-item-btn minus" data-id="${item.id}">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="cart-item-btn plus" data-id="${item.id}">+</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.cart-item-btn.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.cart-item-btn.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            updateCartItemQuantity(productId, 1);
        });
    });
    
    // Update total price
    totalPriceElement.textContent = calculateTotal();
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        renderCartItems();
        
        // Update Telegram MainButton
        if (cart.length > 0) {
            tg.MainButton.setText(`CHECKOUT - ${calculateTotal()}`);
        } else {
            tg.MainButton.hide();
        }
    }
}

// Calculate total price
function calculateTotal() {
    let total = 0;
    
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('RM ', ''));
        total += price * item.quantity;
    });
    
    return `RM ${total.toFixed(2)}`;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);