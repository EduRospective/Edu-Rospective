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
