class CartUI {
  constructor() {
    this.cartModal = null;
    this.cartItemsList = null;
    this.cartTotalElement = null;
    this.cartCountElement = null;
    this.cartItemCountElement = null;
    this.cartIconElement = null;
    this.init();
  }

  init() {
    if (!document.getElementById('cartModal')) {
      this.createModal();
    }
    this.cartModal = document.getElementById('cartModal');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartTotalElement = document.getElementById('cartTotal');
    this.cartCountElement = document.querySelector('.cart-count');
    this.cartIconElement = document.getElementById('cartToggle');
    
    if (this.cartIconElement) {
      this.cartIconElement.addEventListener('click', () => {
        this.open();
      });
    }
    
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
          <div class="cart-receipt-summary">
            <div class="receipt-item">
              <span>Items:</span>
              <span id="cartItemCount">0</span>
            </div>
            <div class="receipt-item">
              <span>Total:</span>
              <span id="cartTotal">0.00 USD</span>
            </div>
          </div>
          <button id="checkoutBtn" class="cta-button primary" style="width: 100%; margin-top: 1rem;">Checkout</button>
          <button id="clearCart" class="cta-button secondary" style="width: 100%; margin-top: 0.5rem; opacity: 0.7;">Clear Cart</button>
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
        window.location.href = '../checkout.html';
    });

    const clearBtn = document.getElementById('clearCart');
    clearBtn.addEventListener('click', () => {
      if (cart.items.length === 0) return;
      if (confirm('Are you sure you want to clear your cart?')) {
        cart.clear();
      }
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
            <span class="cart-item-price">$${item.price.toFixed(2)}</span>
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

      this.attachEventListeners();
    }

    const currency = cart.items.length > 0 ? cart.items[0].currency : 'USD';
    const total = cart.getTotal();
    const currencySymbol = currency === 'USD' ? '$' : '';

    this.cartTotalElement.textContent = `${currencySymbol}${total.toFixed(2)}`;
    
    const itemCounter = document.getElementById('cartItemCount');
    if (itemCounter) {
      itemCounter.textContent = cart.getItemCount();
    }

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

window.dispatchEvent(new CustomEvent('cartUpdated'));

document.addEventListener('DOMContentLoaded', () => {
  window.cartUI = new CartUI();
  
  const originalSave = cart.save.bind(cart);
  cart.save = function() {
    originalSave();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };
});