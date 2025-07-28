document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.lang-toggle button');
  const currentLangLabel = document.getElementById('lang-modes');
  const path = window.location.pathname.toLowerCase();

  function getCurrentLang() {
    if (path === '/' || path === '') {
      return 'id';
    } else if (path.includes('/en')) {
      return 'en';
    } else {
      return 'id';
    }
  }

  let currentLang = getCurrentLang();

  buttons.forEach(button => {
    const lang = button.dataset.lang;
    const checkIcon = button.querySelector('i.fa-check');

    if (lang === currentLang) {
      checkIcon.style.display = 'inline-block';
      button.setAttribute('aria-pressed', 'true');
      currentLangLabel.innerHTML = `<i id="lang-icon" class="fal fa-globe fa-fw" aria-hidden="true"></i> ${button.textContent.trim()}`;
    } else {
      checkIcon.style.display = 'none';
      button.setAttribute('aria-pressed', 'false');
    }
  });

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;

      if (lang === 'id') {
        // kalau bahasa Indonesia, hapus semua /en dari path
        let newPath = path.replace(/\/en
