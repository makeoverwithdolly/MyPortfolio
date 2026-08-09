/* ========================================
   MAKEOVER WITH DOLLY — Script
   All Interactivity & Features
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // ===== DOM Elements =====
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuLinks = document.querySelectorAll('.menu-link');
  const bookingForm = document.getElementById('bookingForm');
  const bookingModal = document.getElementById('bookingModal');
  const scrollTopBtn = document.getElementById('scrollTop');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const faqItems = document.querySelectorAll('.faq-item');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const toast = document.getElementById('toast');

  // ===== Mobile Menu Toggle =====
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Header Scroll Effect =====
  let lastScroll = 0;
  const handleScroll = () => {
    const currentScroll = window.scrollY;

    // Header background
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (currentScroll > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Update active nav on scroll
    updateActiveNav();

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== Scroll to Top =====
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Active Bottom Nav Update =====
  function updateActiveNav() {
    const sections = ['hero', 'services', 'gallery', 'booking', 'contact'];
    const navMap = {
      hero: 'nav-home',
      services: 'nav-services',
      gallery: 'nav-gallery',
      booking: 'nav-book',
      contact: 'nav-contact'
    };

    let currentSection = 'hero';

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          currentSection = sectionId;
        }
      }
    });

    bottomNavItems.forEach(item => item.classList.remove('active'));
    const activeNavId = navMap[currentSection];
    if (activeNavId) {
      const activeEl = document.getElementById(activeNavId);
      if (activeEl) activeEl.classList.add('active');
    }
  }

  // ===== Service Category Filter =====
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Filter cards with animation
      serviceCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== FAQ Accordion =====
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerInner = item.querySelector('.faq-answer-inner');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answerInner.scrollHeight + 20 + 'px';
      }
    });
  });

  // ===== Gallery Lightbox =====
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.img;
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  // ===== Testimonial Carousel =====
  if (testimonialCarousel) {
    let currentSlide = 0;
    const cards = testimonialCarousel.querySelectorAll('.testimonial-card');
    const totalSlides = cards.length;

    // Update dots on scroll
    testimonialCarousel.addEventListener('scroll', () => {
      const scrollLeft = testimonialCarousel.scrollLeft;
      const cardWidth = cards[0]?.offsetWidth + 16 || 300; // 16 = gap
      const newSlide = Math.round(scrollLeft / cardWidth);

      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < totalSlides) {
        currentSlide = newSlide;
        updateDots();
      }
    }, { passive: true });

    // Dot click handlers
    carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        const cardWidth = cards[0]?.offsetWidth + 16 || 300;
        testimonialCarousel.scrollTo({
          left: index * cardWidth,
          behavior: 'smooth'
        });
        currentSlide = index;
        updateDots();
      });
    });

    function updateDots() {
      carouselDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    // Auto-scroll testimonials
    let autoScroll = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      const cardWidth = cards[0]?.offsetWidth + 16 || 300;
      testimonialCarousel.scrollTo({
        left: currentSlide * cardWidth,
        behavior: 'smooth'
      });
      updateDots();
    }, 5000);

    // Pause auto-scroll on interaction
    testimonialCarousel.addEventListener('touchstart', () => {
      clearInterval(autoScroll);
    }, { passive: true });

    testimonialCarousel.addEventListener('touchend', () => {
      autoScroll = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        const cardWidth = cards[0]?.offsetWidth + 16 || 300;
        testimonialCarousel.scrollTo({
          left: currentSlide * cardWidth,
          behavior: 'smooth'
        });
        updateDots();
      }, 5000);
    }, { passive: true });
  }

  // ===== Booking Form =====
  // Set minimum date to today and max date to 1 year from now
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date();
    // Min Date = Today
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Max Date = 1 Year from Today
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const maxDate = nextYear.toISOString().split('T')[0];
    dateInput.setAttribute('max', maxDate);
  }

  // Form submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());

    // Validate
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      showToast('⚠️ Please fill in all required fields');
      return;
    }

    // Phone validation
    const phoneClean = data.phone.replace(/\s+/g, '');
    if (phoneClean.length < 10) {
      showToast('⚠️ Please enter a valid phone number');
      return;
    }

    // Build WhatsApp message
    const serviceNames = {
      bridal: 'Bridal Makeup',
      engagement: 'Engagement Makeup',
      party: 'Party Makeup',
      hd: 'HD Makeup',
      airbrush: 'Airbrush Makeup',
      mehendi: 'Mehendi/Haldi Look',
      prewedding: 'Pre-Wedding Shoot',
      saree: 'Saree Draping',
      'complete-wedding': 'Complete Wedding Package'
    };

    const locationNames = {
      home: 'Home Service',
      venue: 'Venue / Hotel',
      studio: "Dolly's Studio"
    };

    const message = `🌟 *New Booking Request — Makeover with Dolly*

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
💄 *Service:* ${serviceNames[data.service] || data.service}
📅 *Date:* ${formatDate(data.date)}
🕐 *Time:* ${data.time}
📍 *Location:* ${locationNames[data.location] || data.location}
${data.notes ? `📝 *Notes:* ${data.notes}` : ''}

Sent via makeoverwithdolly.com`;

    // Show success modal
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Open WhatsApp with message (after a short delay)
    setTimeout(() => {
      const waUrl = `https://wa.me/917070271232?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    }, 1500);

    // Reset form
    bookingForm.reset();
  });

  // ===== Close Booking Modal =====
  window.closeBookingModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close modal on overlay click
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      window.closeBookingModal();
    }
  });

  // ===== Toast Notification =====
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ===== Date Formatting =====
  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
  }

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ===== Keyboard Accessibility =====
  document.addEventListener('keydown', (e) => {
    // Close lightbox on Escape
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('active')) {
        closeLightbox();
      }
      if (bookingModal.classList.contains('active')) {
        window.closeBookingModal();
      }
      if (mobileMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // ===== Haptic Feedback (where supported) =====
  function haptic() {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  // Add haptic to buttons
  document.querySelectorAll('.btn, .filter-btn, .bottom-nav-item, .faq-question').forEach(btn => {
    btn.addEventListener('click', haptic);
  });

  // ===== Package Booking Pre-fill =====
  const bookButtons = document.querySelectorAll('[id^="book-"]');
  bookButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceMap = {
        'book-essentials-btn': 'party',
        'book-bridal-btn': 'bridal',
        'book-wedding-btn': 'complete-wedding'
      };
      const serviceValue = serviceMap[btn.id];
      if (serviceValue) {
        const serviceSelect = document.getElementById('bookingService');
        if (serviceSelect) {
          serviceSelect.value = serviceValue;
        }
      }
    });
  });

  // ===== Smooth Scroll for All Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Welcome Toast on First Visit =====
  if (!sessionStorage.getItem('dolly_visited')) {
    setTimeout(() => {
      showToast('👋 Welcome to Makeover with Dolly!');
      sessionStorage.setItem('dolly_visited', 'true');
    }, 2000);
  }

  // ===== Number Counter Animation =====
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const suffix = counter.textContent.includes('+') ? '+' : '';
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current) + suffix;
        }
      }, 40);
    });
  }

  // Trigger counter animation when stats bar is visible
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
  }

  // ===== Copy Offer Code =====
  const offerCode = document.querySelector('.offers-code');
  if (offerCode) {
    offerCode.style.cursor = 'pointer';
    offerCode.title = 'Tap to copy';
    offerCode.addEventListener('click', () => {
      navigator.clipboard.writeText(offerCode.textContent.trim())
        .then(() => showToast('📋 Offer code copied!'))
        .catch(() => showToast('Code: ' + offerCode.textContent.trim()));
      haptic();
    });
  }

  // ===== Performance: Lazy Load Images =====
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Initial scroll state
  handleScroll();
});
