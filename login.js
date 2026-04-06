
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeLoginTabs();
  initializeLoginForm();
  generateParticles();
  handleKeyboardShortcuts();
});

// ========================================
// LOGIN TABS (LIFTED TAB SWITCHING)
// ========================================

function initializeLoginTabs() {
  const tabs = document.querySelectorAll('.login-tab');
  const loginCards = document.querySelectorAll('.login-card');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();

      // Remove active class from all tabs and cards
      tabs.forEach(t => t.classList.remove('active'));
      loginCards.forEach(card => card.style.display = 'none');

      // Add active class to clicked tab
      this.classList.add('active');

      // Show corresponding login card
      if (loginCards[index]) {
        loginCards[index].style.display = 'block';
        // Add entrance animation
        loginCards[index].style.animation = 'none';
        setTimeout(() => {
          loginCards[index].style.animation = 'cardEntrance 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 10);
      }

      // Save active tab to localStorage
      localStorage.setItem('activeLoginTab', index);
    });

    // Set initial active tab
    if (index === 0) {
      tab.classList.add('active');
    }
  });

  // Restore previous active tab
  const savedTabIndex = localStorage.getItem('activeLoginTab');
  if (savedTabIndex !== null && tabs[savedTabIndex]) {
    tabs[savedTabIndex].click();
  }
}

// ========================================
// LOGIN FORM HANDLING
// ========================================

function initializeLoginForm() {
  const loginForms = document.querySelectorAll('form');

  loginForms.forEach((form, index) => {
    const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name*="email" i]');
    const passwordInput = form.querySelector('input[type="password"]');
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.login-btn');

    // Form validation on submit
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLoginSubmit(form, index);
    });

    // Real-time validation
    if (emailInput) {
      emailInput.addEventListener('blur', () => validateEmail(emailInput));
      emailInput.addEventListener('input', () => clearFieldError(emailInput));
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', () => clearFieldError(passwordInput));
    }

    // Enter key to submit
    form.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (submitBtn) submitBtn.click();
      }
    });
  });
}

function validateEmail(input) {
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    addFieldError(input, 'Email is required');
    return false;
  }

  if (!emailRegex.test(email)) {
    addFieldError(input, 'Please enter a valid email address');
    return false;
  }

  clearFieldError(input);
  return true;
}

function addFieldError(input, message) {
  input.classList.add('is-invalid');
  
  // Remove existing error message
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) existingError.remove();

  // Add error message
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.style.cssText = `
    color: var(--accent-red);
    font-size: 11px;
    margin-top: 4px;
    font-weight: 600;
  `;
  errorEl.textContent = message;
  input.parentElement.appendChild(errorEl);
}

function clearFieldError(input) {
  input.classList.remove('is-invalid');
  const errorEl = input.parentElement.querySelector('.error-message');
  if (errorEl) errorEl.remove();
}

// ========================================
// LOGIN SUBMISSION
// ========================================

function handleLoginSubmit(form, tabIndex) {
  // Validate all required fields
  const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name*="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const codeInput = form.querySelector('input[name*="code" i]');

  let isValid = true;

  // Validate email
  if (emailInput) {
    if (!validateEmail(emailInput)) {
      isValid = false;
    }
  }

  // Validate password
  if (passwordInput && !passwordInput.value.trim()) {
    addFieldError(passwordInput, 'Password is required');
    isValid = false;
  } else if (passwordInput && passwordInput.value.length < 6) {
    addFieldError(passwordInput, 'Password must be at least 6 characters');
    isValid = false;
  }

  // Validate access code if present
  if (codeInput && !codeInput.value.trim()) {
    addFieldError(codeInput, 'Access code is required');
    isValid = false;
  }

  if (!isValid) {
    playErrorAnimation();
    return;
  }

  // Submit form
  submitLogin(form, tabIndex);
}

