document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const eyeIcon = this.querySelector('.eye-icon');
        if (type === 'text') {
          eyeIcon.innerHTML = `
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <line x1="2" x2="22" y1="2" y2="22"></line>
          `;
        } else {
          eyeIcon.innerHTML = `
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          `;
        }
      });
    }
    
    // Form validation
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');
        let isValid = true;
        
        // Simple email validation
        if (emailInput && !isValidEmail(emailInput.value)) {
          isValid = false;
          showError(emailInput, 'Please enter a valid email address');
        } else if (emailInput) {
          removeError(emailInput);
        }
        
        // Password validation (at least 6 characters)
        if (passwordInput && passwordInput.value.length < 6) {
          isValid = false;
          showError(passwordInput, 'Password must be at least 6 characters');
        } else if (passwordInput) {
          removeError(passwordInput);
        }
        
        if (!isValid) {
          e.preventDefault();
        }
      });
    }
    
    // Helper functions for validation
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    function showError(input, message) {
      const formGroup = input.closest('.form-group');
      let errorElement = formGroup.querySelector('.error-message');
      
      if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        formGroup.appendChild(errorElement);
      }
      
      errorElement.textContent = message;
      input.style.borderColor = '#ef4444';
    }
    
    function removeError(input) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.error-message');
      
      if (errorElement) {
        errorElement.remove();
      }
      
      input.style.borderColor = '';
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        const wrapper = this.closest('.input-wrapper');
        if (wrapper) {
          wrapper.style.boxShadow = '0 0 0 2px var(--primary-light)';
        }
      });
      
      input.addEventListener('blur', function() {
        const wrapper = this.closest('.input-wrapper');
        if (wrapper) {
          wrapper.style.boxShadow = '';
        }
      });
    });
  });