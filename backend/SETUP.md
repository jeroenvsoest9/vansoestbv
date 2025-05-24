# Van Soest CMS Backend — Setup Handleiding

Volg deze stappen om het project lokaal te draaien en CI/CD (GitHub Actions + Firebase Hosting) te activeren.

---

## 1. Vereisten

- Node.js 18+
- Een Firebase project (met Firestore & Storage)
- (Optioneel) GitHub repository voor CI/CD

---

## 2. Project lokaal opzetten

1. **Clone de repository**

   ```bash
   git clone <jouw-repo-url>
   cd van-soest-cms/backend
   ```

2. **Installeer dependencies**

   ```bash
   npm install
   ```

3. **.env instellen**

   - Kopieer `.env.example` naar `.env`:
     ```bash
     cp .env.example .env
     ```
   - Vul je Firebase en andere secrets in `.env` in.

4. **Start de development server**

   ```bash
   npm run dev
   ```

5. **(Optioneel) Seed de database**

   ```bash
   npm run seed
   ```

6. **(Optioneel) Backup maken**

   ```bash
   npm run backup
   ```

7. **Testen draaien**
   ```bash
   npm test
   ```

---

## 3. CI/CD & Firebase Hosting

1. **Zorg dat je een `firebase.json` en `.firebaserc` in de root hebt**

   - Deze worden gebruikt voor Firebase Hosting config.

2. **Voeg secrets toe aan GitHub**

   - Ga naar je repo → Settings → Secrets → Actions → New repository secret
   - Voeg toe:
     - `FIREBASE_TOKEN` (haal op met `firebase login:ci`)
     - `FIREBASE_PROJECT_ID` (je Firebase project ID)

3. **Push naar main**
   - Elke push naar `main` triggert automatisch:
     - Installatie, lint, build, test
     - Deploy naar Firebase Hosting (indien alles slaagt)

---

## 4. Handige scripts

- `npm run dev` — Development server
- `npm run build` — Build
- `npm start` — Productie server
- `npm test` — Tests
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run backup` — Backup Firestore & Storage
- `npm run seed` — Seed database
- `npm run deploy:rules` — Deploy Firestore/Storage rules

---

## 5. Problemen?

- Controleer of je `.env` goed is ingevuld
- Controleer of je Firebase project en rechten kloppen
- Bekijk de logs van GitHub Actions bij CI/CD fouten

---

Veel succes! 🎉
