document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Custom Cursor Logic ---
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  
  if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('.hover-target');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
      });
    });
  }

  // --- Card Mouse Hover Glow Effects (Linear-style) ---
  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- Header Scrolled Background ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Sidebar Controls ---
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileNav = () => {
    mobileNav.classList.toggle('active');
    backdrop.classList.toggle('active');
  };

  if (menuBtn && mobileNav && backdrop) {
    menuBtn.addEventListener('click', toggleMobileNav);
    backdrop.addEventListener('click', toggleMobileNav);
    mobileLinks.forEach(link => {
      link.addEventListener('click', toggleMobileNav);
    });
  }

  // --- Project Category Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active to current
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Typing Text Utility ---
  const typeText = (element, text, speed, callback) => {
    let index = 0;
    element.textContent = ""; // clear initial content
    const timer = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  };

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger typing text if about section
        if (entry.target.id === 'about') {
          const titleEl = document.getElementById('typingAboutTitle');
          if (titleEl) {
            typeText(titleEl, "About Me", 150);
          }
        }
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Stats / Metrics Counter Animation ---
  const statsElements = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetEl = entry.target;
        const targetValue = parseInt(targetEl.getAttribute('data-target'), 10);
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / targetValue), 15);
        
        const counter = setInterval(() => {
          startValue += 1;
          if (startValue > targetValue) {
            targetEl.textContent = targetValue + (targetValue === 100 ? '%' : '+');
            clearInterval(counter);
          } else {
            targetEl.textContent = startValue + (targetValue === 100 ? '%' : '+');
          }
        }, stepTime);

        statsObserver.unobserve(targetEl);
      }
    });
  }, {
    threshold: 0.5
  });

  statsElements.forEach(el => statsObserver.observe(el));

  // --- Premium Contact Form Submission & Toast ---
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="check-circle"></i>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Trigger animate-in
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 4000);
  };

  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme');

  // Check initial state
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-mode');
      
      let theme = 'dark';
      if (document.documentElement.classList.contains('light-mode')) {
        theme = 'light';
      }
      localStorage.setItem('theme', theme);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Simulate loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="logo-dot" style="position: static; display: inline-block;"></span>
        <span>Sending...</span>
      `;

      setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Trigger premium notification toast
        showToast("Message received successfully! I will reach out shortly.");
      }, 1500);
    });
  }
});
