

function saveCartAndRefresh() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function saveFavoritesAndRefresh() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesBadge();
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
  }
}

function updateFavoritesBadge() {
  const badge = document.getElementById('favoritesBadge');
  if (badge) {
    badge.textContent = favorites.length;
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

  saveCartAndRefresh();
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

  saveFavoritesAndRefresh();
  updateFavoriteIcons();
}

function updateFavoriteIcons() {
  const buttons = document.querySelectorAll('.favorite-btn');

  for (const btn of buttons) {
    const productId = parseInt(btn.dataset.productId);
    const icon = btn.querySelector('i');
    const isInFavorites = favorites.some(item => item.id === productId);

    if (isInFavorites) {
      icon.className = 'bi bi-heart-fill fs-6';
      btn.style.color = '#ffffffff';
    } else {
      icon.className = 'bi bi-heart fs-6';
      btn.style.color = '';
    }
  }
}

function getStars(rating) {
  const fullStars = Math.round(rating);
  const emptyStars = 5 - fullStars;
  return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

function removeFromFavorites(productId) {
  const existingIndex = favorites.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
  }

  saveFavoritesAndRefresh();
  showMessage('Removed from favorites!');

  if (typeof displayFavorites === 'function') {
    displayFavorites();
  }
}

function updateQuantity(index, change) {

  if (index >= 0 && index < cart.length) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCartAndRefresh();
    displayCartItems();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCartAndRefresh();

  if (typeof displayCartItems === 'function') {
    displayCartItems();
  }
}

function showMessage(message) {
  const messageBox = document.createElement('div');
  messageBox.className = 'position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible fade show';
  messageBox.style.zIndex = '9999';
  messageBox.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(messageBox);

  setTimeout(() => {
    if (messageBox.parentNode) {
      messageBox.remove();
    }
  }, 3000);
}
updateCartBadge();
updateFavoritesBadge();