function submitLogin(form, tabIndex) {
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.login-btn');
  const originalText = submitBtn.textContent;

  // Get role from tab or form
  const tabs = document.querySelectorAll('.login-tab');
  const roles = ['Manager', 'Staff', 'Catering', 'Auditor'];
  const selectedRole = roles[tabIndex] || 'User';

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

  // Simulate login delay
  setTimeout(() => {
    const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name*="email"]');
    const userEmail = emailInput ? emailInput.value : 'user';

    // Store login info
    localStorage.setItem('userName', userEmail.split('@')[0]);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userRole', selectedRole);

    // Redirect based on role
    const redirectUrl = getRedirectUrl(tabIndex);

    // Show success animation
    showSuccessAnimation(() => {
      window.location.href = redirectUrl;
    });

    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 1500);
}

function getRedirectUrl(tabIndex) {
  const routes = {
    0: 'manager-portal.html',
    1: 'staff-portal.html',
    2: 'catering-portal.html',
    3: 'viewer-portal.html'
  };

  return routes[tabIndex] || 'manager-portal.html';
}

// ========================================
// ANIMATIONS
// ========================================

function playErrorAnimation() {
  const form = document.querySelector('form');
  if (!form) return;

  form.style.animation = 'none';
  setTimeout(() => {
    form.style.animation = 'shake 0.4s ease';
  }, 10);

  setTimeout(() => {
    form.style.animation = 'none';
  }, 400);
}

function showSuccessAnimation(callback) {
  const loginCard = document.querySelector('.login-card[style*="display: block"], .login-card:not([style*="display: none"])');
  if (!loginCard) {
    callback();
    return;
  }

  // Show checkmark
  const checkmark = document.createElement('div');
  checkmark.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    font-size: 80px;
    color: var(--accent-green);
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  checkmark.innerHTML = '<i class="fa-solid fa-check-circle"></i>';
  document.body.appendChild(checkmark);

  // Fade out
  setTimeout(() => {
    checkmark.style.animation = 'fadeOut 0.1s ease';
    setTimeout(() => {
      checkmark.remove();
      callback();
    }, 300);
  }, 1000);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

function handleKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt + 1, 2, 3, 4 to switch tabs
    if (e.altKey) {
      const tabs = document.querySelectorAll('.login-tab');
      if (e.key === '1' && tabs[0]) tabs[0].click();
      if (e.key === '2' && tabs[1]) tabs[1].click();
      if (e.key === '3' && tabs[2]) tabs[2].click();
      if (e.key === '4' && tabs[3]) tabs[3].click();
    }
  });
}

// ========================================
// PARTICLE GENERATION
// ======================================== */

function generateParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const randomDelay = Math.random() * 5 + 's';
    const randomDuration = Math.random() * 8 + 10 + 's';
    const randomLeft = Math.random() * 100 + '%';

    particle.style.cssText = `
      left: ${randomLeft};
      animation-delay: ${randomDelay};
      animation-duration: ${randomDuration};
    `;

    particlesContainer.appendChild(particle);
  }
}

// ========================================
// REMEMBER ME FUNCTIONALITY
// ========================================

function handleRememberMe() {
  const rememberCheckboxes = document.querySelectorAll('input[type="checkbox"][name*="remember" i]');

  rememberCheckboxes.forEach(checkbox => {
    // Load saved email if remember me was checked
    const savedEmail = localStorage.getItem('rememberedEmail');
    const emailInput = checkbox.closest('form').querySelector('input[type="email"]');

    if (savedEmail && emailInput) {
      emailInput.value = savedEmail;
      checkbox.checked = true;
    }

    // Save email when remember me is checked
    checkbox.addEventListener('change', function() {
      const emailInput = this.closest('form').querySelector('input[type="email"]');
      if (emailInput) {
        if (this.checked) {
          localStorage.setItem('rememberedEmail', emailInput.value);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      }
    });
  });
}

// ========================================
// ANIMATIONS KEYFRAMES
// ======================================== */

const animationStyles = `
<style>
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.is-invalid {
  border-color: var(--accent-red) !important;
  background: rgba(239, 68, 68, 0.05) !important;
}

.error-message {
  color: var(--accent-red);
  font-size: 11px;
  margin-top: 4px;
  font-weight: 600;
  display: block;
}
</style>
`;

// ========================================
// EXPORT FUNCTIONS
// ======================================== */

window.submitLogin = submitLogin;
window.validateEmail = validateEmail;
window.handleRememberMe = handleRememberMe;
