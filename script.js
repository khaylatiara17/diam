// Performance optimization helpers
const performance = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait); 
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Resource loader with retry and timeout
class ResourceLoader {
    static async loadScript(src, retries = 3, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;

            const timeoutId = setTimeout(() => {
                script.remove();
                if (retries > 0) {
                    this.loadScript(src, retries - 1, timeout)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(new Error(`Script load timeout: ${src}`));
                }
            }, timeout);

            script.onload = () => {
                clearTimeout(timeoutId);
                resolve();
            };

            script.onerror = () => {
                script.remove();
                clearTimeout(timeoutId);
                if (retries > 0) {
                    this.loadScript(src, retries - 1, timeout)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(new Error(`Script load failed: ${src}`));
                }
            };

            document.head.appendChild(script);
        });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with performance options
    AOS.init({
        once: true,
        duration: 800,
        delay: 100,
        offset: 100,
        disable: window.innerWidth < 768
    });

    // Initialize all components
    initSwipers();
    initScrollToTop();
    initMobileNav();
    initScrollspy();
    initSmoothScroll();
    initDropdowns();
    initActiveLinks();
    initProgressiveLoading();
    initResponsiveImages();
    handleImageErrors();

    // Add intersection observer for lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // Add error boundary
    window.addEventListener('error', (e) => {
        console.error('Global error:', e);
        showToast('An error occurred. Please try again.', 'error');
    });

    // Add performance marks
    performance.mark('app-init-start');
    // ...existing code...
    performance.mark('app-init-end');
    performance.measure('app-initialization', 'app-init-start', 'app-init-end');
});

// Progressive image loading for hero section
function initProgressiveLoading() {
    const heroImages = document.querySelectorAll('.hero .swiper-slide img');
    
    heroImages.forEach(img => {
        const fullRes = img.src;
        const lowRes = fullRes.replace(/\.(jpg|png)$/, '-low.$1');
        
        // Create low-res placeholder
        img.src = lowRes;
        img.classList.add('blur');
        
        // Load high-res image
        const highResImage = new Image();
        highResImage.src = fullRes;
        highResImage.onload = () => {
            img.src = fullRes;
            img.classList.remove('blur');
        };
    });
}

// Initialize responsive images
function initResponsiveImages() {
    const images = document.querySelectorAll('img[data-srcset]');
    
    images.forEach(img => {
        const srcset = img.dataset.srcset;
        if (srcset) {
            img.srcset = srcset;
        }
    });
}

// Enhanced image error handling
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    const fallbackImage = 'aset/placeholder.jpg';
    
    images.forEach(img => {
        img.onerror = () => {
            img.src = fallbackImage;
            img.onerror = null; // Prevent infinite loop
        };
    });
}

// Swiper initializations with performance optimizations
function initSwipers() {
    // Hero Slider - load only if element exists
    const heroElement = document.querySelector(".hero");
    if (heroElement) {
        new Swiper(heroElement, {
            pagination: {
                el: ".swiper-pagination",
                dynamicBullets: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            speed: 800,
            preloadImages: false,
            lazy: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }

    // Initialize other sliders only when they come into view
    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initSlider(entry.target);
                sliderObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe all slider containers
    document.querySelectorAll('.swiper:not(.hero)').forEach(slider => {
        sliderObserver.observe(slider);
    });
}

// Initialize specific slider based on its container
function initSlider(container) {
    if (container.classList.contains('little-achievement-swiper')) {
        new Swiper(container, {
            slidesPerView: 'auto',
            spaceBetween: 30,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            }
        });
    } else if (container.classList.contains('showcase')) {
        new Swiper(container, {
            slidesPerView: 2,
            spaceBetween: 30,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                568: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                992: {
                    slidesPerView: 5,
                    spaceBetween: 40
                }
            },
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            loop: true
        });
    }
}

// Optimized scroll-to-top with debouncing
function initScrollToTop() {
    const scrollTop = document.querySelector('.back-to-top');
    
    if (scrollTop) {
        const toggleBacktotop = performance.debounce(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (window.scrollY > 100) {
                scrollTop.classList.add('active');
                scrollTop.style.background = `conic-gradient(var(--primary-color) ${scrollPercent}%, #fff ${scrollPercent}%)`;
            } else {
                scrollTop.classList.remove('active');
            }
        }, 100);

        window.addEventListener('scroll', toggleBacktotop);
        
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Enhanced mobile navigation
function initMobileNav() {
    const header = document.getElementById('header');
    const navbar = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');
    let isOpen = false;

    toggler?.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            header.classList.add('mobile-open');
        } else {
            document.body.style.overflow = '';
            header.classList.remove('mobile-open');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !navbar.contains(e.target) && !toggler.contains(e.target)) {
            toggler.click();
        }
    });

    // Handle back button and menu closing
    window.addEventListener('popstate', () => {
        if (isOpen) {
            toggler.click();
        }
    });
}

// Scrollspy implementation
function initScrollspy() {
    const sections = document.querySelectorAll('section[data-view]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('data-view');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll implementation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = document.querySelector('#header').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler && toggler.classList.contains('collapsed')) {
                    toggler.click();
                }
            }
        });
    });
}

