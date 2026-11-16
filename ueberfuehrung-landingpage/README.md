# Landingpage Pkw-Überführung

Statische Seite (HTML, CSS, JavaScript). Kein Build, keine Abhängigkeiten, keine externen Schriften oder Dienste.

## Inhalt

```
index.html        Startseite
impressum.html    Impressum (Vorlage)
datenschutz.html  Datenschutzerklärung (Vorlage)
404.html          Fehlerseite
favicon.svg
robots.txt
css/style.css     Design (Farben oben in :root)
js/main.js        Menü und Anfrageformular
js/cookie.js      Cookie-Banner
```

## Vor dem Livegang: Platzhalter ersetzen

Suchen Sie in allen Dateien (z. B. mit Strg+Umschalt+F in VS Code) nach diesen Platzhaltern:

| Platzhalter | Ersetzen durch |
|---|---|
| `[FIRMENNAME]` | Name Ihres Unternehmens |
| `[TELEFON]` | Telefonnummer zur Anzeige |
| `+49XXXXXXXXXX` | Nummer im Format +491701234567 (für `tel:`) |
| `49XXXXXXXXXX` | WhatsApp-Nummer ohne + (für `wa.me/`) |
| `[E-MAIL]` | Ihre E-Mail-Adresse (auch im `data-mail` des Formulars) |
| Alle übrigen `[...]` | Angaben in Impressum, Datenschutz und FAQ |

Prüfen Sie vor dem Livegang:

- Nur Aussagen veröffentlichen, die stimmen (zum Beispiel zur Versicherung in den FAQ).
- Umsatzsteuer-Hinweis beim Preis ergänzen (netto/brutto bzw. Kleinunternehmer).
- Ob die 200 € für jede Überführung eines Neukunden oder nur für den Erstauftrag gelten, und ob es ein Enddatum gibt. Die Seite sagt aktuell nur „Neukundenangebot“.
- Impressum und Datenschutz rechtlich prüfen lassen. Beides sind Vorlagen und keine Rechtsberatung.

## Lokal ansehen

`index.html` per Doppelklick im Browser öffnen. Oder im Ordner `python3 -m http.server 8080` ausführen und `http://localhost:8080` öffnen.

## Deployment auf AWS (S3 + CloudFront)

1. **S3-Bucket anlegen** (Region z. B. `eu-central-1`). Öffentlichen Zugriff blockiert lassen.
2. **Dateien hochladen**: Ordnerinhalt (ohne `README.md`) in den Bucket-Root laden, sodass `index.html` direkt im Root liegt.
   ```
   aws s3 sync . s3://IHR-BUCKET --delete --exclude "README.md" --exclude ".*"
   ```
3. **CloudFront-Distribution erstellen**
   - Origin: der S3-Bucket, Zugriff über **Origin Access Control (OAC)**. Die vorgeschlagene Bucket-Policy übernehmen.
   - Default Root Object: `index.html`
   - Viewer Protocol Policy: *Redirect HTTP to HTTPS*
   - Response Headers Policy: *SecurityHeadersPolicy* (Managed)
   - Custom Error Response: HTTP 403 und 404 auf `/404.html` mit Antwortcode 404 (bei privatem Bucket liefert S3 für fehlende Dateien 403).
4. **Eigene Domain und Zertifikat**
   - Zertifikat in AWS Certificate Manager in der Region **us-east-1** anfordern (Pflicht für CloudFront).
   - Domain in der Distribution als Alternate Domain Name (CNAME) eintragen.
   - DNS (Route 53 oder Ihr Anbieter): A/AAAA-Alias bzw. CNAME auf die CloudFront-Adresse.
5. **Änderungen veröffentlichen**: erneut `aws s3 sync`, danach Cache leeren:
   ```
   aws cloudfront create-invalidation --distribution-id IHRE-ID --paths "/*"
   ```

Hinweis zur DSGVO: Tragen Sie in der Datenschutzerklärung die tatsächlich genutzte Region ein und schließen Sie in Ihrem AWS-Konto die Auftragsverarbeitung (AWS GDPR DPA) ab.

## Anfrageformular

Das Formular öffnet das E-Mail-Programm des Besuchers mit fertigem Text (`mailto:`). Es braucht kein Backend und überträgt keine Daten an Dritte. Für Anfragen direkt in ein System (Plattform, Kundenverwaltung) ersetzen Sie das später durch eine API, zum Beispiel API Gateway mit Lambda und SES.

## Cookie-Banner

Die Seite setzt aktuell keine Cookies und nutzt kein Tracking. Das Banner speichert nur die Auswahl im Browser. Wenn Sie später Statistik oder andere Dienste einbinden, lesen Sie den Kommentar am Anfang von `js/cookie.js`.

## Design anpassen

Farben und Maße stehen oben in `css/style.css` im Block `:root`. Die Akzentfarbe ist `--accent`.
