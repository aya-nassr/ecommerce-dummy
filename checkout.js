// Checkout page functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display order items
function displayOrderItems() {
  const orderItemsContainer = document.getElementById('orderItems');
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  orderItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'd-flex justify-content-between align-items-center mb-2 pb-2 border-bottom';
    orderItem.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 40px; object-fit: contain;" class="me-2 rounded">
        <div>
          <small class="fw-bold d-block">${item.title}</small>
          <small class="text-muted">Qty: ${item.quantity}</small>
        </div>
      </div>
      <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    orderItemsContainer.appendChild(orderItem);
  });
  
  updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('finalTotal').textContent = `$${total.toFixed(2)}`;
}

// Process order
function processOrder() {
  const form = document.getElementById('checkoutForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Show loading
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
  btn.disabled = true;
  
  // Simulate order processing
  setTimeout(() => {
    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success message
    showSuccessModal();
    
    // Reset button
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 2000);
}

// Show success modal
function showSuccessModal() {
  const modal = document.createElement('div');
  modal.className = 'modal fade show';
  modal.style.display = 'block';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center p-5">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
          <h3 class="mt-3 mb-3">Order Placed Successfully!</h3>
          <p class="text-muted mb-4">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <button class="btn btn-primary" onclick="goHome()">Continue Shopping</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Go to home page
function goHome() {
  window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  displayOrderItems();
});