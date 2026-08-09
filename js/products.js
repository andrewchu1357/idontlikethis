async function loadProducts() {
  const response = await fetch('../data/products.json');
  const products = await response.json();
  return products;
}

async function renderProducts(containerId, filter = null) {
  const products = await loadProducts();
  const container = document.getElementById(containerId);
  if (!container) return;

  let filteredProducts = products;
  if (filter) {
    filteredProducts = products.filter(p => p.id === filter);
  }

  container.innerHTML = '';

  filteredProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card product-card';
    card.innerHTML = `
      <span class="card-num">${product.id.toUpperCase().replace(/-/g, ' ')}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div style="margin-top: 1.5rem;">
        <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">
          ${product.price} ${product.currency}
        </div>
        <button class="cta-button primary add-to-cart-btn" data-id="${product.id}">
          Add to Cart &rarr;
        </button>
      </div>
    `;
    container.appendChild(card);

    // Add event listener to the button
    const btn = card.querySelector('.add-to-cart-btn');
    btn.addEventListener('click', () => {
      cart.addItem(product);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const containerId = document.getElementById('products-container')?.id;
  if (containerId) {
    renderProducts(containerId);
  }
});
