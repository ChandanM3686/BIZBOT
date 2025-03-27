document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      if (this.classList.contains('active')) {
        this.setAttribute('aria-expanded', 'true');
        // Transform hamburger to X
        this.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
        this.querySelector('span:nth-child(2)').style.opacity = '0';
        this.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        this.setAttribute('aria-expanded', 'false');
        // Reset hamburger
        this.querySelector('span:nth-child(1)').style.transform = 'none';
        this.querySelector('span:nth-child(2)').style.opacity = '1';
        this.querySelector('span:nth-child(3)').style.transform = 'none';
      }
    });
  }
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.querySelector('span:nth-child(1)').style.transform = 'none';
        mobileMenuBtn.querySelector('span:nth-child(2)').style.opacity = '1';
        mobileMenuBtn.querySelector('span:nth-child(3)').style.transform = 'none';
      }
    });
  });
  
  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // If the clicked item wasn't active, open it
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
  
  // Testimonial Slider
  const testimonials = document.querySelectorAll('.testimonial-card');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.testimonial-btn.prev');
  const nextBtn = document.querySelector('.testimonial-btn.next');
  
  let currentTestimonial = 0;
  
  function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    indicators[index].classList.add('active');
    currentTestimonial = index;
  }
  
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    });
  }
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showTestimonial(index);
    });
  });
  
  // Auto-rotate testimonials
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    }
  }, 5000);
  
  // Chat Demo Animation
  const chatDemo = document.querySelector('.chat-demo');
  const typingMessage = document.querySelector('.message.typing');
  
  if (chatDemo && typingMessage) {
    setTimeout(() => {
      typingMessage.classList.remove('typing');
      const messageContent = typingMessage.querySelector('.message-content');
      messageContent.innerHTML = '<p>Our business hours are Monday to Friday, 9am to 6pm EST. We\'re also available on weekends from 10am to 4pm. Is there anything else I can help you with?</p>';
    }, 2000);
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .pricing-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Set initial styles for animation
  document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Run animation on load and scroll
  window.addEventListener('load', animateOnScroll);
  window.addEventListener('scroll', animateOnScroll);
});