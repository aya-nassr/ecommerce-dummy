
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
        <img src="${item.image}" class="card-img-top p-3" alt="${item.title}">
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

document.addEventListener('DOMContentLoaded', function() {
  displayFavorites();
});