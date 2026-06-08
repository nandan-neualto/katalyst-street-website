let toastTimeout = null;

export function showToast(message, isSuccess = true, duration = 3500) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  const messageEl = toast.querySelector('.toast-message');
  const iconEl = toast.querySelector('.toast-icon');

  if (messageEl) {
    messageEl.textContent = message;
  }

  if (iconEl) {
    iconEl.textContent = isSuccess ? '✓' : '⚠';
  }

  // Clear any active timers
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toast.classList.remove('hidden');

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}
