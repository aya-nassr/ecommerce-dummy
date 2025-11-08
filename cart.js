// Cart page functionality

// Display cart items
function displayCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    emptyCart.style.display = 'block';
    cartSummary.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';
  
  cartItemsContainer.innerHTML = '';
  
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'border-bottom';
    cartItem.innerHTML = `
      <div class="p-4">
        <div class="row align-items-center">
          <div class="col-md-2 col-3">
            <img src="${item.image}" class="img-fluid rounded shadow-sm" alt="${item.title}" style="height: 80px; object-fit: contain; width: 100%;">
          </div>
          <div class="col-md-4 col-9">
            <h6 class="mb-1 fw-bold">${item.title}</h6>
            <p class="text-muted mb-0 small">Unit Price: <span class="text-dark fw-semibold">$${item.price}</span></p>
          </div>
          <div class="col-md-3 col-6 mt-3 mt-md-0">
            <div class="d-flex align-items-center justify-content-center">
              <button class="btn btn-outline-danger btn-sm" onclick="updateQuantity(${index}, -1)" style="width: 35px; height: 35px;">
                <i class="bi bi-dash"></i>
              </button>
              <span class="mx-3 fw-bold fs-5 text-primary" style="min-width: 30px; text-align: center;">${item.quantity}</span>
              <button class="btn btn-outline-success btn-sm" onclick="updateQuantity(${index}, 1)" style="width: 35px; height: 35px;">
                <i class="bi bi-plus"></i>
              </button>
            </div>
          </div>
          <div class="col-md-2 col-4 mt-3 mt-md-0 text-center">
            <span class="fw-bold text-danger fs-5">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <div class="col-md-1 col-2 mt-3 mt-md-0 text-center">
            <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})" title="Remove item">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  
  updateCartSummary();
}



// Update cart summary
function updateCartSummary() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  displayCartItems();
});