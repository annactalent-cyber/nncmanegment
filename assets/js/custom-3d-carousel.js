// custom-3d-carousel.js - High-Performance 3D Spatial Carousel

function init3DCarousel() {
    const container = document.querySelector('.carousel-3d-container');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.carousel-item'));
    if (items.length === 0) return;

    const numItems = items.length;
    const theta = 360 / numItems;
    
    // Dynamic radius based on viewport and item count
    function calculateRadius() {
        const isMobile = window.innerWidth <= 768;
        const cardWidth = isMobile ? 220 : 280;
        let r = Math.round((cardWidth / 2) / Math.tan(Math.PI / numItems));
        // Clamp radius for optimal visual density
        const minRadius = isMobile ? 380 : 650;
        const maxRadius = isMobile ? 800 : 1200;
        return Math.max(minRadius, Math.min(maxRadius, r + (isMobile ? 30 : 60)));
    }

    let radius = calculateRadius();

    function positionItems() {
        items.forEach((item, index) => {
            const itemAngle = theta * index;
            item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
            item.dataset.angle = itemAngle;
            item.dataset.index = index;
        });
    }

    positionItems();

    let targetAngle = 0;
    let activeIndex = 0;

    // HUD Counter Elements
    const currentCounter = document.querySelector('.carousel-counter .current') || document.querySelector('#current-artist');
    const totalCounter = document.querySelector('.carousel-counter .total') || document.querySelector('#total-artists');
    if (totalCounter) {
        totalCounter.textContent = String(numItems).padStart(2, '0');
    }

    function updateActiveItem() {
        let normalizedAngle = ((targetAngle % 360) + 360) % 360;
        let centerAngle = (360 - normalizedAngle) % 360;
        
        let closestDist = Infinity;
        let newActiveIndex = 0;
        
        items.forEach((item, index) => {
            const itemAngle = parseFloat(item.dataset.angle);
            let dist = Math.abs(itemAngle - centerAngle);
            if (dist > 180) dist = 360 - dist;
            
            if (dist < closestDist) {
                closestDist = dist;
                newActiveIndex = index;
            }
        });
        
        activeIndex = newActiveIndex;

        items.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        if (currentCounter) {
            currentCounter.textContent = String(activeIndex + 1).padStart(2, '0');
        }
    }

    function rotateTo(angle, animate = true) {
        targetAngle = angle;
        if (animate) {
            container.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
            container.style.transition = 'none';
        }
        // Formula: translateZ(-radius) rotateY(targetAngle)
        container.style.transform = `translateZ(-${radius}px) rotateY(${targetAngle}deg)`;
        updateActiveItem();
    }

    function rotateToIndex(index) {
        const itemAngle = parseFloat(items[index].dataset.angle);
        let currentNormalized = targetAngle;
        let target = -itemAngle;
        
        let diff = (target - currentNormalized) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        rotateTo(currentNormalized + diff);
    }

    // Click to focus or open
    items.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            // If clicking on an inactive item, just rotate to it
            if (index !== activeIndex) {
                e.preventDefault();
                rotateToIndex(index);
                return;
            }
            
            // If it's already active, we trigger the "open" effect
            e.preventDefault(); // Prevent immediate navigation
            
            // Find target URL from the .profile-btn inside the item
            const btn = item.querySelector('.profile-btn');
            const targetUrl = btn ? btn.getAttribute('href') : null;
            
            if (targetUrl) {
                // Add overlay if it doesn't exist
                let overlay = document.querySelector('.carousel-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'carousel-overlay';
                    document.body.appendChild(overlay);
                }
                
                // Start animation
                item.classList.add('expanding');
                
                // Force reflow for overlay transition
                void overlay.offsetWidth;
                overlay.classList.add('active');
                
                // Wait for animation to finish, then navigate
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 700); // Wait 700ms matching CSS transition
            }
        });
    });

    // Mouse Drag
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;

    container.parentElement.addEventListener('mousedown', (e) => {
        if (e.target.closest('.carousel-hud')) return;
        isDragging = true;
        startX = e.pageX;
        startAngle = targetAngle;
        rotateTo(targetAngle, false);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dist = e.pageX - startX;
        targetAngle = startAngle + (dist * 0.35);
        container.style.transform = `translateZ(-${radius}px) rotateY(${targetAngle}deg)`;
        updateActiveItem();
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        const nearestIndex = Math.round(targetAngle / theta);
        rotateTo(nearestIndex * theta, true);
    });

    // Touch Swipe
    container.parentElement.addEventListener('touchstart', (e) => {
        if (e.target.closest('.carousel-hud')) return;
        isDragging = true;
        startX = e.touches[0].pageX;
        startAngle = targetAngle;
        rotateTo(targetAngle, false);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dist = e.touches[0].pageX - startX;
        targetAngle = startAngle + (dist * 0.4);
        container.style.transform = `translateZ(-${radius}px) rotateY(${targetAngle}deg)`;
        updateActiveItem();
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const nearestIndex = Math.round(targetAngle / theta);
        rotateTo(nearestIndex * theta, true);
    });

    // HUD Buttons (Prev / Next)
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');

    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.preventDefault();
            rotateTo(Math.round(targetAngle / theta) * theta + theta, true);
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.preventDefault();
            rotateTo(Math.round(targetAngle / theta) * theta - theta, true);
        };
    }

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            rotateTo(Math.round(targetAngle / theta) * theta + theta, true);
        } else if (e.key === 'ArrowRight') {
            rotateTo(Math.round(targetAngle / theta) * theta - theta, true);
        }
    });

    // Mouse Wheel
    let wheelTimeout;
    container.parentElement.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) < 10) return;
        e.preventDefault();
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                rotateTo(Math.round(targetAngle / theta) * theta - theta, true);
            } else {
                rotateTo(Math.round(targetAngle / theta) * theta + theta, true);
            }
        }, 40);
    }, { passive: false });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        radius = calculateRadius();
        positionItems();
        rotateTo(targetAngle, false);
    });

    // Initial Setup
    rotateTo(0, false);
}

window.init3DCarousel = init3DCarousel;
