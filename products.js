

async function fetchAndDisplayProducts() {
  const apiUrl = 'https://dummyjson.com/products?limit=8';
  const productList = document.getElementById('product-list');
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    productList.innerHTML = '';
    data.products.forEach((product, index) => {
      const isNew = index < 3;
      const newBadgeHtml = isNew
        ? `<span class="position-absolute top-0 start-0 bg-success text-white px-2 py-1 small rounded-end new-badge">NEW</span>`
        : '';

      const actualDiscount = product.discountPercentage
        ? Math.round(product.discountPercentage)
        : 0;

      const discount = isNew ? 0 : actualDiscount;

      const finalPrice = (product.price * (1 - discount / 100)).toFixed(2);

      const discountBadgeHtml =
        discount > 0
          ? `
              <span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small rounded-start discount-badge">
                -${discount}%
              </span>`
          : '';

      const card = document.createElement('div');
      card.className = 'col-6 col-md-4 col-lg-3 mb-4 d-flex';
      card.innerHTML = `
          <div class="card h-100 shadow-lg w-100 border-0 rounded-4 position-relative">
           <div class="card-icons-overlay">
    <a href="/products/product-details.html?id=${product.id}"
       class="card-icon-btn view-btn" 
       title="View Product">
        <i class="bi bi-eye fs-6"></i> 
    </a>
    
    
    <button class="card-icon-btn cart-btn-add" data-product-id="${product.id
        }" title="Add to Cart">
        <i class="bi bi-cart-plus fs-6"></i>
    </button>
</div>
            ${newBadgeHtml}
            ${discountBadgeHtml} 
            
            <img src="${product.images[0]}" class="card-img p-3" alt="${product.title
        }">
            <div class="card-body d-flex flex-column text-center">
              <h6 class="fw-bold text-truncate">${product.title}</h6>
              <div class="text-warning mb-2">
                ${getStars(product.rating)} <span class="text-dark">(${product.rating
        })</span>
              </div>
              <div class="mt-auto">
             
                  <span class="fw-bold text-success fs-6">$${finalPrice}</span>
                  ${discount > 0
          ? `<span class="text-decoration-line-through ms-2">$${product.price}</span>`
          : ''
        }
                  
              </div>
            </div>
          </div>
        `;
      productList.appendChild(card);
    });
  }
  catch (error) {
    console.error("Failed to fetch products:", error);
  }

}

fetchAndDisplayProducts();