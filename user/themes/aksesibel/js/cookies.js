function waitForCookieConsent(callback) {
  if (typeof window.CookieConsent !== "undefined") {
    callback();
  } else {
    setTimeout(() => waitForCookieConsent(callback), 50);
  }
}

waitForCookieConsent(() => {
  CookieConsent.run({
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: { enabled: false, readOnly: false }
    },
    language: {
      default: 'en',
      autoDetect: 'document',
      translations: {
        en: {
          consentModal: {
            title: 'This site uses cookies',
            description: 'This site uses a few <strong>necessary</strong> cookies to keep things running smoothly. I also use some analytics cookies to understand what’s working and help make the site even better.',
            acceptAllBtn: 'Accept all cookies',
            acceptNecessaryBtn: 'Accept only necessary',
            showPreferencesBtn: 'Manage individual preferences'
          }
        },
        id: {
          consentModal: {
            title: 'Situs web ini menggunakan cookies',
            description: 'Situs web ini menggunakan beberapa cookies <strong>yang diperlukan</strong> agar semuanya berjalan lancar. Saya juga menggunakan cookies analitik untuk memahami apa yang bekerja dengan baik dan mengembangkannya.',
            acceptAllBtn: 'Terima semua cookies',
            acceptNecessaryBtn: 'Hanya cookies yang diperlukan',
            showPreferencesBtn: 'Kelola preferensi'
          }
        }
      }
    }
  });
});
