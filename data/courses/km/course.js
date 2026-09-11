// Kursuse "Kõrgem matemaatika" metaandmed: hindamine, tähtajad, materjalid.
// Allikas: KM I 4. loeng (2026) slaidid "Semestri jooksul tehtavad..." + "Eksam".

export const kmCourseMeta = {
  id: "km",
  title: "Kõrgem matemaatika",
  shortTitle: "KM",
  lecturer: "Ella Puman",
  lecturerEmail: "ella.puman@ut.ee",
  term: "2026 sügissemester",
  color: "#3457d5",

  grading: [
    { label: "Tunnikontrollid (TK)", points: 8, detail: "2 tööd × 4p. Toimuvad 6. ja 15. õppenädalal, mõisted + näited mõistete kohta." },
    { label: "Kontrolltööd (KT)", points: 40, detail: "2 tööd × 20p. KT1 20.10, KT2 15.12 (Tp 14.15–16)." },
    { label: "Moodle arvestuslikud testid", points: 8, detail: "4 testi × 2p, kohustuslikud." },
    { label: "Lisapunktid", points: 10, detail: "Harjutustestid KT-deks (kuni 4p), eeltest (kuni 1p), tagasisidetest (1p), Amplify slaidid (kuni 4p)." },
    { label: "Eksam", points: 44, detail: "Kirjalik, teooria + ülesanded. Vali 1 aeg: 12.01 või 19.01 (registreeri ÕIS-is). Eksamitöö enda lävend 13p." },
  ],

  thresholds: {
    examAccess: 26,
    examAccessNote: "TK + KT + Moodle testide summa (LISAPUNKTID EI LOE siia sisse).",
    passGrade: 50,
    passGradeNote: "Eksamitöö + kõik eelnev, SIIA lähevad arvesse ka lisapunktid.",
  },

  deadlines: [
    { date: "2026-10-20", label: "Kontrolltöö 1 (KT1)" },
    { date: "2026-11-09", label: "Järeltöö võimalus 1" },
    { date: "2026-12-15", label: "Kontrolltöö 2 (KT2)" },
    { date: "2027-01-04", label: "Järeltöö võimalus 2" },
    { date: "2027-01-12", label: "Eksam — variant 1" },
    { date: "2027-01-19", label: "Eksam — variant 2" },
  ],

  resources: [
    { label: "1. loeng (Funktsioonid) — Panopto salvestus", url: "https://ut.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=cdcc630c-572d-4faf-9214-b076005dd63d" },
    { label: "Amplify Desmos keskkond (klassikood M2G4K2)", url: "https://learning.amplify.com/join/#/M2G4K2" },
  ],

  // Allikas: "Kõrgema matemaatika täiendusõppeprogrammi 3 EAP ajakava
  // (LTMS.00.003TÕ, LTMS.TK.033) 2026" — 16 õppenädalat.
  schedule: [
    { week: 1, dates: "01.09–06.09", note: "Avaldiste sisestamise harjutustest avaneb (Moodle, ei anna punkte, ajalist piirangut ei ole)." },
    {
      week: 2, dates: "07.09–13.09",
      theme: "1. teema — Funktsioonid ja nende graafikud",
      practicum: "1. praktikum 08.09 kl 18.15–20",
      tasks: "Ülesanded 1.4, 1.6, 1.9 b,e,f, 1.10, 1.11 a,c",
      events: ["Eeltest matemaatikas — kuni 1 lisapunkt (08.09 20.00 – 20.09 22.00)"],
    },
    {
      week: 3, dates: "14.09–20.09",
      practicum: "2. praktikum 15.09 kl 18.15–20",
      tasks: "Pöördfunktsioon, eksponent- ja logaritmfunktsioonid. Ülesanded 2.1 c,d,e, 2.2 a,b,c,f, 2.3a, 2.4a, 2.6, 2.8 (valik), 2.9 (valik)",
    },
    {
      week: 4, dates: "21.09–27.09",
      theme: "2. teema — Funktsiooni piirväärtus ja pidevus. Tuletise definitsioon",
      practicum: "3. praktikum 22.09 kl 18.15–20",
      tasks: "Piirväärtuste arvutamine. Ülesanded 3.1, 3.5 c,d,i, 3.6 c,d,h, 3.7f, 3.8 a,b,d",
      events: ["Arvestuslik test 1 — Funktsioonid, piirväärtus (15.09 16.00 – 28.09 22.00)"],
    },
    {
      week: 5, dates: "28.09–04.10",
      practicum: "4. praktikum 29.09 kl 18.15–20",
      tasks: "Piirväärtus ja pidevus, tuletise definitsioon. Ülesanded 3.9 a,b,e,l,m, 4.1 b,e, 4.8, 4.10d, 4.11 a,b,c, 4.13b",
      events: ["Arvestuslik test 2 (30.09 10.00 – 12.10 22.00)"],
    },
    {
      week: 6, dates: "05.10–11.10",
      theme: "3. teema — Funktsiooni tuletis, rakendused ja diferentsiaal",
      practicum: "5. praktikum 06.10",
      tasks: "Tuletis, liitfunktsiooni tuletis. Ülesanded 5.1e, 5.2 b,e,h, 5.9 b,d,g, 5.17b, 5.19 b,d",
      events: ["Tunnikontroll 1 (5. praktikumi järel, Moodle test, 20 min)"],
    },
    {
      week: 7, dates: "12.10–18.10",
      practicum: "6. praktikum 13.10 kl 18.15–20",
      tasks: "L'Hospitali reegel, diferentsiaal. Ülesanded 6.1e, 6.2c, 6.3 c,f, 6.4c, 6.5–6.8 (1 valik), 6.9 e,h",
      events: ["Kontrolltöö 1 harjutustest (12.10 10.00 – 26.10 22.00)"],
    },
    {
      week: 8, dates: "19.10–25.10",
      theme: "4. teema — Funktsiooni uurimine. Määramata integraal",
      practicum: "7. praktikum 20.10 kl 18.15–20",
      tasks: "Ekstreemumid, asümptoodid. Ülesanded 7.1, 7.6d, 7.7a, 7.8 a,d, 7.15b, 1 ül 7.9–7.13 seast",
      events: ["KONTROLLTÖÖ 1 (eraldi kokkulepitud ajal, Delta majas)"],
    },
    {
      week: 9, dates: "26.10–01.11",
      practicum: "8. praktikum 27.10 kl 18.15–20",
      tasks: "Algfunktsioon, määramata integraal, muutujavahetus. Ülesanded 8.1, 8.4h, 8.5a, 8.6 b,d, 8.7d, 8.9g, 8.10 b,d, 8.12f, 8.15 a,c",
    },
    {
      week: 10, dates: "02.11–08.11",
      theme: "5. teema — Määramata integraal. Harilikud diferentsiaalvõrrandid",
      practicum: "9. praktikum 03.11 kl 18.15–20",
      tasks: "Ositi integreerimine, ratsionaalfunktsioonide integreerimine. Ülesanded 8.9 e,f, 9.1 b,c,d,h, 9.2a, 9.5 a,d",
    },
    {
      week: 11, dates: "09.11–15.11",
      practicum: "10. praktikum 10.11 kl 18.15–20",
      tasks: "Eraldatud ja eralduvate muutujatega diferentsiaalvõrrandid. Ülesanded 10.1, 10.2, 10.3, 10.4e, 10.5f, 10.6 a,f, 10.7b, 1 ül 10.8–10.16",
      events: ["Järeltöö 1 — 09.11 kell 18–20 Delta majas (registreeri ÕIS-is)"],
    },
    {
      week: 12, dates: "16.11–22.11",
      theme: "6. teema — Lineaarsed 1. järku diferentsiaalvõrrandid. Maatriksid",
      practicum: "11. praktikum 17.11 kl 18.15–20",
      tasks: "Lineaarsed 1. järku diferentsiaalvõrrandid. Ülesanded 11.1, 11.2 a,b,g,i,q",
      events: ["Arvestuslik test 3 (18.11 10.00 – 30.11 22.00)"],
    },
    {
      week: 13, dates: "24.11–30.11",
      practicum: "12. praktikum 25.11 kl 18.15–20",
      tasks: "Tehted maatriksitega. Ülesanded 12.2, 12.4 a,b,c,d, 12.5 a,b,c,f,k,l, 12.10 b,d,n,o,p, 12.11 e,f,o,p",
    },
    {
      week: 14, dates: "30.11–06.12",
      theme: "7. teema — Maatriksid. Determinandid. Pöördmaatriks",
      practicum: "13. praktikum 01.12 kl 18.15–20",
      tasks: "Determinandid, põhiomadused, arendamine. Ülesanded 13.2, 13.6c, 13.7, 13.8a",
    },
    {
      week: 15, dates: "07.12–13.12",
      practicum: "14. praktikum 08.12 kl 18.15–20",
      tasks: "Pöördmaatriks, maatriksvõrrandite lahendamine. Ülesanded 14.1 a,b, 14.6b, 14.7a, 14.8b, 14.11a, 14.12 b,g, 14.13d",
      events: ["Tunnikontroll 2 (14. praktikumi järel, 20 min)", "Kontrolltöö 2 harjutustest (07.12 10.00 – 04.01 22.00)"],
    },
    {
      week: 16, dates: "14.12–20.12",
      theme: "8. teema — Lineaarvõrrandisüsteemid. Maatriksi astak",
      practicum: "15. praktikum 15.12 kl 18.15–20",
      tasks: "Gaussi meetod, üld- ja erilahend. Ülesanded 15.1, 15.2c, 15.3 a,b,f,h, 15.4h, 15.5a, 15.6c, 15.7a",
      events: [
        "KONTROLLTÖÖ 2 (eraldi kokkulepitud ajal, Delta majas)",
        "Arvestuslik test 4 (16.12 10.00 – 04.01 22.00)",
        "Lisatest tagasiside andmiseks — kuni 1 lisapunkt (15.12–10.01)",
      ],
    },
    {
      week: 17, dates: "jaanuar",
      note: "Järeltöö 2 — 04.01 kell 14.15 (ÕIS). Järeltöid 1 ja 2 saab teha jaanuaris kokkulepitud aegadel Delta majas. Eksam (teooria + viimase praktikumi ülesanded) toimub jaanuaris kokkulepitud ajal Delta majas — vali ÕIS-is 12.01 või 19.01.",
    },
  ],
};
