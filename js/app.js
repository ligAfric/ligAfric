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
