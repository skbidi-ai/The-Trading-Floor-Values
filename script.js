// --- Strict Mode for Robustness ---
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  
  // --- Custom Cursor & Aura Overlay ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const root = document.documentElement;
  let mouseX = 0;
  let mouseY = 0;

  // Update mouse position for custom cursor, background parallax, and card shimmer
  window.addEventListener('mousemove', (e) => {
    // Normalize mouse position to range [-1, 1]
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    root.style.setProperty('--mouse-x', mouseX.toFixed(3));
    root.style.setProperty('--mouse-y', mouseY.toFixed(3));

    // Crosshair logic
    if(cursorDot && cursorOutline) {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      
      // Add slight delay for the outline (trailing effect)
      cursorOutline.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 500, fill: "forwards" });
    }
  });

  // Hover effects for the custom cursor
  document.querySelectorAll('a, i').forEach(el => {
    el.addEventListener('pointerenter', () => {
      if(cursorOutline) {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
      }
    });
    el.addEventListener('pointerleave', () => {
      if(cursorOutline) {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
      }
    });
  });

  // --- Mobile Navigation ---
  const menuIcon = document.querySelector('#menu-icon');
  const navbar = document.querySelector('.navbar');

  if(menuIcon && navbar) {
    menuIcon.onclick = () => {
      menuIcon.classList.toggle('bx-x');
      navbar.classList.toggle('active');
    };
  }

  // --- Update Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // If we've scrolled past the top of the section (with some offset for the header)
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Close mobile menu when scrolling past
    if(menuIcon && navbar && window.scrollY > 0) {
      menuIcon.classList.remove('bx-x');
      navbar.classList.remove('active');
    }
  });

  // --- Typing Text Animation ---
  const textArray = ["Web Developer", "Node.js Enthusiast", "Python Programmer", "Student"];
  const typingDelay = 100;
  const erasingDelay = 100;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  function type() {
    if (!typedTextSpan || !cursorSpan) return;
    if (charIndex < textArray[textArrayIndex].length) {
      if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (!typedTextSpan || !cursorSpan) return;
    if (charIndex > 0) {
      if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 1100);
    }
  }

  if (textArray.length) setTimeout(type, newTextDelay + 250);

  // --- 3D Tilted Card & Parallax Effects ---
  // Using querySelectorAll for all elements tagged with data-tilt
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', handleTilt);
    el.addEventListener('mouseleave', resetTilt);
  });

  function handleTilt(e) {
    const el = this;
    const rect = el.getBoundingClientRect();
    const width = el.clientWidth;
    const height = el.clientHeight;

    // Mouse coordinates relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update CSS variables for shimmer highlights
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);

    // Mouse position relative to center for Tilt
    const centerX = x - width / 2;
    const centerY = y - height / 2;

    // Constrain the rotation to a small angle for a subtle, responsive feel
    const rotateX = -(centerY / height) * 10;
    const rotateY = (centerX / width) * 10;

    requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  }

  function resetTilt() {
    const el = this;
    requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // --- Canvas Particle Background (subtle, responsive to mouse) ---
  const canvas = document.getElementById('canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const particles = [];
  const particleCount = 80;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    if (!canvas) return;
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.2,
        baseX: 0,
        baseY: 0,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2
      });
    }
  }

  function updateParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Parallax offset based on mouse
      const offsetX = mouseX * 30;
      const offsetY = mouseY * 30;

      p.x += p.speedX + (mouseX * 0.1);
      p.y += p.speedY + (mouseY * 0.1);

      // Wrap particles around edges
      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.height + 50;
      if (p.y > canvas.height + 50) p.y = -50;

      ctx.beginPath();
      ctx.arc(p.x + offsetX, p.y + offsetY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 179, 255, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(updateParticles);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();
  createParticles();
  requestAnimationFrame(updateParticles);

});
