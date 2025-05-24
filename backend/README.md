# Van Soest CMS Backend

Backend service voor Van Soest CMS gebouwd met Node.js, Express, TypeScript en Firebase.

## Snel starten

1. **Clone de repository**
2. **Installeer dependencies**
   ```bash
   npm install
   ```
3. **Maak een .env bestand aan**
   - Kopieer `.env.example` naar `.env` en vul je Firebase en andere secrets in.
4. **Start de development server**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start de development server met hot reload
- `npm run build` — Build de TypeScript code
- `npm start` — Start de productie server
- `npm test` — Draai alle tests (testdata wordt automatisch opgezet en verwijderd)
- `npm run lint` — Check code style met ESLint
- `npm run format` — Format code met Prettier
- `npm run backup` — Maak een backup van Firestore en Storage
- `npm run seed` — Seed de database met voorbeelddata
- `npm run deploy:rules` — Deploy Firestore en Storage security rules

## Testen

- Testdata en testbestanden worden automatisch aangemaakt en opgeruimd
- Zie `src/tests/helpers/firebase.ts` voor testdata helpers
- Media tests gebruiken bestanden uit `src/tests/test-files/`

## Firebase

- Zorg dat je een Firebase project hebt met Firestore en Storage
- Vul de Firebase config in `.env`
- Deploy security rules met `npm run deploy:rules`

## Code style

- ESLint en Prettier zijn geconfigureerd
- Gebruik `npm run lint` en `npm run format` voor nette code

## Overig

- Alle belangrijke scripts staan in `package.json`
- Je hoeft alleen `.env` in te vullen, verder is alles geautomatiseerd

## Licentie

MIT
