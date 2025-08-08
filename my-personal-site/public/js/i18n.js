i18next
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'tr',
    debug: false,
    resources: {
      en: {
        translation: {} // JSON dosyası dışarıdan yüklenecek
      },
      tr: {
        translation: {} // JSON dosyası dışarıdan yüklenecek
      }
    },
    backend: {
      loadPath: 'locales/{{lng}}/translation.json'
    }
  }, function(err, t) {
    // jQuery ile bağla
    jqueryI18next.init(i18next, $, { useOptionsAttr: true });
    $('body').localize();
  });
