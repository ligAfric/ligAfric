// ============================================
// Navigation and Menu Functions
// ============================================

/**
 * Opens the side menu by setting width
 */
function openMenu() {
  const sideMenu = document.getElementById("sideMenu");
  if (sideMenu) {
    sideMenu.style.width = "350px";
  }
}

/**
 * Closes the side menu
 */
function closeMenu() {
  const sideMenu = document.getElementById("sideMenu");
  if (sideMenu) {
    sideMenu.style.width = "0";
  }
}

/**
 * Displays a specific section in the menu
 * @param {string} id - The ID of the section to display
 */
function showSection(id) {
  const sections = document.getElementsByClassName("menuContent");
  for (let i = 0; i < sections.length; i++) {
    sections[i].style.display = "none";
    sections[i].classList.remove("active");
  }
  const targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.style.display = "block";
    targetSection.classList.add("active");
  }
}

/**
 * Opens a specific page and hides others
 * @param {string} page - The ID of the page to display
 */
function openPage(page) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => {
    p.classList.remove("active");
  });
  
  const targetPage = document.getElementById(page);
  if (targetPage) {
    targetPage.classList.add("active");
  }
  
  // Close menu when navigating
  closeMenu();

  // Load marketplace or cart when opening those pages
  if (page === "marketplace") {
    loadMarketplace();
  } else if (page === "cart") {
    loadCart();
  }
}

/**
 * Returns to the home page
 */
function goHome() {
  openPage("home");
}

// ============================================
// Form Handling Functions
// ============================================

/**
 * Handles farmer registration form submission
 */
function handleFarmerRegistration(e) {
  e.preventDefault();
  
  const formData = new FormData(document.getElementById("farmerForm"));
  const data = Object.fromEntries(formData);
  
  // Validate required fields
  if (!data.fullName || !data.phone) {
    alert("Please fill in all required fields!");
    return;
  }
  
  // Log the data (in production, send to server)
  console.log("Farmer Registration Data:", data);
  
  // Show success message
  showNotification("Farmer Registered Successfully!", "success");
  
  // Reset form
  document.getElementById("farmerForm").reset();
  
  // Redirect after 2 seconds
  setTimeout(() => {
    goHome();
  }, 2000);
}

/**
 * Handles farmer profile update
 */
function handleProfileUpdate(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  console.log("Profile Update Data:", data);
  showNotification("Profile Updated Successfully!", "success");
  
  setTimeout(() => {
    openPage("agriculture");
  }, 2000);
}

/**
 * Handles product addition form
 */
function handleAddProduct(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  console.log("Product Data:", data);
  showNotification("Product Added Successfully!", "success");
  
  e.target.reset();
  
  setTimeout(() => {
    openPage("agriculture");
  }, 2000);
}

