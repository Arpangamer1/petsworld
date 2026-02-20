/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
        navMenu.classList.remove('active');
    }
});

/* ============================================
   CONTACT FORM SUBMISSION
   ============================================ */

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !phone || !message) {
        showAlert('Please fill in all fields!', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address!', 'error');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        showAlert('Please enter a valid 10-digit phone number!', 'error');
        return;
    }

    // Here, in a real application, you would send this data to a server
    // For now, we'll show a success message
    showAlert('Thank you for your message! We will contact you soon.', 'success');
    contactForm.reset();

    // Example: Send to server (uncomment and modify as needed)
    /*
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, message })
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message, 'success');
        contactForm.reset();
    })
    .catch(error => {
        showAlert('Error sending message. Please try again.', 'error');
        console.error('Error:', error);
    });
    */
});

/* ============================================
   ALERT NOTIFICATION SYSTEM
   ============================================ */

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                &times;
            </button>
        </div>
    `;

    // Add styles if not already in CSS
    if (!document.querySelector('style[data-alerts]')) {
        const style = document.createElement('style');
        style.setAttribute('data-alerts', 'true');
        style.textContent = `
            .alert {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .alert-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                gap: 15px;
            }

            .alert-content p {
                margin: 0;
                color: white;
                font-weight: 500;
            }

            .alert-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .alert-success {
                background-color: #27ae60;
            }

            .alert-error {
                background-color: #e74c3c;
            }

            .alert-info {
                background-color: #3498db;
            }

            .alert-warning {
                background-color: #f39c12;
            }

            @media (max-width: 600px) {
                .alert {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add alert to page
    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .info-card, .about-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

/* ============================================
   NAVIGATION HIGHLIGHT ON SCROLL
   ============================================ */

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '#333';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#e74c3c';
        }
    });
});

/* ============================================
   SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
   ============================================ */

if (!('scrollBehavior' in document.documentElement.style)) {
    function smoothScroll(target) {
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }

        if (!target) return;

        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);

            window.scrollTo(0, startPosition + distance * easeInOutQuad(percentage));

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        });
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScroll(link.getAttribute('href'));
        });
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Get current year for footer (optional)
function updateYear() {
    const yearElement = document.querySelector('.footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateYear();
    console.log('Pets World website loaded successfully!');
});

/* ============================================
   PHONE NUMBER FORMATTING
   ============================================ */

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
}

/* ============================================
   LAZY LOADING FOR IMAGES
   ============================================ */

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/* ============================================
   ACCORDION FOR FAQ (IF NEEDED IN FUTURE)
   ============================================ */

function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const content = header.nextElementSibling;

            // Close all other accordions
            document.querySelectorAll('.accordion').forEach(item => {
                if (item !== accordion) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = '0';
                }
            });

            // Toggle current accordion
            accordion.classList.toggle('active');
            if (accordion.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
}

// Call when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
} else {
    initAccordion();
}
