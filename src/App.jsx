# Copy to .env and fill with your Firebase project config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edurospective — Teacher MVP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

{
  "name": "edurospective-mvp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^9.0.0",
    "lucide-react": "^0.267.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.11.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.4.7",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}

# Edurospective — Teacher MVP

Aceasta este o versiune MVP pregătită pentru **profesori și echipe manageriale** (rol director/profesor/admin).
Proiectul folosește Vite + React + Tailwind (minimal config).

## Ce conține
- Dashboard (statistici)
- Șabloane PDI / POA / fișe (descărcabile)
- Chestionare evaluative (creare + export rezultate)
- Anunțuri, Calendar, Instrumente pentru directori
- Persistență locală (localStorage)
- Export/backup JSON și CSV

## Cum rulezi local (simplu)
1. Instalează dependințele:
   ```
   npm install
   ```
2. Rulează în dev:
   ```
   npm run dev
   ```
3. Construiește pentru producție:
   ```
   npm run build
   npm run preview
   ```

Notă: Tailwind este configurat; dacă apar erori la pornire, rulați `npm install` pentru a instala devDependencies.

Doresc să-ți pregătesc și varianta *hosted* (eu pot publica pe Vercel). Spune-mi dacă vrei:
- Zip-ul cu acest cod (gata — generat aici)
- Să îl public eu pe Vercel și să-ți trimit link (îți voi cere un email sau repo GitHub)


## Firebase and assets
- Assets/logo.svg and logo.png added in /assets.
- Use .env.example to set Firebase variables and rename to .env.
- Install dependencies and run `npm run dev`.

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
