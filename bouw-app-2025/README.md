# Bouw App 2025

All-in-one bouw applicatie voor Van Soest Bouw en Advies B.V.

## Project Structuur

```
bouw-app-2025/
├── packages/
│   ├── frontend/           # React frontend applicatie
│   │   └── src/
│   │       ├── components/ # Herbruikbare UI componenten
│   │       ├── pages/      # Pagina componenten
│   │       ├── services/   # API services
│   │       ├── utils/      # Utility functies
│   │       ├── assets/     # Statische bestanden
│   │       └── styles/     # Styling bestanden
│   │
│   ├── backend/            # Node.js backend applicatie
│   │   └── src/
│   │       ├── controllers/# Request handlers
│   │       ├── models/     # Database modellen
│   │       ├── routes/     # API routes
│   │       ├── services/   # Business logic
│   │       ├── utils/      # Utility functies
│   │       └── config/     # Configuratie bestanden
│   │
│   └── shared/             # Gedeelde code tussen frontend en backend
│
└── package.json            # Root package.json
```

## Functionaliteiten

### 1. Offerte Aanvraag Systeem
- Dynamisch interactief menu
- Vragenlijst met vervolgkeuzes
- Automatische projectmap generatie

### 2. Project Management
- Planning generator
- Offerte generator
- Calculatie systeem
- Materiaalstaat
- Nacalculatie met GPS tracking
- Urenregistratie
- Materiaalregistratie

### 3. Opname Tools
- Klus opname assistentie
- Plattegrond maker (hoek scanning)
- Kooi configuratie
- Constructie berekeningen
- Vergunningcheck

### 4. Documentatie & Notities
- Notitie systeem met foto's
- Koppeling met projectmap
- Document management

## Technologie Stack

### Frontend
- React.js met TypeScript
- Material-UI
- Three.js
- React Router
- Redux

### Backend
- Node.js met Express
- MongoDB
- Socket.io
- PDF generatie
- GPS tracking

### Extra Tools
- TensorFlow.js
- Google Maps API
- OCR
- Cloud Storage

## Installatie

1. Clone de repository:
```bash
git clone [repository-url]
cd bouw-app-2025
```

2. Installeer dependencies:
```bash
npm run install:all
```

3. Start de development servers:
```bash
npm run dev
```

## Ontwikkeling

### Frontend Development
```bash
cd packages/frontend
npm run dev
```

### Backend Development
```bash
cd packages/backend
npm run dev
```

## Testen
```bash
npm test
```

## Build
```bash
npm run build
```

## Deployment
Zie [DEPLOYMENT.md](DEPLOYMENT.md) voor gedetailleerde deployment instructies. 