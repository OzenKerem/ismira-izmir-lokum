/**
 * Liderx - Web Site Script
 * Focuses on UI/UX interactions, mobile responsive menus, and secure redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initWhatsAppLinks();
    initScrollAnimations();
    initLanguageSelector();
});

/**
 * Adds styling to header when user scrolls down
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollThreshold = 50;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Run on init and listen to scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('nav');
    
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Prevent body scroll when menu is active
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Securely formats and validates WhatsApp links
 * Ensures rel="noopener noreferrer" is appended to all dynamic external targets.
 */
function initWhatsAppLinks() {
    const whatsappElements = document.querySelectorAll('[data-wa-product]');
    const basePhone = '905326080090'; // Cleaned phone number format

    whatsappElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productName = el.getAttribute('data-wa-product');
            const customMessage = el.getAttribute('data-wa-message') || '';
            
            let message = '';
            if (customMessage) {
                message = encodeURIComponent(customMessage);
            } else if (productName) {
                message = encodeURIComponent(`Merhaba Liderx, "${productName}" lokum ürününüz hakkında bilgi almak ve sipariş vermek istiyorum.`);
            } else {
                message = encodeURIComponent('Merhaba Liderx, lokum çeşitleriniz hakkında bilgi almak ve sipariş vermek istiyorum.');
            }

            const secureUrl = `https://wa.me/${basePhone}?text=${message}`;
            
            // Open securely
            const newWindow = window.open(secureUrl, '_blank', 'noopener,noreferrer');
            if (newWindow) {
                newWindow.opener = null; // Extra security layer against window.opener vulnerabilities
            }
        });
    });
}

/**
 * Subtle scroll reveal animations for premium UI/UX feel
 */
function initScrollAnimations() {
    // We can use IntersectionObserver to add a "visible" class to section elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    // Track feature cards and product cards
    const elementsToAnimate = document.querySelectorAll('.feature-card, .product-card, .section-header');
    
    // Add initial styling dynamically so page is fully visible even if JS is disabled
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        animateOnScroll.observe(el);
    });

    // CSS injection for animate-in class
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initializes language selector and connects to Google Translate
 * Automatically translates the entire page dynamically without manual translation texts.
 */
function initLanguageSelector() {
    const langSelector = document.getElementById('lang-selector');
    const currentLang = document.getElementById('current-lang');
    const langItems = document.querySelectorAll('.lang-dropdown li');

    if (!langSelector || !currentLang) return;

    // Toggle dropdown
    currentLang.addEventListener('click', (e) => {
        e.stopPropagation();
        langSelector.classList.toggle('active');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!langSelector.contains(e.target)) {
            langSelector.classList.remove('active');
        }
    });

    // Update UI elements (flag image & text)
    function updateLanguageUI(langCode) {
        const activeItem = document.querySelector(`.lang-dropdown li[data-lang="${langCode}"]`);
        if (activeItem) {
            const langName = activeItem.getAttribute('data-lang-name');
            const flagSrc = activeItem.querySelector('.flag-icon').src;
            currentLang.innerHTML = `<img src="${flagSrc}" width="20" alt="${langName}" class="flag-icon notranslate" translate="no"> <span class="lang-code notranslate" translate="no">${langName}</span>`;
        }
    }

    // Set or clear Google Translate cookie
    function setTranslateCookies(langCode) {
        if (langCode === 'tr') {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            if (window.location.hostname && !window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
                document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            }
            localStorage.removeItem('selected_language');
        } else {
            const val = `/tr/${langCode}`;
            document.cookie = `googtrans=${val}; path=/;`;
            if (window.location.hostname && !window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
                document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname};`;
            }
            localStorage.setItem('selected_language', langCode);
        }
    }

    // Trigger translation via Google Translate widget
    function triggerTranslation(langCode) {
        const targetValue = (langCode === 'tr') ? '' : langCode;
        let attempts = 0;
        const maxAttempts = 50; // Poll for up to 5 seconds

        const checkCombo = () => {
            attempts++;
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                if (select.value !== targetValue) {
                    select.value = targetValue;
                    select.dispatchEvent(new Event('change'));
                }
            } else if (attempts < maxAttempts) {
                setTimeout(checkCombo, 100);
            } else {
                // If the widget wasn't found (e.g. script blocked or slow), reload as fallback
                if (langCode === 'tr') {
                    location.reload();
                }
            }
        };

        checkCombo();
    }

    // Handle language selection click
    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const langCode = item.getAttribute('data-lang');
            langSelector.classList.remove('active');

            updateLanguageUI(langCode);
            setTranslateCookies(langCode);
            triggerTranslation(langCode);

            if (langCode === 'tr') {
                // To cleanly restore Turkish if Google Translate widget doesn't revert
                setTimeout(() => {
                    const select = document.querySelector('.goog-te-combo');
                    if (select && select.value !== '') {
                        select.value = '';
                        select.dispatchEvent(new Event('change'));
                    }
                }, 300);
            }
        });
    });

    // Check for saved language on page load
    const savedLang = localStorage.getItem('selected_language') || (() => {
        const match = document.cookie.match(/googtrans=\/tr\/([a-z]{2})/i);
        return match ? match[1].toLowerCase() : null;
    })();

    if (savedLang && savedLang !== 'tr') {
        updateLanguageUI(savedLang);
        triggerTranslation(savedLang);
    }
}

// Preloader Initialization
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1300);
    }
};

window.addEventListener('load', hidePreloader);

// Fallback in case local 'load' gets stuck due to missing files (like placeholder images)
setTimeout(hidePreloader, 2000);

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.target !== '_blank' && link.hostname === window.location.hostname) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        if (link.hash && window.location.pathname === link.pathname) return;
        if (link.href.includes('javascript:')) return;
        
        e.preventDefault();
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.remove('fade-out');
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        } else {
            window.location.href = link.href;
        }
    }
});
