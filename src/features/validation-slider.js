export function initValidationSlider() {
  const slides = document.querySelectorAll('.validation-slide');
  const dots = document.querySelectorAll('.validation-dot');
  const prevBtn = document.querySelector('.slider-btn.prev-btn');
  const nextBtn = document.querySelector('.slider-btn.next-btn');

  if (slides.length === 0) return;

  let currentSlideIndex = 0;
  let slideInterval;

  function showSlide(index) {
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    // Hide all slides and deactivate dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide and activate matching dot
    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) {
      dots[currentSlideIndex].classList.add('active');
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 2000); // changes every 2 seconds
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Manual navigation controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex - 1);
      startAutoPlay(); // Restart timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex + 1);
      startAutoPlay(); // Restart timer
    });
  }

  // Dot indicators
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay(); // Restart timer
    });
  });

  // Start autoplay immediately
  startAutoPlay();
}
