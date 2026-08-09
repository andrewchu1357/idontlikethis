class CartUI {
  constructor() {
    this.cartModal = null;
    this.cartItemsList = null;
    this.cartTotalElement = null;
    this.cartCountElement = null;
    this.init();
  }

  init() {
    // Create the cart modal if it doesn't exist
    if (!document.getElementById('cartModal')) {
      this.createModal();
    }
    this.cartModal = document.getElementById('cartModal');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartTotalElement = document.getElementById('cartTotal');
    this.cartCountElement = document.querySelector('.cart-count');
    
    // Listen for cart changes
    window.addEventListener('cartUpdated', () => {
      this.render();
    });
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h3>Your Cart</h3>
          <button id="closeCart" class="close-btn">&times;</button>
        </div>
        <div id="cartItemsList" class="cart-items-list">
          <!-- Cart items will be rendered here -->
        </div>
        <div class="cart-modal-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span id="cartTotal">0.00 ETH</span>
          </div>
          <button id="checkoutBtn" class="cta-button primary" style="width: 100%; margin-top: 1rem;">Checkout</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('closeCart');
    closeBtn.addEventListener('click', () => {
      this.cartModal.classList.remove('active');
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = '../s-packs/buy-spacks.html';
    });
  }

  render() {
    if (!this.cartItemsList) return;

    this.cartItemsList.innerHTML = '';
    
    if (cart.items.length === 0) {
      this.cartItemsList.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
      cart.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">${item.price} ${item.currency}</span>
            <div class="cart-item-controls">
              <button class="qty-btn decrease" data-id="${item.id}" data-qty="${item.quantity - 1}">-</button>
              <span class="qty">${item.quantity}</span>
              <button class="qty-btn increase" data-id="${item.id}" data-qty="${item.quantity + 1}">+</button>
            </div>
          </div>
          <button class="remove-item-btn" data-id="${item.id}">&times;</button>
        `;
        this.cartItemsList.appendChild(itemEl);
      });

      // Add event listeners to new elements
      this.attachEventListeners();
    }

    this.cartTotalElement.textContent = `${cart.getTotal().toFixed(4)} ${cart.items.length > 0 ? cart.items[0].currency : 'ETH'}`;
    
    // Update cart icon badge
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.getItemCount();
        cartCount.parentElement.style.display = cart.getItemCount() > 0 ? 'block' : 'none';
    }
  }

  attachEventListeners() {
    this.cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const qty = parseInt(e.target.getAttribute('data-qty'));
        cart.updateQuantity(id, qty);
      });
    });

    this.cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        cart.removeItem(id);
      });
    });
  }

  open() {
    this.cartModal.classList.add('active');
  }
}

// Custom event for cart updates
window.dispatchEvent(new CustomEvent('cartUpdated'));

// Initialize Cart UI
document.addEventListener('DOMContentLoaded', () => {
  window.cartUI = new CartUI();
  
  // Hook into cart's save method to trigger update event
  const originalSave = cart.save.bind(cart);
  cart.save = function() {
    originalSave();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
});
