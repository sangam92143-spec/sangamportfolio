import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.querySelector('.navbar');
  const mobileMenuLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('mobile-active');
    });

    // Close menu when clicking links
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('mobile-active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navbar.classList.contains('mobile-active')) {
        navbar.classList.remove('mobile-active');
      }
    });
  }

  // 2. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Trigger only once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 3. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Close other items
        faqItems.forEach(otherItem => {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherTrigger && otherContent && otherItem !== item) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherContent.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isExpanded) {
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // 4. Short-Form Carousel Controls
  const carousel = document.getElementById('shortsCarousel');
  const arrowLeft = document.getElementById('carouselLeft');
  const arrowRight = document.getElementById('carouselRight');

  if (carousel && arrowLeft && arrowRight) {
    // Left Arrow Scroll Click
    arrowLeft.addEventListener('click', () => {
      const firstItem = carousel.querySelector('.carousel-item');
      if (firstItem) {
        const itemWidth = firstItem.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(carousel).gap) || 0;
        // On desktop, scroll roughly by a grid item. On mobile, scroll by a card.
        const scrollAmount = window.innerWidth >= 800 ? (itemWidth + gap) * 2 : (itemWidth + gap);
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    });

    // Right Arrow Scroll Click
    arrowRight.addEventListener('click', () => {
      const firstItem = carousel.querySelector('.carousel-item');
      if (firstItem) {
        const itemWidth = firstItem.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(carousel).gap) || 0;
        const scrollAmount = window.innerWidth >= 800 ? (itemWidth + gap) * 2 : (itemWidth + gap);
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });

    // Carousel Snap Highlighting Fallback (for Firefox & Safari)
    if (!CSS.supports('container-type', 'scroll-state')) {
      const carouselItems = carousel.querySelectorAll('.carousel-item');
      
      const snapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-snapped', entry.isIntersecting);
        });
      }, {
        root: carousel,
        // Trigger intersection when card sits in the center 2% of the viewport container
        rootMargin: '0px -49% 0px -49%'
      });

      carouselItems.forEach(item => {
        snapObserver.observe(item);
      });
    }
  }

  // 5. Native Video Playback Utilities (hiding overlays when playing)
  const videoContainers = document.querySelectorAll('.video-container');
  videoContainers.forEach(container => {
    const video = container.querySelector('.portfolio-video');
    if (video) {
      video.addEventListener('play', () => {
        container.classList.add('playing');
        
        // Pause other playing videos to prevent sound clashing
        document.querySelectorAll('.video-container.playing').forEach(otherContainer => {
          if (otherContainer !== container) {
            const otherVideo = otherContainer.querySelector('.portfolio-video');
            if (otherVideo) {
              otherVideo.pause();
            }
          }
        });
      });
      
      video.addEventListener('pause', () => {
        container.classList.remove('playing');
      });
      
      video.addEventListener('ended', () => {
        container.classList.remove('playing');
      });
    }
  });

  // 6. Dynamic Copyright Year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }
});
