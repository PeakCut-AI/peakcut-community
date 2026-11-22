/* Community usage only: never disclose chat IDs, message text or auth tokens. */
(() => {
  const id = window.PEAKCUT_BRAND?.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id || '') || navigator.doNotTrack === '1') return;
  const preference = 'peakcut.analytics-consent.v1';
  let consent;
  try { consent = localStorage.getItem(preference); } catch { return; }
  if (consent !== 'allowed') {
    if (consent === 'denied') return;
    const notice = document.createElement('aside');
    notice.setAttribute('aria-label', 'Optional usage analytics');
    notice.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483647;max-width:360px;padding:20px;border:1px solid #3f3f46;border-radius:16px;background:#141417;color:#f4f4f5;font:14px/1.5 system-ui;box-shadow:0 8px 32px #0008';
    const text = document.createElement('p');
    text.textContent = 'Help improve Peakcut with optional Google Analytics? We measure general usage, without message text or private chat links.';
    notice.appendChild(text);
    for (const [label, value] of [['Allow analytics', 'allowed'], ['No thanks', 'denied']]) {
      const button = document.createElement('button');
      button.textContent = label;
      button.style.cssText = 'padding:9px 12px;margin:4px 8px 4px 0;border:0;border-radius:8px;cursor:pointer;background:' + (value === 'allowed' ? '#c8f24e;color:#09090b' : '#27272a;color:#f4f4f5');
      button.onclick = () => {
        try { localStorage.setItem(preference, value); } catch { notice.remove(); return; }
        notice.remove();
        if (value === 'allowed') location.reload();
      };
      notice.appendChild(button);
    }
    const privacy = document.createElement('a');
    privacy.href = window.PEAKCUT_BRAND.privacy;
    privacy.textContent = 'Privacy & analytics choices';
    privacy.style.cssText = 'display:block;color:#c8f24e;margin-top:8px';
    notice.appendChild(privacy);
    document.body.appendChild(notice);
    return;
  }
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
