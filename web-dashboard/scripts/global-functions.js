// Global functions for onclick handlers
// This file is loaded as a regular script (not module) to make functions globally available

// Password toggle function
function togglePassword(fieldId) {
  const passField = document.getElementById(fieldId);
  if (passField) {
    passField.type = passField.type === 'password' ? 'text' : 'password';
    
    const toggleBtn = passField.parentElement.querySelector('.toggle-password svg');
    if (toggleBtn) {
      if (passField.type === 'password') {
        // Show eye icon (password hidden)
        toggleBtn.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      } else {
        // Show eye-off icon (password visible)
        toggleBtn.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      }
    }
  }
}

// Placeholder functions - will be replaced by module functions when they load
function register() {
  alert('Please wait for the page to fully load...');
}

function googleLogin() {
  alert('Please wait for the page to fully load...');
}