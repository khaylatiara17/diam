// Security configuration
const security = {
    CSP_HEADERS: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
        'style-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"]
    },

    ALLOWED_ORIGINS: [
        'https://bacotzgroup.com',
        'https://api.bacotzgroup.com'
    ],

    setupSecurityHeaders() {
        // ...existing code...
    },

    validateOrigin(origin) {
        return this.ALLOWED_ORIGINS.includes(origin);
    },

    sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }
};

// Add Content Security Policy
document.addEventListener('DOMContentLoaded', () => {
    security.setupSecurityHeaders();
});

// Secure fetch wrapper
window.secureFetch = async (url, options = {}) => {
    if (!security.validateOrigin(new URL(url).origin)) {
        throw new Error('Invalid origin');
    }

    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
            ...options.headers,
            'X-Requested-With': 'XMLHttpRequest'
        }
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return response;
};
