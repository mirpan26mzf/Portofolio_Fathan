const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Toggle menu dan animasi silang
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Tutup menu jika klik di luar navbar atau toggle
document.addEventListener('click', (e) => {
  if (
    navMenu.classList.contains('active') && // hanya jika menu aktif
    !navMenu.contains(e.target) && // klik bukan di dalam navMenu
    !navToggle.contains(e.target) // klik bukan di toggle button
  ) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  }
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scroll untuk link navigasi
document.querySelectorAll('.nav ul li a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        // Tutup menu mobile jika aktif
        if(navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    }
  });
});
