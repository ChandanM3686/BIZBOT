document.addEventListener('DOMContentLoaded', function() {
    // File Upload Handling
    const fileInput = document.getElementById('file');
    const dropArea = document.getElementById('dropArea');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.querySelector('.file-name');
    const fileSize = document.querySelector('.file-size');
    const removeFileBtn = document.getElementById('removeFile');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Highlight drop area when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
      dropArea.classList.remove('dragover');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length) {
        fileInput.files = files;
        updateFilePreview(files[0]);
      }
    }
    
    // Handle file input change
    fileInput.addEventListener('change', function() {
      if (this.files.length) {
        updateFilePreview(this.files[0]);
      }
    });
    
    // Update file preview
    function updateFilePreview(file) {
      const validTypes = ['.pdf', '.docx', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        alert('Please upload a valid file type (PDF, DOCX, CSV)');
        fileInput.value = '';
        return;
      }
      
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      filePreview.style.display = 'flex';
      dropArea.style.display = 'none';
    }
    
    // Format file size
    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Remove file
    removeFileBtn.addEventListener('click', function() {
      fileInput.value = '';
      filePreview.style.display = 'none';
      dropArea.style.display = 'block';
    });
    
    // Form validation
    const setupForm = document.querySelector('.setup-form');
    
    if (setupForm) {
      setupForm.addEventListener('submit', function(e) {
        const apiKeyInput = document.getElementById('api_key');
        let isValid = true;
        
        // API Key validation (simple check for non-empty and minimum length)
        if (apiKeyInput && (apiKeyInput.value.trim() === '' || apiKeyInput.value.length < 10)) {
          isValid = false;
          showError(apiKeyInput, 'Please enter a valid Gemini API key');
        } else if (apiKeyInput) {
          removeError(apiKeyInput);
        }
        
        // File validation
        if (fileInput && fileInput.files.length === 0) {
          isValid = false;
          showError(fileInput, 'Please upload a document');
        } else if (fileInput) {
          removeError(fileInput);
        }
        
        if (!isValid) {
          e.preventDefault();
        }
      });
    }
    
    // Helper functions for validation
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
      
      if (input.closest('.input-wrapper')) {
        input.closest('.input-wrapper').style.borderColor = '#ef4444';
      } else if (input === fileInput) {
        dropArea.style.borderColor = '#ef4444';
      }
    }
    
    function removeError(input) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.error-message');
      
      if (errorElement) {
        errorElement.remove();
      }
      
      if (input.closest('.input-wrapper')) {
        input.closest('.input-wrapper').style.borderColor = '';
      } else if (input === fileInput) {
        dropArea.style.borderColor = '';
      }
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('input:not([type="file"]), select');
    
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