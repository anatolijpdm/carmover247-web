(function () {
  'use strict';

  // Jahr im Footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile Navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');

  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  // Anfrageformular: baut eine E-Mail im Mailprogramm des Nutzers.
  // Es werden keine Daten an Server oder Dritte gesendet.
  var form = document.getElementById('anfrage');
  var status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var val = function (key) {
        var v = (data.get(key) || '').toString().trim();
        return v || '-';
      };

      var leistungen = data.getAll('leistung');
      var lines = [
        'Anfrage Pkw-Überführung',
        '',
        'Name: ' + val('name'),
        'Firma: ' + val('firma'),
        'Telefon: ' + val('telefon'),
        'E-Mail: ' + val('email'),
        '',
        'Abholort: ' + val('abholort'),
        'Zielort: ' + val('zielort'),
        'Fahrzeug: ' + val('fahrzeug'),
        'Zulassung: ' + val('zulassung'),
        'Wunschtermin: ' + val('termin'),
        'Leistungen: ' + (leistungen.length ? leistungen.join(', ') : '-'),
        '',
        'Nachricht:',
        val('nachricht')
      ];

      var mail = form.getAttribute('data-mail') || '';

      if (mail.indexOf('[') !== -1) {
        status.textContent = 'Hinweis für den Seitenbetreiber: Die E-Mail-Adresse ist noch nicht eingetragen.';
        return;
      }

      window.location.href =
        'mailto:' + mail +
        '?subject=' + encodeURIComponent('Anfrage Pkw-Überführung') +
        '&body=' + encodeURIComponent(lines.join('\r\n'));

      status.textContent = 'Ihr E-Mail-Programm wurde geöffnet. Bitte senden Sie die Nachricht dort ab. Falls sich nichts öffnet, schreiben Sie an ' + mail + '.';
    });
  }
})();
