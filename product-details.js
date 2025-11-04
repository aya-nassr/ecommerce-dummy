let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function updateCartBadge() {
  const cartBadge = document.getElementById('cartBadge');
  if (cartBadge) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
  }
}

function updateFavoritesBadge() {
  const favoritesBadge = document.getElementById('favoritesBadge');
  if (favoritesBadge) {
    favoritesBadge.textContent = favorites.length;
  }
}

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

function toggleFavorite(productId, productTitle, productPrice, productImage, productRating) {
  const existingIndex = favorites.findIndex(item => item.id === productId);
  
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    showMessage('Removed from favorites!');
  } else {
    favorites.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      rating: productRating
    });
    showMessage('Added to favorites!');
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesBadge();
}

function showMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible fade show';
  toast.style.zIndex = '9999';
  toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateFavoritesBadge();
});