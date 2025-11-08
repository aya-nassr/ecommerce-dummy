let allProducts = [];           
let currentProducts = [];       
let currentPage = 1;           
let productsPerPage = 12;      

async function getProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=200');
    const data = await response.json();
    allProducts = data.products;
    currentProducts = allProducts;
    
    createCategoryButtons();
    showProducts();
    createPagination();
  } catch (error) {
    console.log('Error fetching products:', error);
  }
}

function createCategoryButtons() {
  const categoryContainer = document.getElementById('category-filters');
 
  const categories = [...new Set(allProducts.map(product => product.category))];
  
  categories.forEach(category => {
    const div = document.createElement('div');
    div.className = 'form-check';
    div.innerHTML = `
      <input class="form-check-input" type="radio" name="category" value="${category}" id="${category}">
      <label class="form-check-label" for="${category}">${category}</label>
    `;
    categoryContainer.appendChild(div);

    div.querySelector('input').addEventListener('change', function() {
      if (this.checked) {
        filterByCategory(category);
      }
    });
  });
}

function filterByCategory(category) {
  if (category === 'all' || category === '') {
    currentProducts = allProducts;
  } else {
    currentProducts = allProducts.filter(product => product.category === category);
  }
  
  currentPage = 1; 
  showProducts();
  createPagination();
  updateProductCount();
}

function filterByPrice() {
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 999999;
  
  currentProducts = allProducts.filter(product => {
    return product.price >= minPrice && product.price <= maxPrice;
  });
  
  currentPage = 1;
  showProducts();
  createPagination();
  updateProductCount();
}

function sortProducts(sortType) {
  if (sortType === 'price-low') {
    currentProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-high') {
    currentProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'rating') {
    currentProducts.sort((a, b) => b.rating - a.rating);
  }
  
  currentPage = 1; 
  showProducts();
  createPagination();
}

function showProducts() {
  const container = document.getElementById('product-container');
  container.innerHTML = '';
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = currentProducts.slice(startIndex, endIndex);
  
  productsToShow.forEach(product => {
    const discount = Math.round(product.discountPercentage || 0);
    const finalPrice = (product.price * (1 - discount / 100)).toFixed(2);
    
    const productCard = document.createElement('div');
    productCard.className = 'col-6 col-md-6 col-lg-4 mb-4';
    productCard.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-3 position-relative product-card">
        <div class="card-icons-overlay">
          <button class="card-icon-btn favorite-btn" data-product-id="${product.id}" onclick="toggleFavorite(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${finalPrice}, '${product.images[0]}', ${product.rating})">
            <i class="bi bi-heart fs-6"></i>
          </button>
          <a href="/products/product-details.html?id=${product.id}" class="card-icon-btn view-btn" title="View Product">
            <i class="bi bi-eye fs-6"></i> 
          </a>
          <button class="card-icon-btn cart-btn-add" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${finalPrice}, '${product.images[0]}')">
            <i class="bi bi-cart-plus fs-6"></i>
          </button>
        </div>
        ${discount > 0 ? `<span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small">-${discount}%</span>` : ''}
        <img src="${product.images[0]}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
        <div class="card-body text-center">
          <h6 class="fw-bold text-truncate mb-2">${product.title}</h6>
          <div class="text-warning mb-2">
            ${getStars(product.rating)} <span class="text-muted small">(${product.rating})</span>
          </div>
          <div class="mt-auto">
            <span class="fw-bold text-danger fs-5">$${finalPrice}</span>
            ${discount > 0 ? `<span class="text-decoration-line-through text-muted small ms-2">$${product.price}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    container.appendChild(productCard);
  });
}

function createPagination() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  const paginationContainer = document.getElementById('pageNumbers');
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) {
    document.getElementById('pagination').style.display = 'none';
    return;
  } else {
    document.getElementById('pagination').style.display = 'flex';
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('li');
    pageButton.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageButton.innerHTML = `<button class="page-link" onclick="goToPage(${i})">${i}</button>`;
    paginationContainer.appendChild(pageButton);
  }

  document.getElementById('prevBtn').classList.toggle('disabled', currentPage === 1);
  document.getElementById('nextBtn').classList.toggle('disabled', currentPage === totalPages);
}

function goToPage(pageNumber) {
  currentPage = pageNumber;
  showProducts();
  createPagination();
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    showProducts();
    createPagination();
  }
}

function nextPage() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    showProducts();
    createPagination();
  }
}

function updateProductCount() {
  document.getElementById('productCount').textContent = currentProducts.length;
}

function clearAllFilters() {
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('all').checked = true;
  
  currentProducts = allProducts;
  currentPage = 1;
  showProducts();
  createPagination();
  updateProductCount();
}

function setupEvents() {
  // فلتر السعر
  document.getElementById('applyPriceFilter').addEventListener('click', filterByPrice);

  document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      sortProducts(option.dataset.sort);
    });
  });

  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

  document.getElementById('prevBtn').addEventListener('click', previousPage);
  document.getElementById('nextBtn').addEventListener('click', nextPage);

  document.getElementById('all').addEventListener('change', function() {
    if (this.checked) {
      filterByCategory('all');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getProducts();
  setupEvents();
});