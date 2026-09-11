// Täida need väärtused oma Firebase projekti konsoolist:
// Project settings -> General -> "Your apps" -> Web app -> SDK setup and configuration -> Config
//
// Need väärtused EI OLE saladus (Firebase web config on alati avalik, ka teistel
// päris toodetel) - turvalisus tuleb Firestore reeglitest (vt firestore.rules.txt),
// mitte selle faili salastamisest.

export const firebaseConfig = {
  apiKey: "AIzaSyC6uQ9J6q1TslNUEtSSCbb2WL25Zf4iUeM",
  authDomain: "matemaatika.firebaseapp.com",
  projectId: "matemaatika",
  storageBucket: "matemaatika.firebasestorage.app",
  messagingSenderId: "332111856463",
  appId: "1:332111856463:web:462c48c8a6cc2f587c7b3a",
  measurementId: "G-VJ9R1GMHD5",
};
