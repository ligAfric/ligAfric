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
// Validation Functions
// ============================================

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Validates national ID format
 * @param {string} id - National ID to validate
 * @returns {boolean} True if valid
 */
function isValidNationalId(id) {
  return id && id.length >= 5;
}

// ============================================
// DOM Ready and Event Listeners
// ============================================

document.addEventListener("DOMContentLoaded", function() {
  // Initialize event listeners
  initializeEventListeners();
  
  // Set up animations
  setupAnimations();
  
  console.log("LigAfric App Initialized");
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
  // Farmer registration form
  const farmerForm = document.getElementById("farmerForm");
  if (farmerForm) {
    farmerForm.addEventListener("submit", handleFarmerRegistration);
  }
  
  // Close menu when clicking outside
  document.addEventListener("click", function(event) {
    const sideMenu = document.getElementById("sideMenu");
    const menuBtn = document.querySelector(".menu-btn");
    
    if (sideMenu && sideMenu.style.width !== "0px" && 
        !sideMenu.contains(event.target) && 
        !menuBtn.contains(event.target)) {
      closeMenu();
    }
  });
  
  // Keyboard support
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/**
 * Setup animations and transitions
 */
function setupAnimations() {
  // Add animation styles if not already in CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    .smooth-transition {
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function for performance optimization
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: KES)
 * @returns {string} Formatted currency
 */
function formatCurrency(amount, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency
  }).format(amount);
}