// Toast notification system
class Toast {
    constructor(options = {}) {
        this.position = options.position || 'top-right';
        this.duration = options.duration || 3000;
        this.containerSelector = '.toast-container';
        this.createContainer();
    }

    createContainer() {
        if (!document.querySelector(this.containerSelector)) {
            const container = document.createElement('div');
            container.className = `toast-container ${this.position}`;
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate slideIn`;
        toast.textContent = message;
        
        const container = document.querySelector(this.containerSelector);
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, this.duration);
    }
}

// Initialize toast system
const toast = new Toast();

// Enhanced form validation with better user feedback
function validateForm(formElement) {
    if (!formElement) return false;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    let firstError = null;

    inputs.forEach(input => {
        removeError(input);

        const value = input.value.trim();
        if (!value) {
            isValid = false;
            showError(input, 'Field ini wajib diisi');
            firstError = firstError || input;
        } else {
            switch (input.type) {
                case 'email':
                    if (!emailPattern.test(value)) {
                        isValid = false;
                        showError(input, 'Format email tidak valid');
                        firstError = firstError || input;
                    }
                    break;
                case 'tel':
                    if (!phonePattern.test(value)) {
                        isValid = false;
                        showError(input, 'Format nomor telepon tidak valid');
                        firstError = firstError || input;
                    }
                    break;
                case 'file':
                    const allowedTypes = input.accept ? input.accept.split(',') : [];
                    const maxSize = input.dataset.maxSize || 5 * 1024 * 1024; // 5MB default
                    
                    if (input.files.length > 0) {
                        const file = input.files[0];
                        if (allowedTypes.length && !allowedTypes.some(type => file.type.match(type))) {
                            isValid = false;
                            showError(input, 'Format file tidak didukung');
                            firstError = firstError || input;
                        } else if (file.size > maxSize) {
                            isValid = false;
                            showError(input, 'Ukuran file terlalu besar');
                            firstError = firstError || input;
                        }
                    }
                    break;
            }
        }

        // Real-time validation
        input.addEventListener('input', performance.debounce(() => {
            removeError(input);
            validateSingleInput(input);
        }, 300));
    });

    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }

    return isValid;
}

function validateSingleInput(input) {
    const value = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

    if (input.required && !value) {
        showError(input, 'Field ini wajib diisi');
        return false;
    }

    if (value) {
        switch (input.type) {
            case 'email':
                if (!emailPattern.test(value)) {
                    showError(input, 'Format email tidak valid');
                    return false;
                }
                break;
            case 'tel':
                if (!phonePattern.test(value)) {
                    showError(input, 'Format nomor telepon tidak valid');
                    return false;
                }
                break;
        }
    }

    return true;
}

// Initialize all forms
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                // Show loading state
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';

                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    toast.show('Form berhasil dikirim!', 'success');
                    form.reset();
                }, 1000);
            }
        });
    });
});

// Form validation with enhanced error handling
function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    const parent = input.parentElement;
    const existing = parent.querySelector('.error-message');
    if (existing) {
        existing.remove();
    }
    
    parent.appendChild(errorDiv);
    input.classList.add('error');
    
    // Animate error message
    errorDiv.style.opacity = '0';
    requestAnimationFrame(() => {
        errorDiv.style.transition = 'opacity 0.3s ease';
        errorDiv.style.opacity = '1';
    });
}

function removeError(input) {
    const parent = input.parentElement;
    const errorDiv = parent.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 300);
    }
    input.classList.remove('error');
}

// Enhance dropdown functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-submenu');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeout;

        if (window.innerWidth >= 992) { // Desktop behavior
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.querySelector('.dropdown-menu')?.classList.remove('show');
                    }
                });
                menu?.classList.add('show');
            });

            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    menu?.classList.remove('show');
                }, 200);
            });
        } else { // Mobile behavior
            link?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.querySelector('.dropdown-menu')?.classList.remove('show');
                    }
                });
                
                menu?.classList.toggle('show');
            });
        }
    });
}

// Active link handling
function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);
}

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Initialize Swiper for hero section
const heroSwiper = new Swiper('.hero-swiper', {
    speed: 600,
    parallax: true,
    lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Defer non-critical images
    const deferImages = document.querySelectorAll('img[data-defer]');
    requestIdleCallback(() => {
        deferImages.forEach(img => {
            img.src = img.dataset.defer;
        });
    });

    // Initialize lightbox for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
        lightGallery(document.getElementById('gallery'), {
            selector: '.gallery-item',
            plugins: [lgZoom, lgThumbnail],
            speed: 500
        });
    }
});

// Form validation and submission
const validatedForms = document.querySelectorAll('form[data-validate]');
validatedForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (form.checkValidity()) {
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Mengirim...';

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showAlert('success', 'Pesan berhasil dikirim!');
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showAlert('error', 'Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } else {
            form.classList.add('was-validated');
        }
    });
});

// Helper function for showing alerts
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('main').insertAdjacentElement('afterbegin', alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 3000);
}

// Theme preference detection and application
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Service worker registration for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// Progressive image loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('blur');
                
                img.onload = () => {
                    img.classList.remove('blur');
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                };
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Back to top button
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form validation
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            e.preventDefault();
            showToast('Please fill in all required fields', 'error');
        }
    });
});

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
            container.remove();
        }
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container top-right';
    document.body.appendChild(container);
    return container;
}