/*
  Cookie-/Speicher-Hinweis (ohne externe Dienste)

  Aktueller Stand:
  - Die Seite setzt keine Tracking-Cookies und lädt keine externen Dienste.
  - Gespeichert wird nur Ihre Auswahl im Browser (localStorage, Schlüssel "cookie-consent").

  Wenn Sie später z. B. eine Statistik einbinden:
  1. Laden Sie das Skript NUR innerhalb von applyConsent(), wenn consent.statistics === true ist.
  2. Passen Sie den Text im Banner und die Datenschutzerklärung an.
  3. Erhöhen Sie VERSION, damit alle Besucher erneut gefragt werden.
*/
(function () {
  'use strict';

  var KEY = 'cookie-consent';
  var VERSION = 1;
  var banner = null;

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      return c && c.version === VERSION ? c : null;
    } catch (e) {
      return null;
    }
  }

  function write(statistics) {
    var c = { version: VERSION, necessary: true, statistics: !!statistics, time: new Date().toISOString() };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(c));
    } catch (e) { /* Speicher blockiert: Auswahl gilt nur für diesen Seitenaufruf */ }
    return c;
  }

  function applyConsent(consent) {
    if (consent && consent.statistics) {
      // Hier später optionale Dienste laden (derzeit keine im Einsatz).
    }
  }

  function build() {
    banner = document.createElement('div');
    banner.className = 'cc';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie-Hinweis');
    banner.hidden = true;
    banner.innerHTML =
      '<h2>Cookies und Datenschutz</h2>' +
      '<p>Diese Seite speichert nur, was für den Betrieb nötig ist, zum Beispiel Ihre Auswahl hier. ' +
      'Optionale Dienste wie Statistik sind derzeit nicht aktiv. Sie können Ihre Wahl jederzeit im Footer ändern. ' +
      '<a href="datenschutz.html">Datenschutzerklärung</a></p>' +
      '<div class="cc-actions">' +
      '<button type="button" class="btn btn-primary" data-cc="all">Alle akzeptieren</button>' +
      '<button type="button" class="btn btn-white" data-cc="necessary">Nur notwendige</button>' +
      '</div>';

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cc]');
      if (!btn) return;
      var consent = write(btn.getAttribute('data-cc') === 'all');
      hide();
      applyConsent(consent);
    });

    document.body.appendChild(banner);
  }

  function show() {
    if (!banner) build();
    banner.hidden = false;
    var first = banner.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }

  function hide() {
    if (banner) banner.hidden = true;
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookie-settings]')) {
      e.preventDefault();
      show();
    }
  });

  function init() {
    var consent = read();
    if (consent) {
      applyConsent(consent);
    } else {
      build();
      banner.hidden = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CookieConsent = { get: read, open: show };
})();
