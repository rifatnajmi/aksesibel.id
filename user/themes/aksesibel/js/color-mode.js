document.addEventListener('DOMContentLoaded', () => {
  const themeButtons = document.querySelectorAll('[data-theme]');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const themeIcon = document.getElementById('theme-icon');

  const iconMap = {
    light: 'fa-sun',
    dark: 'fa-moon',
    system: 'fa-eclipse'
  };

  function applyTheme(theme) {
    if (theme === 'system') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }

    // Ganti ikon utama
    if (themeIcon) {
      themeIcon.className = `fal ${iconMap[theme]} fa-fw`;
    }

    // Perbarui tombol terpilih
    themeButtons.forEach(btn => {
      const btnTheme = btn.getAttribute('data-theme');
      const isActive = btnTheme === theme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Ambil dari localStorage atau default ke 'system'
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);

  // Saat tombol diklik
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedTheme = button.getAttribute('data-theme');
      localStorage.setItem('theme', selectedTheme);
      applyTheme(selectedTheme);
    });
  });

  // Jika sistem berubah dan user pakai mode 'system'
  prefersDark.addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  });
});
