let cart = [];

function addToCart(product) {
    cart.push(product);
    updateCartUI();
}

function updateCartUI() {
    const cartElement = document.getElementById('cart');
    cartElement.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price}</span>
        </div>
    `).join('');
}