/**
 * Format date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    openMenu,
    closeMenu,
    showSection,
    openPage,
    goHome,
    showNotification,
    StorageManager,
    Cart,
    isValidEmail,
    isValidPhone,
    isValidNationalId,
    debounce,
    throttle,
    formatCurrency,
    formatDate
  };
}


// ===== Marketplace: Products, Filters, Modals, Cart & Seller Dashboard =====

// Utility: generate simple unique id
function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Local keys
const PRODUCTS_KEY = "ligafric_products";
const ORDERS_KEY = "ligafric_orders";
const SELLER_KEY = "ligafric_seller"; // optional current seller id/name stored

// Seed some sample products if none exist
function seedProducts() {
  let products = StorageManager.get(PRODUCTS_KEY);
  if (!products || !products.length) {
    products = [
      {
        id: uid("p_"),
        name: "Maize",
        category: "Cereals",
        seller: "John Kiptoo",
        price: 4200,
        unit: "Bag",
        quantity: 200,
        county: "Uasin Gishu",
        subCounty: "Kapseret",
        ward: "A",
        harvestDate: new Date().toISOString(),
        description: "Grade 1 dry maize.",
        availability: "Available",
        deliveryOption: "Delivery",
        rating: 4.8,
        photos: []
      },
      {
        id: uid("p_"),
        name: "Fresh Tomatoes",
        category: "Vegetables",
        seller: "Amina Farm",
        price: 80,
        unit: "Kg",
        quantity: 500,
        county: "Nairobi",
        subCounty: "Westlands",
        ward: "B",
        harvestDate: new Date().toISOString(),
        description: "Organic tomatoes.",
        availability: "Available",
        deliveryOption: "Pickup",
        rating: 4.5,
        photos: []
      }
    ];
    StorageManager.save(PRODUCTS_KEY, products);
  }
  return products;
}

// Render products into #productList
function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;
  container.innerHTML = "";
  if (!list || !list.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  const fragment = document.createDocumentFragment();
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card card";
    card.innerHTML = `
      <h3>🌽 ${escapeHtml(p.name)}</h3>
      <p><strong>Seller:</strong> ${escapeHtml(p.seller || "Unknown")}</p>
      <p><strong>Price:</strong> ${formatCurrency(p.price, "KES")} per ${escapeHtml(p.unit)}</p>
      <p><strong>Location:</strong> ${escapeHtml(p.county || "")}</p>
      <p><strong>Quantity:</strong> ${escapeHtml(String(p.quantity))} ${escapeHtml(p.unit)}</p>
      <p class="rating">Rating: ${p.rating ? p.rating.toFixed(1) : "—"}</p>
      <div class="product-actions">
        <button class="main-btn view-btn" data-id="${p.id}">View Details</button>
        <button class="main-btn chat-btn" data-seller="${encodeURIComponent(p.seller || "")}" data-phone="">Chat Seller</button>
        <button class="main-btn buy-btn" data-id="${p.id}">Buy Now</button>
      </div>
    `;
    fragment.appendChild(card);
  });
  container.appendChild(fragment);

  // Attach event handlers
  container.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => openProductModal(btn.dataset.id));
  });
  container.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      addToCart(id, 1);
      openCart();
    });
  });
  container.querySelectorAll(".chat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // placeholder: open tel: or chat
      const seller = decodeURIComponent(btn.dataset.seller || "");
      showNotification(`Open chat with ${seller} (implement chat/phone)`, "info");
    });
  });
}

// Basic HTML-escape helper
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Apply filters and search
function applyFiltersAndRender() {
  const all = StorageManager.get(PRODUCTS_KEY) || [];
  const q = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const cat = document.getElementById("categoryFilter")?.value || "";
  const county = document.getElementById("countyFilter")?.value || "";
  let filtered = all.filter(p => {
    if (cat && p.category !== cat) return false;
    if (county && p.county !== county) return false;
    if (q) {
      const hay = `${p.name} ${p.seller} ${p.description} ${p.county}`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  });
  renderProducts(filtered);
}

// Product modal
function openProductModal(id) {
  const products = StorageManager.get(PRODUCTS_KEY) || [];
  const p = products.find(x => x.id === id);
  if (!p) return showNotification("Product not found", "error");
  const body = document.getElementById("productModalBody");
  body.innerHTML = `
    <h3>${escapeHtml(p.name)}</h3>
    <p><strong>Seller:</strong> ${escapeHtml(p.seller)}</p>
    <p><strong>Price:</strong> ${formatCurrency(p.price, "KES")} per ${escapeHtml(p.unit)}</p>
    <p><strong>Available:</strong> ${escapeHtml(String(p.quantity))} ${escapeHtml(p.unit)}</p>
    <p><strong>Location:</strong> ${escapeHtml(p.county || "")}</p>
    <p>${escapeHtml(p.description || "")}</p>
    <div style="margin-top:10px">
      <label>Quantity</label>
      <input id="modalQty" type="number" min="1" max="${p.quantity}" value="1" style="width:80px;padding:6px;margin-right:8px">
      <button class="main-btn" id="modalAddToCart">Add to Cart</button>
      <button class="main-btn" id="modalBuyNow">Buy Now</button>
    </div>
  `;
  document.getElementById("productModal").style.display = "block";

  document.getElementById("modalAddToCart").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("modalQty").value || "1", 10);
    addToCart(p.id, qty);
    document.getElementById("productModal").style.display = "none";
    openCart();
  });
  document.getElementById("modalBuyNow").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("modalQty").value || "1", 10);
    addToCart(p.id, qty);
    document.getElementById("productModal").style.display = "none";
    openPage("checkout");
  });
}

// Add to cart integration with existing Cart object
function addToCart(productId, qty) {
  const products = StorageManager.get(PRODUCTS_KEY) || [];
  const p = products.find(x => x.id === productId);
  if (!p) return showNotification("Product not available", "error");
  const item = {
    id: productId,
    name: p.name,
    price: Number(p.price),
    quantity: Number(qty || 1),
    unit: p.unit,
    seller: p.seller
  };
  Cart.addItem(item);
  updateCartCount();
  renderCartModal();
}

// Update cart count UI
function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  const totalQty = Cart.getItems().reduce((s, it) => s + (it.quantity || 0), 0);
  if (countEl) countEl.textContent = totalQty;
}

// Cart modal controls
function openCart() {
  document.getElementById("cartModal").style.display = "block";
  renderCartModal();
}
function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

// Render cart items & summary
function renderCartModal() {
  const list = Cart.getItems();
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  container.innerHTML = "";
  if (!list.length) container.innerHTML = "<p>Your cart is empty</p>";
  list.forEach(it => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div><strong>${escapeHtml(it.name)}</strong> (${escapeHtml(it.unit)})</div>
      <div>Qty: <input type="number" data-id="${it.id}" class="cart-qty" value="${it.quantity}" min="1" style="width:70px"></div>
      <div>Price: ${formatCurrency(it.price, "KES")}</div>
      <div><button class="main-btn remove-cart" data-id="${it.id}">Remove</button></div>
    `;
    container.appendChild(row);
  });
  summary.innerHTML = `<p><strong>Total:</strong> ${formatCurrency(Cart.getTotal(), "KES")}</p>`;

  // listeners
  container.querySelectorAll(".remove-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      Cart.removeItem(btn.dataset.id);
      renderCartModal();
      updateCartCount();
    });
  });
  container.querySelectorAll(".cart-qty").forEach(inp => {
    inp.addEventListener("change", () => {
      const id = inp.dataset.id;
      const val = Math.max(1, parseInt(inp.value || "1", 10));
      const items = Cart.getItems();
      const item = items.find(x => x.id === id);
      if (item) {
        item.quantity = val;
        StorageManager.save("cart", items);
        renderCartModal();
        updateCartCount();
      }
    });
  });
}

// Checkout form handler
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(checkoutForm));
    const cartItems = Cart.getItems();
    if (!cartItems.length) {
      return showNotification("Cart is empty", "error");
    }
    // minimal validation
    if (!data.name || !data.phone || !data.address) {
      return showNotification("Please fill required details", "error");
    }
    const orders = StorageManager.get(ORDERS_KEY) || [];
    const order = {
      id: uid("o_"),
      createdAt: new Date().toISOString(),
      buyer: data.name,
      phone: data.phone,
      address: data.address,
      deliveryOption: data.deliveryOption,
      paymentMethod: data.paymentMethod,
      items: cartItems,
      total: Cart.getTotal(),
      status: "Pending"
    };
    orders.push(order);
    StorageManager.save(ORDERS_KEY, orders);
    Cart.clear();
    updateCartCount();
    showNotification("Order placed successfully!", "success");
    // optionally save order for seller view
    setTimeout(() => {
      goHome();
    }, 1200);
  });
}

// Seller dashboard: add product form
const addProductForm = document.getElementById("addProductForm");
if (addProductForm) {
  addProductForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(addProductForm));
    const products = StorageManager.get(PRODUCTS_KEY) || [];
    const newp = {
      id: uid("p_"),
      name: data.name || "Untitled",
      category: data.category || "",
      seller: data.seller || "Unknown",
      price: Number(data.price || 0),
      unit: data.unit || "Unit",
      quantity: Number(data.quantity || 0),
      county: data.county || "",
      subCounty: data.subCounty || "",
      ward: data.ward || "",
      harvestDate: data.harvestDate || new Date().toISOString(),
      description: data.description || "",
      availability: data.availability || "Available",
      deliveryOption: data.deliveryOption || "Pickup",
      rating: 0,
      photos: []
    };
    products.unshift(newp);
    StorageManager.save(PRODUCTS_KEY, products);
    showNotification("Product added", "success");
    addProductForm.reset();
    renderMyProducts();
    applyFiltersAndRender();
  });
}

// Render seller's products in My Products
function renderMyProducts() {
  const container = document.getElementById("myProducts");
  if (!container) return;
  const myName = (document.querySelector("#addProductForm [name='seller']")?.value || "").trim();
  const products = StorageManager.get(PRODUCTS_KEY) || [];
  const mine = myName ? products.filter(p => p.seller === myName) : products;
  container.innerHTML = "";
  if (!mine.length) container.innerHTML = "<p>No products yet.</p>";
  mine.forEach(p => {
    const el = document.createElement("div");
    el.className = "my-product-row card";
    el.innerHTML = `<strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.quantity + " " + p.unit)} <br/>
      ${formatCurrency(p.price, "KES")} — ${escapeHtml(p.county || "")}
      <div style="margin-top:8px">
        <button class="main-btn edit-prod" data-id="${p.id}">Edit</button>
        <button class="main-btn delete-prod" data-id="${p.id}">Delete</button>
      </div>`;
    container.appendChild(el);
  });
  container.querySelectorAll(".delete-prod").forEach(btn => {
    btn.addEventListener("click", () => {
      let all = StorageManager.get(PRODUCTS_KEY) || [];
      all = all.filter(x => x.id !== btn.dataset.id);
      StorageManager.save(PRODUCTS_KEY, all);
      renderMyProducts();
      applyFiltersAndRender();
    });
  });
}

// Modal close handlers
document.addEventListener("click", (e) => {
  if (e.target.matches("#productModal .modal-close") || e.target.id === "productModalClose") {
    document.getElementById("productModal").style.display = "none";
  }
  if (e.target.matches("#cartModal .modal-close") || e.target.id === "cartModalClose") {
    closeCart();
  }
});

// Search & filter listeners
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", debounce(applyFiltersAndRender, 300));
}
const categoryFilter = document.getElementById("categoryFilter");
if (categoryFilter) categoryFilter.addEventListener("change", applyFiltersAndRender);
const countyFilter = document.getElementById("countyFilter");
if (countyFilter) countyFilter.addEventListener("change", applyFiltersAndRender);
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "";
  if (countyFilter) countyFilter.value = "";
  applyFiltersAndRender();
});

// Cart button
const cartBtn = document.getElementById("cartBtn");
if (cartBtn) cartBtn.addEventListener("click", openCart);

// Checkout button in cart modal
const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
  closeCart();
  openPage("checkout");
});

// Populate county filter dynamically from products
function populateCountyFilter() {
  const sel = document.getElementById("countyFilter");
  if (!sel) return;
  const products = StorageManager.get(PRODUCTS_KEY) || [];
  const counties = Array.from(new Set(products.map(p => p.county).filter(Boolean))).sort();
  sel.innerHTML = `<option value="">All Counties</option>` + counties.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
}

// Initialize marketplace
function initMarketplace() {
  seedProducts();
  populateCountyFilter();
  applyFiltersAndRender();
  updateCartCount();
  renderMyProducts();
}

// Run init on DOM ready
document.addEventListener("DOMContentLoaded", initMarketplace);
