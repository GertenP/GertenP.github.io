# Gerteni Õpikeskkond

Staatiline HTML/CSS/JS sait (töötab otse GitHub Pages'is, ei vaja build-sammu).
Isiklik Moodle-taoline õpikeskkond, kus iga **kursus** (nt Kõrgem matemaatika)
koosneb peatükkidest: teooria + "proovi kohe" mini-ülesanded (koos
kindlustunde-hinnanguga ja mõnel juhul graafikuga), spaced-repetition
flashcardid ja praktikumi ülesanded. Sisselogimine ja progress käivad
Firebase kaudu.

**Avaleht**: ülekursuseline "täna kordamiseks" flashcard-vidin, lähenevad
tähtajad, päevaülesanded (juhuslikud, kuid päeva sees püsivad ülesanded
jooksva nädala teemal) ja kursuste nimekiri.

**Kursuse leht**: hindamissüsteem, tähtajad, materjalid, punktikalkulaator,
täielik 16-nädalane **ajakava** ning **mini-kontrolltöö simulatsioon**
(ajapiiranguga, segatud ülesannetega, enesehindamisega tulemuste juures).

**Peatüki leht** (4 vahekaarti):
- *Teooria* — definitsioonid/näited/graafikud + "Lihtsamalt öeldes" ja
  "Levinud viga" plokid + eelloengu checklist üleval + "Minu märkmed" all.
- *Flashcardid* — Leitner-tüüpi kordamine, valitav "Tänased" / "Kõik kaardid".
- *Praktikum* — kõik ülesanded (ka ilma ametliku vastuseta, ausalt märgitud),
  "🎲 juhuslik valik" nupp.
- *Spikker* — automaatselt kogunev kordamisleht valdatud (boks 5) kaartidest.

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

## Uue nädala peatüki lisamine (olemasolevasse kursusesse)

1. Kopeeri `data/courses/km/chapter1.js` uueks failiks, nt `data/courses/km/chapter2.js`.
2. Täida `id`, `week`, `title`, `theory`, `flashcards`, `practice` oma uue teemaga.
3. `data/courses/km/index.js` failis lisa import ja rida massiivi:
   ```js
   import { chapter2 } from "./chapter2.js";
   export const kmCourse = { meta: kmCourseMeta, chapters: [chapter1, chapter2] };
   ```
4. Commit + push — GitHub Pages uueneb automaatselt paari minuti jooksul.

## Uue kursuse lisamine (nt teine aine)

1. Loo kaust `data/courses/<kursuse-id>/` (nt `data/courses/fyysika/`).
2. Loo selles `course.js` (kopeeri `data/courses/km/course.js` eeskujuks — title,
   lecturer, grading, thresholds, deadlines, resources), vähemalt üks `chapter1.js`
   (kopeeri struktuur `km/chapter1.js` eeskujuks) ja `index.js`, mis need kokku pakib.
3. `data/index.js` failis impordi uus kursus ja lisa massiivi:
   ```js
   import { fyysikaCourse } from "./courses/fyysika/index.js";
   export const courses = [kmCourse, fyysikaCourse];
   ```
4. Commit + push. Uus kursus ilmub automaatselt avalehele ja ülekursuselisse
   tänasesse kordamisse.

## Turvalisuse tähelepanek

Repo on avalik, mistõttu on kogu õppesisu (teooria/flashcardid) tehniliselt
lähtekoodist nähtav igaühele, kes seda otsib — sisselogimine kaitseb
juhuslikku sattumist lehele ja kaitseb päriselt sinu isiklikku progressi
(Firestore andmed), aga mitte õppematerjali enda sisu. See oli teadlik valik
lihtsuse ja tasuta hosting'u nimel.
