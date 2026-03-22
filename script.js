// ===== Theme Management =====
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme or system preference
function getTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return prefersDark.matches ? 'dark' : 'light';
}

// Apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
applyTheme(getTheme());

// Toggle theme on button click
themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
});

// Listen for system theme changes
prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// ===== Mobile Menu =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Smooth Scroll (for browsers that don't support CSS scroll-behavior) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.about-card, .workflow-step, .bento-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add visible class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const current = window.pageYOffset;

    if (current > 50) {
        navbar.style.background = 'var(--glass-bg)';
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.background = 'var(--glass-bg)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = current;
});

// ===== Typing Effect for Code Window (Optional Enhancement) =====
function typeCode() {
    const codeContent = document.querySelector('.code-content code');
    if (!codeContent) return;

    const originalHTML = codeContent.innerHTML;
    const text = codeContent.textContent;

    codeContent.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            codeContent.textContent += text.charAt(i);
            i++;
            setTimeout(type, 10);
        } else {
            codeContent.innerHTML = originalHTML; // Restore with syntax highlighting
        }
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

// Uncomment to enable typing effect:
// typeCode();

// ===== Performance: Debounce Scroll Events =====
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== Easter Egg: Console Message =====
console.log('%c Hello, curious developer! 👋 ', 'background: #3b82f6; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c This portfolio was crafted with modern web technologies. Check out the code! ', 'color: #64748b; font-size: 12px;');
