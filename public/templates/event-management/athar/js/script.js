/**
 * Athar's Event Management Portfolio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initScrollAnimation();
    initPortfolioFilter();
    initCounters();
    initBackToTop();
    initContactForm();
    initTypingEffect();
});

/**
 * Navbar functionality
 */
function initNavbar() {
    const navbar = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Handle scroll behavior for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
}

/**
 * Scroll animations for elements
 */
function initScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-up');
    
    // Initial check for elements already in view
    checkFade();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkFade);
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                element.classList.add('appear');
            }
        });
    }
}

/**
 * Portfolio filtering functionality
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Counter animation for stats
 */
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    
    // Start counting when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                
                let count = 0;
                const updateCounter = () => {
                    const increment = countTo / 50; // Speed of counting
                    
                    if (count < countTo) {
                        count += increment;
                        target.innerText = Math.floor(count);
                        setTimeout(updateCounter, 40);
                    } else {
                        target.innerText = countTo;
                    }
                };
                
                updateCounter();
                observer.unobserve(target); // Stop observing once animation starts
            }
        });
    }, { threshold: 0.5 });
    
    // Observe each counter element
    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Simple validation (can be expanded)
            if (!formDataObj.name || !formDataObj.email || !formDataObj.message) {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual API call)
            showFormMessage('Sending your message...', 'success');
            
            // Simulate API response
            setTimeout(() => {
                showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

/**
 * Typing effect for hero section
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 150);
    }
}

// Add testimonial slider if there are multiple testimonials
function initTestimonialSlider() {
    // This would be implemented if more testimonials are added
    // Would use a library like Swiper or a custom implementation
} 