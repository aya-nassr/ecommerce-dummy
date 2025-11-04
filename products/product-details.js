// product-details.js
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

function addToCart(productId, productTitle, productPrice, productImage, quantity = 1) {
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      quantity: quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showMessage('Product added to cart!');
}

function showMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 m-3 alert alert-success alert-dismissible fade show';
  toast.style.zIndex = '9999';
  toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

async function showProduct(id) {
  const container = document.getElementById('product-details-container');
  
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const p = await res.json();

    container.innerHTML = `
      <div class="card shadow-lg border-0">
        <div class="card-body p-4 p-md-5">
          <div class="row g-4">
            
            <div class="col-md-5">
              <div class="product-image-container bg-light p-3 rounded-3 text-center">
  <!-- الصورة الكبيرة -->
  <img 
    id="main-product-image"
    src="${p.images[0]}" 
    class="img-fluid rounded-3 mb-3" 
    alt="${p.title}" 
    style="max-height: 300px;"
  >

  <!-- الصور المصغرة -->
  <div class="d-flex justify-content-center gap-3">
    ${p.images.slice(0, 3).map(img => `
      <img 
        src="${img}" 
        class="img-thumbnail" 
        alt="${p.title}" 
        style="height: 80px; cursor: pointer;"
        onclick="document.getElementById('main-product-image').src='${img}'"
      >
    `).join('')}
  </div>
</div>
            </div>
            
            <div class="col-md-7">
              <h1 class="card-title fw-bold text-dark mb-2">${p.title}</h1>
              
              <h5 class="fw-bold mb-3">Product Description:</h5>
              <p class="card-text text-secondary mb-4">${p.description}</p>
              
              <div class="mb-4">
                  <label for="productQuantity" class="form-label fw-bold">Quantity:</label>
                  <input type="number" 
                         id="productQuantity" 
                         class="form-control w-auto" 
                         value="1" 
                         min="1" 
                         max="${p.stock}" 
                         style="max-width: 150px;"
                         aria-label="Product Quantity">
                  <small class="text-muted">Max: ${p.stock} units available</small>
              </div>
                ${getRatingStars(p.rating)}
                <span class="text-warning fw-bold mx-2">${p.rating.toFixed(1)}</span>
                <span class="text-muted">(${p.stock} in stock)</span>
              </p>
              
              <hr>
              
              <div class="d-flex align-items-center mb-4">
                <h2 class="text-danger fw-bold me-3">$${p.price.toFixed(2)}</h2>
                ${p.discountPercentage > 0 ? `<span class="badge bg-success fs-6">${p.discountPercentage.toFixed(0)}% OFF</span>` : ''}
              </div>
              
              <button class="btn btn-danger btn-lg w-100 fw-bold" onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.images[0]}', parseInt(document.getElementById('productQuantity').value))">
                <i class="bi bi-cart-fill me-2"></i> Add to Cart
              </button>
            </div>
            
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    // رسالة خطأ
    container.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        Could not load product details. Please try again later.
      </div>
    `;
    console.error('Error loading product:', e);
  }
}

// دالة مساعدة لإنشاء نجوم التقييم
function getRatingStars(rating) {
    const fullStar = '<i class="bi bi-star-fill text-warning"></i>';
    const halfStar = '<i class="bi bi-star-half text-warning"></i>';
    const emptyStar = '<i class="bi bi-star text-warning"></i>';
    let starsHtml = '';
    
    // عدد النجوم الكاملة
    const fullStarsCount = Math.floor(rating);
    // هل هناك نصف نجمة؟
    const hasHalfStar = rating % 1 >= 0.5;
    // عدد النجوم الفارغة
    const emptyStarsCount = 5 - fullStarsCount - (hasHalfStar ? 1 : 0);

    // إضافة النجوم الكاملة
    for (let i = 0; i < fullStarsCount; i++) {
        starsHtml += fullStar;
    }

    // إضافة نصف النجمة
    if (hasHalfStar) {
        starsHtml += halfStar;
    }

    // إضافة النجوم الفارغة
    for (let i = 0; i < emptyStarsCount; i++) {
        starsHtml += emptyStar;
    }

    return starsHtml;
}

function getProductIdFromUrl() {
    // الحصول على المعرف (ID) من URL باستخدام URLSearchParams
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// استدعاء الدالة لعرض المنتج برقم المعرف المستخلص
const productId = getProductIdFromUrl();
showProduct(productId);

// Initialize badges
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateFavoritesBadge();
});

