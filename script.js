let currentPage = 0;
const limit = 12;
const categoriesList = [
  "beauty", "fragrances", "furniture", "groceries", "home-decoration", 
  "kitchen-accessories", "laptops", "mens-shirts", "skin-care", 
  "smartphones", "sports-accessories", "sunglasses", "tops", 
  "vehicle", "womens-bags", "womens-dresses", "womens-shoes", "womens-watches"
];
let currentCategory = "";
let minPrice = null;
let maxPrice = null;
let currentSort = "default";
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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
  updateFavoritesBadge();
}

function updateFavoriteIcons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const productId = parseInt(btn.dataset.productId);
    const isFavorite = favorites.some(item => item.id === productId);
    const icon = btn.querySelector('i');
    
    if (isFavorite) {
      icon.className = 'bi bi-heart-fill fs-6';
      btn.style.color = '#e74c3c';
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

// --- Cart Functions ---
function updateCartBadge() {
  const cartBadge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
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
  
  // Show success message
  showCartMessage('Product added to cart!');
}

function showCartMessage(message) {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible fade show';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// --- Functions ---

function getStars(rating) {
  const roundedRating = Math.round(rating);
  const fullStars = Math.min(5, roundedRating);
  const emptyStars = 5 - fullStars;
  return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

function updateState(newCategory, newMinPrice, newMaxPrice, newSort, newPage = 0) {
  currentCategory = newCategory !== undefined ? newCategory : currentCategory;
  minPrice = newMinPrice !== undefined ? newMinPrice : minPrice;
  maxPrice = newMaxPrice !== undefined ? newMaxPrice : maxPrice;
  currentSort = newSort !== undefined ? newSort : currentSort;
  currentPage = newPage;
  
  updateURL();
  loadProducts(currentPage);
}

function goToPage(page) {
  currentPage = page;
  updateURL();
  loadProducts(currentPage);
}

function loadCategories() {
  const categoryFilters = document.getElementById('category-filters');

  categoriesList.forEach(category => {
    const div = document.createElement('div');
    div.className = 'form-check';
    div.innerHTML = `
      <input class="form-check-input category-filter" type="radio" name="category" value="${category}" id="${category}">
      <label class="form-check-label" for="${category}">${category.replace(/-/g, ' ')}</label>
    `;
    categoryFilters.appendChild(div);
  });

  document.querySelectorAll('.category-filter').forEach(input => {
    input.addEventListener('change', function() {
      updateState(this.value, undefined, undefined, undefined, 0);
    });
  });
}

function loadProducts(page) {
  let apiUrl = currentCategory ? 
    `https://dummyjson.com/products/category/${currentCategory}?limit=100` :
    `https://dummyjson.com/products?limit=100`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      allProducts = data.products || data;

      // Apply filters
      let filteredProducts = allProducts.filter(product => {
        const price = product.price;
        return (minPrice === null || price >= minPrice) && (maxPrice === null || price <= maxPrice);
      });

      // Apply sorting
      filteredProducts = sortProducts(filteredProducts);

      // Pagination
      const startIndex = page * limit;
      const productsToDisplay = filteredProducts.slice(startIndex, startIndex + limit);

      displayProducts(productsToDisplay);
      updateProductCount(filteredProducts.length);
      updatePagination(page, filteredProducts.length);
    })
    .catch(error => console.error('Error loading products:', error));
}

function sortProducts(products) {
  switch(currentSort) {
    case 'price-low':
      return products.sort((a, b) => a.price - b.price);
    case 'price-high':
      return products.sort((a, b) => b.price - a.price);
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}

function displayProducts(products) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';

  products.forEach(product => {
    const isNew = Math.random() < 0.20;
    const newBadgeHtml = isNew ? `<span class="position-absolute top-0 start-0 bg-success text-white px-2 py-1 small rounded-end new-badge">NEW</span>` : '';
    
    const actualDiscount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
    const discount = isNew ? 0 : actualDiscount;
    const finalPrice = (product.price * (1 - discount / 100)).toFixed(2);
    
    const discountBadgeHtml = discount > 0 ? `
      <span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small rounded-start discount-badge">
        -${discount}%
      </span>` : "";

    const card = document.createElement('div');
    card.className = 'col-6 col-md-6 col-lg-4 mb-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-3 position-relative product-card">
        <div class="card-icons-overlay">
          <button class="card-icon-btn favorite-btn" data-product-id="${product.id}" title="Add to Favorites" onclick="toggleFavorite(${product.id}, '${product.title.replace(/'/g, "\\'")}'', ${finalPrice}, '${product.images[0]}', ${product.rating})">
            <i class="bi bi-heart fs-6"></i>
          </button>
          <a href="/products/product-details.html?id=${product.id}" class="card-icon-btn view-btn" title="View Product">
            <i class="bi bi-eye fs-6"></i> 
          </a>
          <button class="card-icon-btn cart-btn-add" title="Add to Cart" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${finalPrice}, '${product.images[0]}')">
            <i class="bi bi-cart-plus fs-6"></i>
          </button>
        </div>
        ${newBadgeHtml}
        ${discountBadgeHtml}
        <img src="${product.images[0]}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column text-center">
          <h6 class="fw-bold text-truncate mb-2">${product.title}</h6>
          <div class="text-warning mb-2">
            ${getStars(product.rating)} <span class="text-muted small">(${product.rating})</span>
          </div>
          <div class="mt-auto">
            <div class="d-flex justify-content-center align-items-center gap-2">
              <span class="fw-bold text-danger fs-5">$${finalPrice}</span>
              ${discount > 0 ? `<span class="text-decoration-line-through text-muted small">$${product.price}</span>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateProductCount(count) {
  document.getElementById('productCount').textContent = count;
}

function updatePagination(page, totalProducts) {
  const totalPages = Math.ceil(totalProducts / limit);
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.innerHTML = '';
  
  // Update prev/next buttons (Using simplified ID names)
  document.getElementById('prevBtn').classList.toggle('disabled', page === 0);
  document.getElementById('nextBtn').classList.toggle('disabled', page >= totalPages - 1);
  
  // Smart Page Numbering Logic (Kept concise)
  let startPage = Math.max(0, page - 2);
  let endPage = Math.min(totalPages - 1, page + 2);
  
  if (endPage - startPage < 4) {
    if (startPage === 0) endPage = Math.min(totalPages - 1, startPage + 4);
    else startPage = Math.max(0, endPage - 4);
  }
  
  if (startPage > 0) {
    addPageNumber(0, page);
    if (startPage > 1) pageNumbers.innerHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
  }
  
  for (let i = startPage; i <= endPage; i++) {
    addPageNumber(i, page);
  }
  
  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) pageNumbers.innerHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    addPageNumber(totalPages - 1, page);
  }
}

function addPageNumber(pageNum, currentPage) {
  const pageNumbers = document.getElementById('pageNumbers');
  const isActive = pageNum === currentPage;
  
  const pageItem = document.createElement('li');
  pageItem.className = `page-item ${isActive ? 'active' : ''}`;
  // Use goToPage directly
  pageItem.innerHTML = `<button class="page-link" onclick="goToPage(${pageNum})">${pageNum + 1}</button>`;
  
  pageNumbers.appendChild(pageItem);
}

function initializeFilters() {
  // Price filter
  document.getElementById('applyPriceFilter').addEventListener('click', () => {
    const min = parseFloat(document.getElementById('minPrice').value) || null;
    const max = parseFloat(document.getElementById('maxPrice').value) || null;
    updateState(undefined, min, max, undefined, 0);
  });
  
  // Sort options
  document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      updateState(undefined, undefined, undefined, option.dataset.sort, 0);
    });
  });

  // Navigation Buttons
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    // Note: We don't check for max page here, loadProducts will handle disabling the button.
    goToPage(currentPage + 1);
  });

  // Clear filters
  document.getElementById('clearFilters').addEventListener('click', () => {
    // Reset UI elements
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('all').checked = true;
    document.querySelectorAll('.price-quick-filter').forEach(b => b.classList.remove('active'));
    
    // Reset state and reload
    updateState('', null, null, 'default', 0);
  });
}

// URL management
function updateURL() {
  const params = new URLSearchParams();
  if (currentCategory) params.set('category', currentCategory);
  if (minPrice !== null) params.set('minPrice', minPrice);
  if (maxPrice !== null) params.set('maxPrice', maxPrice);
  if (currentSort !== 'default') params.set('sort', currentSort);
  if (currentPage > 0) params.set('page', currentPage);
  
  const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', newURL);
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  currentCategory = params.get('category') || '';
  minPrice = params.get('minPrice') ? parseFloat(params.get('minPrice')) : null;
  maxPrice = params.get('maxPrice') ? parseFloat(params.get('maxPrice')) : null;
  currentSort = params.get('sort') || 'default';
  currentPage = params.get('page') ? parseInt(params.get('page')) : 0;
  
  // Update UI (Kept concise)
  const categoryInput = document.getElementById(currentCategory) || document.getElementById('all');
  if (categoryInput) categoryInput.checked = true;
  
  if (minPrice !== null) document.getElementById('minPrice').value = minPrice;
  if (maxPrice !== null) document.getElementById('maxPrice').value = maxPrice;
}

// --- Initialization ---
loadCategories();
initializeFilters();
loadFromURL();
loadProducts(currentPage);
updateCartBadge();
updateFavoritesBadge();
setTimeout(updateFavoriteIcons, 100);