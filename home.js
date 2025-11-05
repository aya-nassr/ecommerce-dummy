// Cart functionality for home page
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Update cart badge
function updateCartBadge() {
  const cartBadge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
}

// --- Favorites Functions ---
function toggleFavorite(productId, productTitle, productPrice, productImage, productRating) {
  const existingIndex = favorites.findIndex(item => item.id === productId);
  
  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    showCartMessage('Removed from favorites!');
  } else {
    favorites.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      rating: productRating
    });
    showCartMessage('Added to favorites!');
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoriteIcons();
}

function updateFavoriteIcons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const productId = parseInt(btn.dataset.productId);
    const isFavorite = favorites.some(item => item.id === productId);
    const icon = btn.querySelector('i');
    
    if (isFavorite) {
      icon.className = 'bi bi-heart-fill fs-6';
    } else {
      icon.className = 'bi bi-heart fs-6';
      btn.style.color = '';
    }
  });
  updateFavoritesBadge();
}

function updateFavoritesBadge() {
  const favoritesBadge = document.getElementById('favoritesBadge');
  if (favoritesBadge) {
    favoritesBadge.textContent = favorites.length;
  }
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
  
  // Show success message
  showCartMessage('Product added to cart!');
}

// Show cart message
function showCartMessage(message) {
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

// Load featured products
function loadFeaturedProducts() {
  fetch('https://dummyjson.com/products?limit=8')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('product-list');
      container.innerHTML = '';
      
      data.products.forEach(product => {
        const isNew = Math.random() < 0.3;
        const discount = isNew ? 0 : Math.round(product.discountPercentage || 0);
        const finalPrice = (product.price * (1 - discount / 100)).toFixed(2);
        
        const productCard = document.createElement('div');
        productCard.className = 'col-6 col-md-6 col-lg-3 mb-4';
        productCard.innerHTML = `
          <div class="card h-100 shadow-sm border-0 rounded-3 position-relative product-card">
            <div class="card-icons-overlay">
              <a href="/products/product-details.html?id=${product.id}" class="card-icon-btn view-btn" title="View Product">
                <i class="bi bi-eye fs-6"></i>
              </a>
              <button class="card-icon-btn favorite-btn" data-product-id="${product.id}" title="Add to Favorites" onclick="toggleFavorite(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${finalPrice}, '${product.images[0]}', ${product.rating})">
                <i class="bi bi-heart fs-6"></i>
              </button>
              <button class="card-icon-btn cart-btn-add" title="Add to Cart" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${finalPrice}, '${product.images[0]}')">
                <i class="bi bi-cart-plus fs-6"></i>
              </button>
            </div>
            ${isNew ? '<span class="position-absolute top-0 start-0 bg-success text-white px-2 py-1 small rounded-end new-badge">NEW</span>' : ''}
            ${discount > 0 ? `<span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small rounded-start discount-badge">-${discount}%</span>` : ''}
            <img src="${product.images[0]}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
            <div class="card-body d-flex flex-column text-center">
              <h6 class="fw-bold text-truncate mb-2">${product.title}</h6>
              <div class="text-warning mb-2">
                ${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5-Math.round(product.rating))} 
                <span class="text-muted small">(${product.rating})</span>
              </div>
              <div class="mt-auto">
                <div class="d-flex justify-content-center align-items-center gap-2">
                  <span class="fw-bold text-danger fs-5">$${finalPrice}</span>
                  ${discount > 0 ? `<span class="text-decoration-line-through text-muted small">$${product.price}</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
        container.appendChild(productCard);
      });
    })
    .catch(error => console.error('Error loading products:', error));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateFavoritesBadge();
  loadFeaturedProducts();
  setTimeout(updateFavoriteIcons, 100);
});