// ============================================
// Notification System
// ============================================

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = "info", duration = 3000) {
  // Remove existing notification if any
  const existingNotification = document.getElementById("notification");
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement("div");
  notification.id = "notification";
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 2000;
    animation: slideIn 0.3s ease-in;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  `;
  
  // Set background color based on type
  const colors = {
    success: "#0b7d3b",
    error: "#d32f2f",
    info: "#1976d2"
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Auto-remove after duration
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// ============================================
// Data Management
// ============================================

/**
 * Local storage management for user data
 */
const StorageManager = {
  /**
   * Save user data to local storage
   * @param {string} key - Storage key
   * @param {object} data - Data to store
   */
  save: function(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Storage error:", e);
      return false;
    }
  },
  
  /**
   * Retrieve data from local storage
   * @param {string} key - Storage key
   * @returns {object|null} Retrieved data or null
   */
  get: function(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Storage error:", e);
      return null;
    }
  },
  
  /**
   * Remove data from local storage
   * @param {string} key - Storage key
   */
  remove: function(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error("Storage error:", e);
      return false;
    }
  },
  
  /**
   * Clear all data from local storage
   */
  clear: function() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error("Storage error:", e);
      return false;
    }
  }
};

// ============================================
// Shopping Cart Functions
// ============================================

const Cart = {
  /**
   * Add item to cart
   * @param {object} item - Product item
   */
  addItem: function(item) {
    let cart = StorageManager.get("cart") || [];
    
    // Check if item already exists
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      cart.push(item);
    }
    
    StorageManager.save("cart", cart);
    updateCartCount();
    showNotification("Item added to cart!", "success");
  },
  
  /**
   * Remove item from cart
   * @param {string} itemId - Product ID
   */
  removeItem: function(itemId) {
    let cart = StorageManager.get("cart") || [];
    cart = cart.filter(i => i.id !== itemId);
    StorageManager.save("cart", cart);
    updateCartCount();
    loadCart();
  },
  
  /**
   * Update item quantity in cart
   * @param {string} itemId - Product ID
   * @param {number} quantity - New quantity
   */
  updateQuantity: function(itemId, quantity) {
    let cart = StorageManager.get("cart") || [];
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        StorageManager.save("cart", cart);
        updateCartCount();
        loadCart();
      }
    }
  },
  
  /**
   * Get cart items
   * @returns {array} Cart items
   */
  getItems: function() {
    return StorageManager.get("cart") || [];
  },
  
  /**
   * Clear cart
   */
  clear: function() {
    StorageManager.remove("cart");
    updateCartCount();
  },
  
  /**
   * Get cart total
   * @returns {number} Total price
   */
  getTotal: function() {
    const items = this.getItems();
    return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }
};

// ============================================
// Marketplace Functions
// ============================================

let allProducts = [];
let filteredProducts = [];

/**
 * Initialize and load marketplace
 */
function loadMarketplace() {
  // Load products from the products data
  if (typeof PRODUCTS !== 'undefined') {
    allProducts = PRODUCTS;
    filteredProducts = [...PRODUCTS];
    renderProducts(filteredProducts);
  } else {
    console.warn("Products data not loaded");
  }
}

/**
 * Render products in the grid
 * @param {array} products - Products to render
 */
function renderProducts(products) {
  const productGrid = document.getElementById("productGrid");
  
  if (!productGrid) return;
  
  if (products.length === 0) {
    productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found matching your filters.</p>';
    return;
  }
  
  productGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        ${product.icon || '📦'}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-seller">by ${product.seller}</div>
        <div class="product-rating">⭐ ${product.rating} (${product.reviews} reviews)</div>
        <div class="product-price">KES ${product.price.toLocaleString()}</div>
        <div class="product-quantity">
          <input type="number" id="qty-${product.id}" min="1" value="1" max="100">
        </div>
        <div class="product-actions">
          <button class="add-to-cart-btn" onclick="addProductToCart('${product.id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * Add product to cart from marketplace
 * @param {string} productId - Product ID
 */
function addProductToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  const quantityInput = document.getElementById(`qty-${productId}`);
  const quantity = parseInt(quantityInput.value) || 1;
  
  Cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    seller: product.seller,
    quantity: quantity
  });
  
  // Reset quantity input
  quantityInput.value = 1;
}

/**
 * Filter marketplace products
 */
function filterMarketplace() {
  const category = document.getElementById("categoryFilter").value;
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
  const minRating = parseFloat(document.getElementById("ratingFilter").value) || 0;
  
  filteredProducts = allProducts.filter(product => {
    const categoryMatch = !category || product.category === category;
    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    const ratingMatch = product.rating >= minRating;
    
    return categoryMatch && priceMatch && ratingMatch;
  });
  
  renderProducts(filteredProducts);
}

/**
 * Search marketplace products
 */
function searchMarketplace() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  filteredProducts = allProducts.filter(product => {
    return product.name.toLowerCase().includes(searchTerm) ||
           product.seller.toLowerCase().includes(searchTerm) ||
           product.category.toLowerCase().includes(searchTerm) ||
           product.description.toLowerCase().includes(searchTerm);
  });
  
  renderProducts(filteredProducts);
}

/**
 * Reset all filters
 */
function resetFilters() {
  document.getElementById("categoryFilter").value = "";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("ratingFilter").value = "";
  document.getElementById("searchInput").value = "";
  
  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);
}

/**
 * Update cart count in header
 */
function updateCartCount() {
  const cartItems = Cart.getItems();
  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountElement = document.getElementById("cartCount");
  
  if (cartCountElement) {
    cartCountElement.textContent = totalCount;
  }
}

/**
 * Load and display shopping cart
 */
function loadCart() {
  const cartItems = Cart.getItems();
  const cartTableBody = document.getElementById("cartTableBody");
  const cartSummary = document.getElementById("cartSummary");
  const emptyCart = document.getElementById("emptyCart");
  
  if (!cartTableBody) return;
  
  if (cartItems.length === 0) {
    cartTableBody.innerHTML = "";
    cartSummary.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }
  
  emptyCart.style.display = "none";
  cartSummary.style.display = "block";
  
  cartTableBody.innerHTML = cartItems.map(item => `
    <tr>
      <td>
        <strong>${item.name}</strong><br>
        <small>${item.seller}</small>
      </td>
      <td>KES ${item.price.toLocaleString()}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" 
               onchange="updateCartItemQuantity('${item.id}', this.value)">
      </td>
      <td>KES ${(item.price * item.quantity).toLocaleString()}</td>
      <td>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </td>
    </tr>
  `).join("");
  
  updateCartSummary();
}

/**
 * Update cart item quantity
 * @param {string} itemId - Product ID
 * @param {string} quantity - New quantity
 */
function updateCartItemQuantity(itemId, quantity) {
  Cart.updateQuantity(itemId, parseInt(quantity));
}

/**
 * Remove item from cart
 * @param {string} itemId - Product ID
 */
function removeFromCart(itemId) {
  if (confirm("Remove this item from cart?")) {
    Cart.removeItem(itemId);
  }
}

/**
 * Update cart summary with totals
 */
function updateCartSummary() {
  const cartItems = Cart.getItems();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = cartItems.length > 0 ? 500 : 0;
  const total = subtotal + tax + shipping;
  
  document.getElementById("subtotal").textContent = subtotal.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  document.getElementById("tax").textContent = tax.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  document.getElementById("shipping").textContent = shipping.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  document.getElementById("total").textContent = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Checkout function (placeholder)
 */
function checkout() {
  const cartItems = Cart.getItems();
  if (cartItems.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }
  
  console.log("Checkout - Total Items:", cartItems.length);
  console.log("Cart Items:", cartItems);
  
  showNotification("Proceeding to payment... (Demo)", "info");
  
  setTimeout(() => {
    showNotification("Order placed successfully!", "success");
    Cart.clear();
    loadCart();
    goHome();
  }, 2000);
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize app when page loads
 */
document.addEventListener("DOMContentLoaded", function() {
  updateCartCount();
  
  // Attach form handlers if they exist
  const farmerForm = document.getElementById("farmerForm");
  if (farmerForm) {
    farmerForm.addEventListener("submit", handleFarmerRegistration);
  }
  
  const farmerProfileForm = document.getElementById("farmerProfileForm");
  if (farmerProfileForm) {
    farmerProfileForm.addEventListener("submit", handleProfileUpdate);
  }
});
