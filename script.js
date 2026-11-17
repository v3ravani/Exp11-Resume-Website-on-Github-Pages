/* ==========================================================
   JavaScript Functionality for Viraj Ravani - Web Resume
   Experiment No. 11
   Features:
   - Dark / Light Mode Toggle with Persistence
   - Active Navigation Highlighting & Smooth Scroll
   - Mobile Navigation Menu Toggle
   - Print & PDF Actions
   - Copy Email to Clipboard
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Determine initial theme: saved preference -> system preference -> light
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('resume_theme');
    if (savedTheme) {
      return savedTheme;
    }
    return prefersDark.matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('resume_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  // Initialize theme
  applyTheme(getInitialTheme());

  // Listen for system theme changes if user hasn't explicitly chosen
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('resume_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle on button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // 2. MOBILE NAVIGATION MENU TOGGLE
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('show');
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  // 3. SCROLLSPY & ACTIVE NAV LINK HIGHLIGHTING
  const sections = document.querySelectorAll('section[id], header[id="profile"]');
  const navItems = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollY = window.scrollY + 120; // offset for fixed navbar

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  // 4. PRINT RESUME BUTTON
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 5. COPY EMAIL TO CLIPBOARD
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const emailToCopy = 'viraj.ravani@somaiya.edu';

  if (copyBtn && copyBtnText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'Copied!';
        copyBtn.style.borderColor = 'var(--accent)';
        copyBtn.style.color = 'var(--accent)';

        setTimeout(() => {
          copyBtnText.textContent = originalText;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers or restricted permissions
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          copyBtnText.textContent = 'Copied!';
          setTimeout(() => {
            copyBtnText.textContent = 'Copy Email';
          }, 2000);
        } catch (e) {
          window.location.href = `mailto:${emailToCopy}`;
        }
        document.body.removeChild(textArea);
      }
    });
  }
});
