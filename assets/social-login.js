(() => {
  document.querySelectorAll('[data-social-provider]').forEach(button => {
    button.addEventListener('click', () => {
      const status = document.getElementById('social-login-status');
      if (status) status.textContent = button.dataset.socialProvider + ' sign-in is not available yet. Please use the available account options.';
    });
  });
})();
