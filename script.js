const track = document.getElementById('track');
const slides = Array.from(document.querySelectorAll('.slide-card'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideIndicator = document.getElementById('currentSlide');

let currentIndex = 0;

// Update visible active class and counter
function updateCarousel() {
    slides.forEach((slide, index) => {
        if (index === currentIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    currentSlideIndicator.textContent = currentIndex + 1;
}

// Scroll track to specific slide
function scrollToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentIndex = index;
    
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    
    // Calculate the scroll position to center the slide
    const scrollPosition = slides[index].offsetLeft - (track.clientWidth / 2) + (slideWidth / 2);
    
    track.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    updateCarousel();
}

// Event Listeners for Buttons
nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
        scrollToSlide(currentIndex + 1);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        scrollToSlide(currentIndex - 1);
    }
});

// Update active slide on scroll (debounce for smooth snap experience)
let isScrolling;
track.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        const trackCenter = track.scrollLeft + (track.clientWidth / 2);
        
        let closestIndex = 0;
        let minDistance = Infinity;

        slides.forEach((slide, index) => {
            const slideCenter = slide.offsetLeft + (slide.clientWidth / 2);
            const distance = Math.abs(trackCenter - slideCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (currentIndex !== closestIndex) {
            currentIndex = closestIndex;
            updateCarousel();
        }
    }, 100); // 100ms debounce
});

// Initialize
setTimeout(() => {
    scrollToSlide(0);
}, 100);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
});
