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
  
    // Password strength meter
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
  
    if (passwordInput && strengthSegments.length) {
      passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Reset all segments
        strengthSegments.forEach(segment => {
          segment.className = 'strength-segment';
        });
        
        // Update segments based on strength
        if (password.length > 0) {
          if (strength === 'weak') {
            strengthSegments[0].classList.add('weak');
            strengthText.textContent = 'Weak password';
          } else if (strength === 'medium') {
            strengthSegments[0].classList.add('medium');
            strengthSegments[1].classList.add('medium');
            strengthText.textContent = 'Medium password';
          } else if (strength === 'strong') {
            strengthSegments[0].classList.add('strong');
            strengthSegments[1].classList.add('strong');
            strengthSegments[2].classList.add('strong');
            strengthText.textContent = 'Strong password';
          } else if (strength === 'very-strong') {
            strengthSegments.forEach(segment => {
              segment.classList.add('strong');
            });
            strengthText.textContent = 'Very strong password';
          }
        } else {
          strengthText.textContent = 'Password strength';
        }
      });
    }
  
    // Check password strength
    function checkPasswordStrength(password) {
      if (password.length === 0) {
        return '';
      }
      
      // Calculate password strength
      let strength = 0;
      
      // Length check
      if (password.length >= 8) {
        strength += 1;
      }
      
      // Lowercase letters check
      if (/[a-z]/.test(password)) {
        strength += 1;
      }
      
      // Uppercase letters check
      if (/[A-Z]/.test(password)) {
        strength += 1;
      }
      
      // Numbers check
      if (/[0-9]/.test(password)) {
        strength += 1;
      }
      
      // Special characters check
      if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
      }
      
      // Return strength level
      if (strength <= 2) {
        return 'weak';
      } else if (strength <= 3) {
        return 'medium';
      } else if (strength <= 4) {
        return 'strong';
      } else {
        return 'very-strong';
      }
    }
  
    // Form validation
    const signupForm = document.querySelector('.signup-form');
  
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#Gmail');
        const passwordInput = document.querySelector('#password');
        const termsCheckbox = document.querySelector('#terms');
        let isValid = true;
        
        // Name validation
        if (nameInput && nameInput.value.trim() === '') {
          isValid = false;
          showError(nameInput, 'Please enter your name');
        } else if (nameInput) {
          removeError(nameInput);
        }
        
        // Email validation
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
        
        // Terms checkbox validation
        if (termsCheckbox && !termsCheckbox.checked) {
          isValid = false;
          showError(termsCheckbox, 'You must agree to the Terms of Service');
        } else if (termsCheckbox) {
          removeError(termsCheckbox);
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
      
      if (input.type !== 'checkbox') {
        if (input.closest('.input-wrapper')) {
          input.closest('.input-wrapper').style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '#ef4444';
        }
      }
    }
  
    function removeError(input) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.error-message');
      
      if (errorElement) {
        errorElement.remove();
      }
      
      if (input.type !== 'checkbox') {
        if (input.closest('.input-wrapper')) {
          input.closest('.input-wrapper').style.borderColor = '';
        } else {
          input.style.borderColor = '';
        }
      }
    }
  
    // Input focus effects
    const inputs = document.querySelectorAll('input:not([type="checkbox"])');
  
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