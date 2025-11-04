// Favorites page functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Update cart badge
function updateCartBadge() {
  const cartBadge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
}

// Add to cart function
function addToCart(productId, productTitle, productPrice, productImage) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showMessage('Product added to cart!');
}

// Remove from favorites
function removeFromFavorites(productId) {
  const index = favorites.findIndex(item => item.id === productId);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    showMessage('Removed from favorites!');
  }
}

// Show message
function showMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible fade show';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// Display favorites
function displayFavorites() {
  const favoritesContainer = document.getElementById('favoriteItems');
  const emptyFavorites = document.getElementById('emptyFavorites');
  
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '';
    emptyFavorites.style.display = 'block';
    return;
  }
  
  emptyFavorites.style.display = 'none';
  favoritesContainer.innerHTML = '';
  
  favorites.forEach(item => {
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'col-6 col-md-4 col-lg-3 mb-4';
    favoriteCard.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-3 position-relative product-card">
        <div class="card-icons-overlay">
          <button class="card-icon-btn" style="background-color: #e74c3c;" title="Remove from Favorites" onclick="removeFromFavorites(${item.id})">
            <i class="bi bi-heart-fill fs-6 text-white"></i>
          </button>
          <button class="card-icon-btn cart-btn-add" title="Add to Cart" onclick="addToCart(${item.id}, '${item.title.replace(/'/g, "\\'")}', ${item.price}, '${item.image}')">
            <i class="bi bi-cart-plus fs-6"></i>
          </button>
        </div>
        <img src="${item.image}" class="card-img-top p-3" alt="${item.title}" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column text-center">
          <h6 class="fw-bold text-truncate mb-2">${item.title}</h6>
          <div class="text-warning mb-2">
            ${'★'.repeat(Math.round(item.rating))}${'☆'.repeat(5-Math.round(item.rating))} 
            <span class="text-muted small">(${item.rating})</span>
          </div>
          <div class="mt-auto">
            <span class="fw-bold text-danger fs-5">$${item.price}</span>
          </div>
        </div>
      </div>
    `;
    favoritesContainer.appendChild(favoriteCard);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  displayFavorites();
});