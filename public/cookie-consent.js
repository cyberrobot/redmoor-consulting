function enableGoogleAnalytics() {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function clearGoogleAnalyticsCookies() {
  const hostParts = window.location.hostname.split('.');
  const domains = ['', window.location.hostname];

  if (hostParts.length > 1) {
    domains.push(`.${hostParts.slice(-2).join('.')}`);
  }

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();

    if (!/^_ga(?:_|$)/.test(name)) return;

    domains.forEach((domain) => {
      const domainAttribute = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; Max-Age=0; path=/${domainAttribute}; SameSite=Lax`;
    });
  });
}

function applyConsent() {
  if (CookieConsent.acceptedCategory('analytics')) {
    enableGoogleAnalytics();
  }
}

CookieConsent.run({
  cookie: {
    name: 'redmoor_cookie_consent',
    expiresAfterDays: 182,
    sameSite: 'Lax',
  },

  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom right',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  onFirstConsent: applyConsent,
  onConsent: applyConsent,
  onChange: ({ changedCategories }) => {
    if (!changedCategories.includes('analytics')) return;

    if (CookieConsent.acceptedCategory('analytics')) {
      enableGoogleAnalytics();
      return;
    }

    clearGoogleAnalyticsCookies();
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  },

  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      autoClear: {
        cookies: [{ name: /^_ga/ }],
      },
    },
  },

  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Your privacy choices',
          description:
            'We use optional Google Analytics cookies to understand how people use this website. You can accept or reject them; your choice will not affect the site.',
          acceptAllBtn: 'Accept all',
          // acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close preferences',
          sections: [
            {
              title: 'About cookies on this site',
              description:
                'We only use optional analytics cookies with your permission. You can change your choice at any time using the Cookie settings link in the footer.',
            },
            {
              title: 'Strictly necessary cookies',
              description:
                'These remember your cookie preference and are required for the consent controls to work.',
              linkedCategory: 'necessary',
              cookieTable: {
                headers: {
                  name: 'Name',
                  description: 'Purpose',
                  expiration: 'Expires',
                },
                body: [
                  {
                    name: 'redmoor_cookie_consent',
                    description: 'Stores your cookie preferences.',
                    expiration: '6 months',
                  },
                ],
              },
            },
            {
              title: 'Analytics cookies',
              description:
                'Google Analytics helps us measure visits and improve the website. Google may process information about your device and activity. These cookies are not set unless you enable this category.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  description: 'Purpose',
                  expiration: 'Typical expiry',
                },
                body: [
                  {
                    name: '_ga',
                    description: 'Distinguishes website visitors.',
                    expiration: '2 years',
                  },
                  {
                    name: '_ga_<container-id>',
                    description: 'Maintains the current session state.',
                    expiration: '2 years',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
});

const cookieSettingsButton = document.querySelector('.cookie-settings-link');

cookieSettingsButton?.addEventListener('click', () => {
  CookieConsent.showPreferences();
});
