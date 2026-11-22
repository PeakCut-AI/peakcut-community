/* Community usage only: never disclose chat IDs, message text or auth tokens. */
(() => {
  const id = window.PEAKCUT_BRAND?.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id || '') || navigator.doNotTrack === '1') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('set', 'ads_data_redaction', true);
  gtag('config', id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Disable automatic history/page events, which could contain private URLs.
    page_location: location.origin + '/community',
    page_referrer: '',
    page_title: 'Peakcut Community'
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(script);
  let previous;
  function track() {
    const path = location.pathname;
    const screen = path.startsWith('/login/reset') ? 'password-reset'
      : path.startsWith('/login/verify') ? 'email-verification'
      : path.startsWith('/login/create') ? 'registration'
      : path.startsWith('/login') ? 'login'
      : path.startsWith('/invite') ? 'invitation'
      : path.startsWith('/server') ? 'community' : 'home';
    if (screen === previous) return;
    previous = screen;
    gtag('event', 'page_view', {
      send_to: id,
      page_location: location.origin + '/' + screen,
      page_referrer: '',
      page_title: 'Peakcut Community · ' + screen,
      community_screen: screen,
      product_area: 'community'
    });
  }
  for (const key of ['pushState', 'replaceState']) {
    const original = history[key];
    history[key] = function (...args) {
      const result = original.apply(this, args);
      track();
      return result;
    };
  }
  addEventListener('popstate', track);
  track();
})();
