// common.js – shared utilities

function initServerToasts() {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toasts = container.querySelectorAll('.toast:not(.show)');
    toasts.forEach((toast, index) => {
        setTimeout(() => {
            toast.classList.add('show');
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => dismissToast(toast));
            }
            const delay = parseInt(toast.dataset.delay) || 6000;
            if (delay > 0) {
                setTimeout(() => { dismissToast(toast); }, delay);
            }
        }, 200 + index * 150);
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServerToasts);
} else {
    initServerToasts();
}

// ----- TOAST SYSTEM -----
const toastContainer = document.getElementById('toastContainer');

function showToast(type, title, message, duration = 4200) {
    if (!toastContainer) return;
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
    <div class="toast-icon ${type}"><i class="${icons[type] || icons.info}"></i></div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" aria-label="Dismiss notification">&times;</button>
  `;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));
    if (duration > 0) setTimeout(() => dismissToast(toast), duration);
    return toast;
}

function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
}

// ----- PASSWORD TOGGLE -----
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.toggle-vis').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.closest('.input-group').querySelector('input');
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            this.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    });
});

// ----- PASSWORD STRENGTH -----
function evaluateStrength(pw) {
    if (!pw) return { score: 0, label: 'Password must be at least 8 characters' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    const normalized = Math.min(score, 4);
    const labels = ['', 'Weak', 'Medium', 'Strong', 'Strong'];
    const classes = ['', 'weak', 'medium', 'strong', 'strong'];
    return { score: normalized, label: labels[normalized] || '', cls: classes[normalized] || '' };
}


// ----- Auto‑show toasts rendered by Django (server‑side) -----
function initServerToasts() {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toasts = container.querySelectorAll('.toast:not(.show)');
    toasts.forEach((toast, index) => {
        // Show with a small stagger
        setTimeout(() => {
            toast.classList.add('show');

            // Attach close button handler
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => dismissToast(toast));
            }

            // Auto‑dismiss after delay (from data-delay or default 4200ms)
            const delay = parseInt(toast.dataset.delay) || 4200;
            if (delay > 0) {
                setTimeout(() => {
                    dismissToast(toast);
                }, delay);
            }
        }, 200 + index * 150);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', initServerToasts);