# Kõrgema matemaatika õpiplatvorm

Staatiline HTML/CSS/JS sait (töötab otse GitHub Pages'is, ei vaja build-sammu).
Teooria, "proovi kohe" mini-ülesanded, spaced-repetition flashcardid ja praktikumi
ülesanded ühes kohas. Sisselogimine ja progress käivad Firebase kaudu.

## 1. Firebase seadistamine (tee üks kord, ~5 min)

1. Mine [console.firebase.google.com](https://console.firebase.google.com) ja loo uus **tasuta** projekt (nt `km-opiplatvorm`).
2. **Authentication** -> Get started -> luba **Email/Password** sign-in meetod.
3. Authentication -> Users -> **Add user** -> sisesta oma e-post (`gerten@reminet.ee`) ja vali endale parool. See emaili+parooli kombinatsioon ongi edaspidi lehe "lukk".
4. **Firestore Database** -> Create database -> vali **production mode** -> vali regioon (nt `eur3 (europe-west)`).
5. Firestore Database -> **Rules** -> kopeeri sisse [`firestore.rules.txt`](firestore.rules.txt) sisu -> **Publish**.
6. Project settings (hammasratas ülal) -> **Your apps** -> lisa **Web app** (`</>` ikoon) -> anna nimi -> kopeeri saadud `firebaseConfig` objekt.
7. Kleebi need väärtused faili [`assets/js/firebase-config.js`](assets/js/firebase-config.js) sisse.

Need config-väärtused pole saladus (Firebase web config on alati avalik) — turvalisus tuleb punktis 5 seatud Firestore reeglitest, mitte selle failist.

## 1b. Külalise konto lisamine (valikuline)

Sisselogimisvorm lubab kasutajanimeks kirjutada ka lihtsalt **"külastaja"** (mitte email) — koodis (`assets/js/app.js`, `LOGIN_ALIASES`) teisendatakse see automaatselt varjunimeks `kulastaja@kulastaja-konto.ee`. Selleks, et see töötaks, tee Firebase konsoolis täpselt sama, mis oma konto jaoks:

1. Authentication -> Users -> **Add user**
2. Email: `kulastaja@kulastaja-konto.ee`
3. Password: `külastaja`

Külalise progress (flashcardid, praktikum) salvestub tema enda Firestore dokumenti, eraldi sinu omast — külaline ei näe ega mõjuta sinu progressi.

## 2. Kohalik testimine

Sait kasutab ES moodulid (`import`), mistõttu tuleb seda teenindada http-serveri kaudu (mitte lihtsalt failina avada):

```bash
python3 -m http.server 8000
```

Ava seejärel `http://localhost:8000`.

## 3. GitHub Pages'i avaldamine

```bash
git add -A
git commit -m "Esimene versioon: peatükk 1"
git remote add origin https://github.com/<sinu-kasutajanimi>/<repo-nimi>.git
git push -u origin main
```

Seejärel repos: **Settings -> Pages -> Source: Deploy from branch -> `main` / `root`**.
Sait tekib aadressile `https://<kasutajanimi>.github.io/<repo-nimi>/`.

## Uue nädala peatüki lisamine

1. Kopeeri `data/chapter1.js` uueks failiks, nt `data/chapter2.js`.
2. Täida `id`, `week`, `title`, `theory`, `flashcards`, `practice` oma uue teemaga.
3. Lisa `data/index.js` faili üks import-rida ja üks rida massiivi:
   ```js
   import { chapter2 } from "./chapter2.js";
   export const chapters = [chapter1, chapter2];
   ```
4. Commit + push — GitHub Pages uueneb automaatselt paari minuti jooksul.

## Turvalisuse tähelepanek

Repo on avalik, mistõttu on kogu õppesisu (teooria/flashcardid) tehniliselt
lähtekoodist nähtav igaühele, kes seda otsib — sisselogimine kaitseb
juhuslikku sattumist lehele ja kaitseb päriselt sinu isiklikku progressi
(Firestore andmed), aga mitte õppematerjali enda sisu. See oli teadlik valik
lihtsuse ja tasuta hosting'u nimel.
