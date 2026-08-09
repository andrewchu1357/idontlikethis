class Cart {
  constructor() {
    this.storageKey = 'idlt-cart';
    this.items = JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
    this.updateUI();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    this.updateUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.save();
        this.updateUI();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.save();
    this.updateUI();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  updateUI() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
      countElement.textContent = this.getItemCount();
    }
    
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.display = this.getItemCount() > 0 ? 'block' : 'none';
    }
  }
}

const cart = new Cart();

// Initialize cart UI on load
document.addEventListener('DOMContentLoaded', () => {
  cart.updateUI();
});

// Expose to global scope
window.cart = cart;
