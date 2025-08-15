document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    // Función global para mostrar secciones
    window.showSection = function(targetSection) {
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active class to corresponding nav link
        const navLink = document.querySelector(`[href="#${targetSection}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }
        
        // Show corresponding section
        const section = document.getElementById(targetSection);
        if (section) {
            section.classList.add('active');
            // Scroll to top of section
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    // Función global para scroll suave a secciones
    window.scrollToSection = function(targetSection) {
        // Forzar scroll y activación con retraso para asegurar el DOM
        const section = document.getElementById(targetSection);
        if (section) {
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            section.classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const navLink = document.querySelector(`[href="#${targetSection}"]`);
            if (navLink) navLink.classList.add('active');
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };
    
    // Event listeners para navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
    
    // Banner slider functionality
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index] && dots[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-slide every 5 seconds
    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Buscar en todas las tarjetas de productos/servicios
            const allCards = document.querySelectorAll('.pricing-card, .category-card, .song-card');
            
            allCards.forEach(card => {
                const title = card.querySelector('h3');
                const description = card.querySelector('p, .plan-features');
                
                if (title && description) {
                    const titleText = title.textContent.toLowerCase();
                    const descText = description.textContent.toLowerCase();
                    
                    if (titleText.includes(searchTerm) || descText.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = searchTerm === '' ? 'block' : 'none';
                    }
                }
            });
        });
    }
    
    // Category filter for catalog
    const categoryBtns = document.querySelectorAll('.category-btn');
    const songCards = document.querySelectorAll('.song-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            songCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Catalog search functionality
    const catalogSearchInput = document.getElementById('searchInput');
    if (catalogSearchInput) {
        catalogSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            songCards.forEach(card => {
                const songTitle = card.querySelector('h3').textContent.toLowerCase();
                const artist = card.querySelector('p').textContent.toLowerCase();
                const genre = card.querySelector('.genre').textContent.toLowerCase();
                
                if (songTitle.includes(searchTerm) || artist.includes(searchTerm) || genre.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Add to queue functionality for songs
    const addToQueueBtns = document.querySelectorAll('.add-to-queue');
    addToQueueBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const songCard = this.closest('.song-card');
            const songTitle = songCard.querySelector('h3').textContent;
            const artist = songCard.querySelector('p').textContent;
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.style.background = '#00b894';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i>';
                this.style.background = '';
            }, 2000);
            
            showNotification(`"${songTitle}" por ${artist} agregada a la cola`);
        });
    });
    
    // Reservation buttons functionality
    const reserveButtons = document.querySelectorAll('.btn-reserve');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = parseInt(cartCount.textContent) || 0;
    
    reserveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const pricingCard = this.closest('.pricing-card');
            const planTitle = pricingCard.querySelector('h3').textContent;
            const planPrice = pricingCard.querySelector('.price').textContent;
            
            // Update cart count
            cartItems++;
            cartCount.textContent = cartItems;
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = '¡Agregado al Carrito!';
            this.style.background = '#00b894';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
                this.disabled = false;
            }, 3000);
            
            // Show notification
            showNotification(`${planTitle} (${planPrice}) agregado al carrito`);
            
            // Animate cart icon
            const cartIcon = document.querySelector('.cart');
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // CTA buttons functionality
    // Solo agregar visual feedback al botón 'Reservar Ahora' del banner
    const reservarBtn = document.querySelector('.banner-slide.active .cta-button');
    if (reservarBtn && reservarBtn.textContent.trim() === 'Reservar Ahora') {
        reservarBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isVisible = answer.style.display === 'block';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('p');
                    const otherQuestion = otherItem.querySelector('h4');
                    if (otherAnswer && otherQuestion) {
                        otherAnswer.style.display = 'none';
                        otherQuestion.style.color = '';
                    }
                });
                
                // Toggle current item
                if (!isVisible) {
                    answer.style.display = 'block';
                    question.style.color = 'var(--primary-red)';
                }
            });
        }
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const submitBtn = newsletterForm.querySelector('button');
        const emailInput = newsletterForm.querySelector('input');
        
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                showNotification('¡Suscripción exitosa! Gracias por unirte a Fuji Sounds.');
                emailInput.value = '';
                
                // Visual feedback
                this.textContent = '¡Suscrito!';
                this.style.background = '#00b894';
                setTimeout(() => {
                    this.textContent = 'Suscribirse';
                    this.style.background = '';
                }, 3000);
            } else {
                showNotification('Por favor ingresa un email válido.', 'error');
            }
        });
    }
    
    // Language selector functionality
    const languageSelect = document.querySelector('.language-selector select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            showNotification(`Idioma cambiado a: ${selectedLang === 'ES' ? 'Español' : selectedLang === 'JP' ? '日本語' : 'English'}`);
            // Aquí podrías implementar la lógica de cambio de idioma
        });
    }
    
    // Gallery hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                showSection(targetId);
            }
        });
    });
    
    // Parallax effect for banner
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const banners = document.querySelectorAll('.banner-slide');
        
        banners.forEach(banner => {
            const speed = 0.5;
            banner.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Utility functions
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#00b894'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Initialize tooltips for pricing features
    const featureItems = document.querySelectorAll('.plan-features li');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const text = this.textContent.trim();
            if (text.length > 50) {
                this.title = text;
            }
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Mobile menu toggle (for responsive design)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Category card click functionality
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // This functionality is handled by the onclick attributes in HTML
            // but we can add visual feedback here
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Carrito funcional para canciones, reservas y menús
    let cart = [];

    function updateCartCount() {
        const count = cart.length;
        document.querySelector('.cart-count').textContent = count;
    }

    function showCart() {
        let modal = document.getElementById('cartModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'cartModal';
            modal.style.position = 'fixed';
            modal.style.top = '50px';
            modal.style.right = '30px';
            modal.style.background = '#fff';
            modal.style.border = '2px solid #e60012';
            modal.style.borderRadius = '12px';
            modal.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
            modal.style.zIndex = '9999';
            modal.style.width = '320px';
            modal.style.maxHeight = '70vh';
            modal.style.overflowY = 'auto';
            modal.style.padding = '20px';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `<h3 style='color:#e60012'>Carrito</h3><ul id='cartList' style='padding-left:0;list-style:none;margin-bottom:20px;'></ul><button id='closeCart' style='background:#e60012;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;'>Cerrar</button>`;
        const list = modal.querySelector('#cartList');
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '10px';
            li.innerHTML = `<span>${item.type}: <b>${item.name}</b></span> <button data-idx='${idx}' style='background:#cc0010;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;'>Eliminar</button>`;
            list.appendChild(li);
        });
        modal.querySelector('#closeCart').onclick = () => modal.remove();
        list.querySelectorAll('button').forEach(btn => {
            btn.onclick = function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                cart.splice(idx, 1);
                updateCartCount();
                showCart();
            };
        });
    }

    function addToCart(type, name) {
        cart.push({type, name});
        updateCartCount();
    }

    function setupSongButtons() {
        document.querySelectorAll('.add-to-queue').forEach(btn => {
            btn.onclick = function() {
                const card = btn.closest('.song-card');
                const name = card.querySelector('h3')?.textContent || 'Canción';
                addToCart('Canción', name);
            };
        });
    }

    function setupReserveButtons() {
        document.querySelectorAll('.btn-reserve').forEach(btn => {
            btn.onclick = function() {
                const card = btn.closest('.pricing-card');
                const name = card.querySelector('h3')?.textContent || btn.textContent.trim();
                let type = 'Reserva';
                if (btn.textContent.toLowerCase().includes('ordenar')) type = 'Menú';
                addToCart(type, name);
            };
        });
    }

    function setupCartIcon() {
        const cartIcon = document.querySelector('.header-link.cart');
        if (cartIcon) {
            cartIcon.onclick = function(e) {
                e.preventDefault();
                showCart();
            };
        }
    }

    function setupBannerReserveButton() {
        // No modificar el evento del botón, ya que el HTML maneja el scroll con onclick="scrollToSection('salas')"
        // Si se requiere visual feedback, se puede agregar aquí, pero no se debe prevenir el comportamiento por defecto.
    // No modificar el evento del botón ni del texto, dejar solo el atributo onclick del HTML
    // Así el botón 'Reservar Ahora' funcionará solo con el HTML y el texto no tendrá ningún evento
    }

    window.addEventListener('DOMContentLoaded', () => {
        setupSongButtons();
        setupReserveButtons();
        setupCartIcon();
        setupBannerReserveButton();
        updateCartCount();
    });
    
    console.log('Fuji Sounds website initialized successfully! 🎌🎤');
});

// Additional utility functions accessible globally
window.formatPrice = function(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
};

window.shareContent = function(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${title} - ${text} ${url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('¡Enlace copiado al portapapeles!');
        });
    }
};
