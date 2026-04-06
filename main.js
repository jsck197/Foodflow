/* ========================================
   INVENTRACK PRO - MAIN JAVASCRIPT
   Common Functionality & Interactions
   ======================================== */

// ========================================
// INITIALIZATION
// ========================================

// Initialize Theme (Dark/Light Mode)
function initializeTheme() {
  const savedTheme = localStorage.getItem('inventrack_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    updateThemeToggleIcon(savedTheme);
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('inventrack_theme', newTheme);
  
  updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    if (theme === 'dark') {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeToggle.title = 'Switch to Light Mode';
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeToggle.title = 'Switch to Dark Mode';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeSidebar();
  initializeCurrentDate();
  initializeFormValidation();
  initializeTooltips();
  initializeAnimations();
  loadUserName();
});

// ========================================
// SIDEBAR FUNCTIONALITY
// ========================================

function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainWrapper = document.getElementById('mainWrapper');

  if (!sidebarToggle) return;

  sidebarToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
  });

  // Check saved state
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed && sidebar) {
    sidebar.classList.add('collapsed');
  }

  // Close sidebar on small screens when a nav item is clicked
  const navItems = document.querySelectorAll('.nav-item a');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('active');
      }
    });
  });

  // Toggle sidebar visibility on small screens
  if (window.innerWidth < 1024) {
    const toggles = document.querySelectorAll('[data-toggle-sidebar]');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
      });
    });
  }
}

// ========================================
// CURRENT DATE
// ========================================

function initializeCurrentDate() {
  const dateElements = document.querySelectorAll('#currentDate');
  
  if (dateElements.length === 0) return;

  function updateDate() {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', options);
    
    dateElements.forEach(element => {
      element.textContent = dateString;
    });
  }

  updateDate();
  setInterval(updateDate, 60000); // Update every minute
}

// ========================================
// FORM VALIDATION
// ========================================

function initializeFormValidation() {
  const forms = document.querySelectorAll('form, .checkout-form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Real-time validation feedback
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        // Clear error on input
        if (this.classList.contains('is-invalid')) {
          this.classList.remove('is-invalid');
        }
      });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
      // Validation can be added here
      console.log('Form submitted');
    });
  });
}

function validateField(field) {
  if (field.hasAttribute('required') && !field.value.trim()) {
    field.classList.add('is-invalid');
    return false;
  }

  if (field.type === 'email' && field.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      field.classList.add('is-invalid');
      return false;
    }
  }

  field.classList.remove('is-invalid');
  return true;
}

// ========================================
// TOOLTIPS
// ========================================

function initializeTooltips() {
  const tooltipElements = document.querySelectorAll('[title]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      // Custom tooltip can be created here
      if (this.title) {
        // Using browser's native title attribute
      }
    });
  });
}

// ========================================
// ANIMATIONS
// ========================================

function initializeAnimations() {
  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(element => {
    observer.observe(element);
  });
}

// ========================================
// USER NAME & PERSONALIZATION
// ========================================

function loadUserName() {
  // Get user name from localStorage or URL params
  const params = new URLSearchParams(window.location.search);
  const userName = params.get('user') || localStorage.getItem('userName') || 'User';
  
  const userNameElements = document.querySelectorAll('#userName');
  const welcomeNameElements = document.querySelectorAll('#welcomeName');
  
  userNameElements.forEach(el => {
    el.textContent = userName;
  });

  welcomeNameElements.forEach(el => {
    const role = el.getAttribute('data-role') || 'User';
    el.textContent = `Welcome, ${userName}`;
  });

  localStorage.setItem('userName', userName);
}

// ========================================
// CUSTOM CHECKOUT FORM HANDLING
// ========================================

function submitCheckout(button) {
  const form = button.closest('form') || button.closest('.checkout-form');
  if (!form) return;

  // Validate form
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (!isValid) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  // Disable button and show loading state
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

  // Simulate submission
  setTimeout(() => {
    showNotification('Checkout logged successfully!', 'success');
    form.reset();
    button.disabled = false;
    button.textContent = originalText;
  }, 1500);
}

// ========================================
// NOTIFICATIONS/TOASTS
// ========================================

function showNotification(message, type = 'info') {
  const notificationContainer = document.querySelector('.notification-container') || createNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type} animate-slide-down`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">
        ${getNotificationIcon(type)}
      </span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  `;

  notificationContainer.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('animate-slide-down');
    notification.classList.add('animate-slide-up');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.className = 'notification-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
  `;
  document.body.appendChild(container);
  return container;
}

function getNotificationIcon(type) {
  const icons = {
    success: '<i class="fa-solid fa-check-circle"></i>',
    error: '<i class="fa-solid fa-exclamation-circle"></i>',
    warning: '<i class="fa-solid fa-warning"></i>',
    info: '<i class="fa-solid fa-info-circle"></i>'
  };
  return icons[type] || icons.info;
}

// Style notifications in CSS when included
const notificationStyles = `
<style>
.notification {
  background: linear-gradient(135deg, var(--navy-850) 0%, var(--navy-800) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.notification-success {
  border-left: 3px solid var(--accent-green);
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.08), transparent);
}

.notification-error {
  border-left: 3px solid var(--accent-red);
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.08), transparent);
}

.notification-warning {
  border-left: 3px solid var(--accent-amber);
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.08), transparent);
}

.notification-info {
  border-left: 3px solid var(--accent-cyan);
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.08), transparent);
}

.notification-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.notification-success .notification-icon { color: var(--accent-green); }
.notification-error .notification-icon { color: var(--accent-red); }
.notification-warning .notification-icon { color: var(--accent-amber); }
.notification-info .notification-icon { color: var(--accent-cyan); }

.notification-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: auto;
  flex-shrink: 0;
  transition: var(--transition);
}

.notification-close:hover {
  color: var(--text-primary);
}
</style>
`;

// ========================================
// TABLE ENHANCEMENTS
// ========================================

function initializeDataTables() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    // Add row hover effects
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(30, 74, 158, 0.15)';
      });

      row.addEventListener('mouseleave', function() {
        this.style.background = '';
      });
    });
  });
}

// ========================================
// MODAL/DIALOG HANDLING
// ========================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.classList.add('animate-fade-in');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on background click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// ========================================
// RESPONSIVE UTILITIES
// ========================================

function getScreenSize() {
  if (window.innerWidth < 480) return 'xs';
  if (window.innerWidth < 768) return 'sm';
  if (window.innerWidth < 1024) return 'md';
  if (window.innerWidth < 1280) return 'lg';
  return 'xl';
}

// Track screen size changes
window.addEventListener('resize', debounce(function() {
  const size = getScreenSize();
  document.documentElement.setAttribute('data-screen', size);
}, 250));

// ========================================
// UTILITY FUNCTIONS
// ========================================

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

// Smooth scroll to element
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  }).catch(() => {
    showNotification('Failed to copy', 'error');
  });
}

// ========================================
// STORAGE UTILITIES
// ========================================

const Storage = {
  set: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  get: function(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },

  remove: function(key) {
    localStorage.removeItem(key);
  },

  clear: function() {
    localStorage.clear();
  }
};

// ========================================
// THEME SWITCHING (Optional)
// ========================================

function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.setAttribute('data-theme', themeName);
}

function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

// Load saved theme on startup
window.addEventListener('load', function() {
  const theme = getTheme();
  setTheme(theme);
});

// Export functions for use in HTML onclick handlers
window.submitCheckout = submitCheckout;
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.scrollToElement = scrollToElement;
