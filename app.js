// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skills animation
    animateSkills();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize form submission handler
    initFormHandler();
    
    // Initialize scroll animations
    initScrollAnimations();

    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Initialize dynamic typewriter effect
    initTypewriter();
    
    // Initialize 3D tilt effect on hero image
    initTilt();
    
    // Initialize 3D tilt effect on skill cards
    initCardTilt();
    
    // Initialize View More buttons
    initViewMore('.skills-grid', '.skill-card', 'view-more-skills', 4);
    initViewMore('.projects-grid', '.project-card', 'view-more-projects', 3);
    
    // Initialize Project Modal
    initProjectModal();
    
    // Initialize Certificates Slider and PDF Modal
    initCertSlider();
    initPdfModal();
});

// Typewriter Effect
function initTypewriter() {
    const textElement = document.querySelector('.typewriter-text');
    if (!textElement) return;
    
    const words = ['Backend Developer', 'AI Engineer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Wait at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Wait before typing next word
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}


// Skills Animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const hamburger = document.querySelector('.hamburger');
                const navLinks = document.querySelector('.nav-links');
                
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Form Handler
function initFormHandler() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                const submitBtn = this.querySelector('button');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                emailjs.sendForm('service_xjowin9', 'template_5y4uie6', this)
                    .then(() => {
                        Toastify({
                            text: "Message sent successfully!",
                            duration: 3000,
                            close: true,
                            gravity: "top",
                            position: "right",
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, (error) => {
                        console.error('FAILED...', error);
                        Toastify({
                            text: "Failed to send message. Please try again.",
                            duration: 3000,
                            close: true,
                            gravity: "top",
                            position: "right",
                            style: {
                                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                            }
                        }).showToast();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-progress, .project-card, .about-content, .hero-content, .education-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // If it's an education item, animate its progress bar
                if (entry.target.classList.contains('education-item')) {
                    const progressBar = entry.target.querySelector('.progress-fill');
                    if (progressBar) {
                        const width = progressBar.getAttribute('data-width');
                        progressBar.style.width = width + '%';
                    }
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 3D Tilt Effect for Hero Image
function initTilt() {
    const container = document.querySelector('.hero-image');
    const img = document.querySelector('.profile-image');
    
    if (!container || !img) return;
    
    container.addEventListener('mousemove', (e) => {
        // Only run on desktop/larger screens to prevent mobile jank
        if (window.innerWidth < 768) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation degrees (max 15 degrees)
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;
        
        img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        img.style.transition = 'transform 0.1s ease';
    });
    
    container.addEventListener('mouseleave', () => {
        img.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        img.style.transition = 'transform 0.5s ease';
    });
}

// 3D Tilt Effect for Skill Cards (Inner Content Only)
function initCardTilt() {
    const cards = document.querySelectorAll('.skill-card');
    
    if (cards.length === 0) return;
    
    cards.forEach(card => {
        const tiltContent = card.querySelector('.tilt-content');
        if (!tiltContent) return;
        
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust max degrees based on your preference
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            tiltContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            tiltContent.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            tiltContent.style.transform = 'rotateX(0deg) rotateY(0deg)';
            tiltContent.style.transition = 'transform 0.5s ease';
        });
    });
}

// View More Button Logic
function initViewMore(gridSelector, itemSelector, btnId, limit) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;
    
    const items = grid.querySelectorAll(itemSelector);
    const btn = document.getElementById(btnId);
    
    // Only show button if we have more items than the limit
    if (!btn || items.length <= limit) return;
    
    // Hide extra items
    items.forEach((item, index) => {
        if (index >= limit) {
            item.style.display = 'none';
        }
    });
    
    // Show the button
    btn.parentElement.style.display = 'block';
    
    btn.addEventListener('click', () => {
        const isShowingAll = btn.textContent === 'Show Less';
        
        items.forEach((item, index) => {
            if (index >= limit) {
                // If hiding, set to 'none', else empty string to restore original display (e.g., flex/block)
                item.style.display = isShowingAll ? 'none' : '';
            }
        });
        
        btn.textContent = isShowingAll ? 'View More' : 'Show Less';
        
        if (isShowingAll) {
            // Scroll back up to grid start so user doesn't lose their place
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Project Modal Logic
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const cards = document.querySelectorAll('.project-card');
    
    if (!modal) return;
    
    // Modal elements to populate
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTech = document.getElementById('modal-tech');
    
    // Open modal on card click
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract data from clicked card
            const imgEl = card.querySelector('.project-image img');
            const titleEl = card.querySelector('.project-title');
            const descEl = card.querySelector('.project-description');
            const techPills = card.querySelectorAll('.project-tech span');
            
            // Populate modal
            if (imgEl) modalImage.src = imgEl.src;
            if (titleEl) modalTitle.textContent = titleEl.textContent;
            if (descEl) modalDescription.textContent = descEl.textContent;
            
            // Populate tech pills
            modalTech.innerHTML = '';
            techPills.forEach(pill => {
                const span = document.createElement('span');
                span.className = 'skill-pill';
                span.textContent = pill.textContent;
                modalTech.appendChild(span);
            });

            // Update modal action buttons from data attributes
            const liveLink = card.getAttribute('data-live');
            const codeLink = card.getAttribute('data-code');
            const modalViewLive = document.getElementById('modal-view-live');
            const modalViewCode = document.getElementById('modal-view-code');

            if (modalViewLive) {
                if (liveLink) {
                    modalViewLive.href = liveLink;
                    modalViewLive.style.display = '';
                } else {
                    modalViewLive.style.display = 'none';
                }
            }
            if (modalViewCode) {
                if (codeLink) {
                    modalViewCode.href = codeLink;
                    modalViewCode.style.display = '';
                } else {
                    modalViewCode.style.display = 'none';
                }
            }
            
            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    
    // Close modal functions
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore background scrolling
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Certificate Slider Logic
function initCertSlider() {
    const slider = document.getElementById('cert-slider');
    const slides = document.querySelectorAll('.cert-slide');
    const prevBtn = document.getElementById('cert-prev');
    const nextBtn = document.getElementById('cert-next');
    const dotsContainer = document.getElementById('cert-dots');
    
    if (!slider || slides.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');
    
    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        resetAutoSlide();
    }
    
    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }
    
    // Auto-slide every 6 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event listeners
    if(nextBtn) nextBtn.addEventListener('click', nextSlide);
    if(prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    startAutoSlide();
}

// PDF Viewer Modal Logic
function initPdfModal() {
    const modal = document.getElementById('pdf-modal');
    const closeBtn = document.getElementById('close-pdf');
    const iframe = document.getElementById('pdf-viewer');
    const downloadBtn = document.getElementById('pdf-download-btn');
    const modalTitle = document.getElementById('pdf-modal-title');
    const certSlides = document.querySelectorAll('.cert-slide');
    
    if (!modal || !iframe) return;
    
    certSlides.forEach(slide => {
        const card = slide.querySelector('.cert-card');
        card.addEventListener('click', () => {
            const pdfUrl = slide.getAttribute('data-pdf');
            const title = slide.getAttribute('data-title');
            
            if (pdfUrl && pdfUrl !== '#') {
                iframe.src = pdfUrl;
                if (downloadBtn) downloadBtn.href = pdfUrl;
                if (modalTitle) modalTitle.textContent = title || 'Certificate';
                
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => { iframe.src = ''; }, 300); // Clear iframe memory after animation
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}
