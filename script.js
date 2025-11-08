// Simple Products System for Beginners
// Basic variables
let allProducts = [];           // All products
let currentProducts = [];       // Currently displayed products
let currentPage = 1;           // Current page
let productsPerPage = 12;      // Products per page

// 1. جلب المنتجات من API
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

// 2. إنشاء أزرار الفئات
function createCategoryButtons() {
  const categoryContainer = document.getElementById('category-filters');
  
  // الحصول على الفئات الفريدة
  const categories = [...new Set(allProducts.map(product => product.category))];
  
  categories.forEach(category => {
    const div = document.createElement('div');
    div.className = 'form-check';
    div.innerHTML = `
      <input class="form-check-input" type="radio" name="category" value="${category}" id="${category}">
      <label class="form-check-label" for="${category}">${category}</label>
    `;
    categoryContainer.appendChild(div);
    
    // إضافة حدث النقر
    div.querySelector('input').addEventListener('change', function() {
      if (this.checked) {
        filterByCategory(category);
      }
    });
  });
}

// 3. فلترة حسب الفئة
function filterByCategory(category) {
  if (category === 'all' || category === '') {
    currentProducts = allProducts;
  } else {
    currentProducts = allProducts.filter(product => product.category === category);
  }
  
  currentPage = 1; // العودة للصفحة الأولى
  showProducts();
  createPagination();
  updateProductCount();
}

// 4. فلترة حسب السعر
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

// 5. ترتيب المنتجات
function sortProducts(sortType) {
  if (sortType === 'price-low') {
    currentProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-high') {
    currentProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'rating') {
    currentProducts.sort((a, b) => b.rating - a.rating);
  }
  
  currentPage = 1; // العودة للصفحة الأولى
  showProducts();
  createPagination();
}

// 6. عرض المنتجات
function showProducts() {
  const container = document.getElementById('product-container');
  container.innerHTML = '';
  
  // حساب المنتجات للصفحة الحالية
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
  
  setTimeout(updateFavoriteIcons, 50);
}

// 7. إنشاء أزرار الصفحات (Pagination)
function createPagination() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  const paginationContainer = document.getElementById('pageNumbers');
  paginationContainer.innerHTML = '';
  
  // إخفاء الpagination إذا كانت صفحة واحدة فقط
  if (totalPages <= 1) {
    document.getElementById('pagination').style.display = 'none';
    return;
  } else {
    document.getElementById('pagination').style.display = 'flex';
  }
  
  // إنشاء أزرار الصفحات
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('li');
    pageButton.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageButton.innerHTML = `<button class="page-link" onclick="goToPage(${i})">${i}</button>`;
    paginationContainer.appendChild(pageButton);
  }
  
  // تحديث أزرار السابق والتالي
  document.getElementById('prevBtn').classList.toggle('disabled', currentPage === 1);
  document.getElementById('nextBtn').classList.toggle('disabled', currentPage === totalPages);
}

// 8. الانتقال لصفحة معينة
function goToPage(pageNumber) {
  currentPage = pageNumber;
  showProducts();
  createPagination();
}

// 9. الصفحة السابقة
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    showProducts();
    createPagination();
  }
}

// 10. الصفحة التالية
function nextPage() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    showProducts();
    createPagination();
  }
}

// 11. تحديث عدد المنتجات
function updateProductCount() {
  document.getElementById('productCount').textContent = currentProducts.length;
}

// 12. مسح جميع الفلاتر
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

// 13. إعداد الأحداث
function setupEvents() {
  // فلتر السعر
  document.getElementById('applyPriceFilter').addEventListener('click', filterByPrice);
  
  // ترتيب المنتجات
  document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      sortProducts(option.dataset.sort);
    });
  });
  
  // مسح الفلاتر
  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
  
  // أزرار التنقل
  document.getElementById('prevBtn').addEventListener('click', previousPage);
  document.getElementById('nextBtn').addEventListener('click', nextPage);
  
  // فلتر "جميع المنتجات"
  document.getElementById('all').addEventListener('change', function() {
    if (this.checked) {
      filterByCategory('all');
    }
  });
}

// 14. بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
  getProducts();
  setupEvents();
});