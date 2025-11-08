
// Load featured products
async function loadFeaturedProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=8');
    const data = await res.json();
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
            <img src="${product.images[0]}" class="card-img-top p-3" alt="${product.title}" >
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
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadFeaturedProducts();
});