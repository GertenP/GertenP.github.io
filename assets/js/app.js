import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import { chapters } from "../../data/index.js";
import { plotFunction } from "./graph.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const root = document.getElementById("app");

const state = {
  user: null,
  progress: { flashcards: {}, practice: {} }, // flashcards: {chId: {cardId: {box, due}}}, practice: {chId: {probId: true}}
  saveTimer: null,
};

const LEITNER_DAYS = [0, 0, 1, 3, 7, 16, 30];

// ---------------- Firebase auth wiring ----------------

onAuthStateChanged(auth, async (user) => {
  state.user = user;
  if (user) {
    await loadProgress();
    render();
  } else {
    render();
  }
});

async function loadProgress() {
  try {
    const snap = await getDoc(doc(db, "users", state.user.uid));
    if (snap.exists()) {
      const d = snap.data();
      state.progress.flashcards = d.flashcards || {};
      state.progress.practice = d.practice || {};
    }
  } catch (e) {
    console.error("Progressi laadimine ebaõnnestus:", e);
  }
}

function saveProgress() {
  if (!state.user) return;
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(async () => {
    try {
      await setDoc(
        doc(db, "users", state.user.uid),
        { flashcards: state.progress.flashcards, practice: state.progress.practice, updatedAt: Date.now() },
        { merge: true }
      );
    } catch (e) {
      console.error("Progressi salvestamine ebaõnnestus:", e);
    }
  }, 500);
}

// ---------------- Router ----------------

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function getRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "dashboard" };
  if (parts[0] === "chapter" && parts[1]) {
    return { name: "chapter", chapterId: Number(parts[1]), tab: parts[2] || "theory" };
  }
  return { name: "dashboard" };
}

function navigate(hash) {
  location.hash = hash;
}

// ---------------- Render root ----------------

function render() {
  if (!state.user) {
    renderGate();
    return;
  }
  const route = getRoute();
  root.innerHTML = `
    <div class="topbar">
      <a class="brand" onclick="location.hash=''"><span>KM</span> Õpiplatvorm</a>
      <nav>
        <button id="nav-dashboard">Peatükid</button>
        <span style="color:var(--text-dim);font-size:0.85rem;">${escapeHtml(displayName(state.user.email))}</span>
        <button id="nav-logout">Logi välja</button>
      </nav>
    </div>
    <main><div class="container wide" id="main-content"></div></main>
    <footer class="foot">Kõrgema matemaatika õpiplatvorm · Gerten Pilv</footer>
  `;
  document.getElementById("nav-dashboard").onclick = () => navigate("");
  document.getElementById("nav-logout").onclick = () => signOut(auth);

  const content = document.getElementById("main-content");
  if (route.name === "dashboard") renderDashboard(content);
  else if (route.name === "chapter") renderChapterPage(content, route.chapterId, route.tab);

  renderMath(root);
}

function renderGate() {
  root.innerHTML = `
    <div class="gate-wrap">
      <div class="gate-card">
        <h1>Kõrgema matemaatika õpiplatvorm</h1>
        <p class="sub">Logi sisse, et pääseda ligi teooriale, flashcardidele ja harjutustele.</p>
        <form id="login-form">
          <input type="text" id="login-email" placeholder="E-post või kasutajanimi" autocomplete="username" required />
          <input type="password" id="login-pass" placeholder="Parool" autocomplete="current-password" required />
          <button type="submit" class="primary">Logi sisse</button>
        </form>
        <div class="gate-error" id="gate-error"></div>
      </div>
    </div>
  `;
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const raw = document.getElementById("login-email").value.trim();
    const email = resolveLoginEmail(raw);
    const pass = document.getElementById("login-pass").value;
    const errEl = document.getElementById("gate-error");
    errEl.textContent = "";
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      errEl.textContent = "Vale e-post või parool.";
    }
  });
}

// Lubab kasutajanime-aliaseid (nt "külastaja"), mis taustal vastavad päris
// Firebase Auth email+parool kontole. Vt README "Külalise konto lisamine".
const LOGIN_ALIASES = {
  külastaja: "kulastaja@kulastaja-konto.ee",
  kulastaja: "kulastaja@kulastaja-konto.ee",
};

function resolveLoginEmail(raw) {
  const alias = LOGIN_ALIASES[raw.toLowerCase()];
  return alias || raw;
}

function displayName(email) {
  if (email === LOGIN_ALIASES["külastaja"]) return "külastaja";
  return email || "";
}

// ---------------- Dashboard ----------------

function renderDashboard(el) {
  const cards = chapters
    .map((ch) => {
      const pct = chapterProgressPct(ch);
      return `
        <div class="chapter-card">
          <div class="num">${ch.id}</div>
          <div class="body">
            <h3>${escapeHtml(ch.title)}</h3>
            <div class="meta">Nädal ${ch.week} · ${ch.flashcards.length} flashcardi · ${ch.practice.problems.length} ülesannet</div>
            <div class="progress-bar"><div style="width:${pct}%"></div></div>
          </div>
          <div class="actions">
            <button class="ghost" onclick="location.hash='#/chapter/${ch.id}/theory'">Teooria</button>
            <button class="ghost" onclick="location.hash='#/chapter/${ch.id}/flashcards'">Flashcardid</button>
            <button class="ghost" onclick="location.hash='#/chapter/${ch.id}/practice'">Praktikum</button>
          </div>
        </div>`;
    })
    .join("");

  el.innerHTML = `
    <h1 class="page-title">Peatükid</h1>
    <p class="page-sub">Iga nädal lisandub uus peatükk. Alusta teooriast, tee kohe "proovi kohe" ülesanded, siis harjuta flashcardidega ja lõpeta praktikumi ülesannetega.</p>
    <div class="chapter-grid">${cards || "<p>Peatükke pole veel lisatud.</p>"}</div>
  `;
}

function chapterProgressPct(ch) {
  const fcState = state.progress.flashcards[ch.id] || {};
  const fcMastered = ch.flashcards.filter((c) => (fcState[c.id]?.box || 1) >= 5).length;
  const fcPct = ch.flashcards.length ? fcMastered / ch.flashcards.length : 0;

  const prState = state.progress.practice[ch.id] || {};
  const prDone = ch.practice.problems.filter((p) => prState[p.id]).length;
  const prPct = ch.practice.problems.length ? prDone / ch.practice.problems.length : 0;

  return Math.round(((fcPct + prPct) / 2) * 100);
}

// ---------------- Chapter page shell ----------------

function renderChapterPage(el, chapterId, tab) {
  const ch = chapters.find((c) => c.id === chapterId);
  if (!ch) {
    el.innerHTML = `<p>Peatükki ei leitud. <a href="#/">Tagasi</a></p>`;
    return;
  }
  el.innerHTML = `
    <div class="chapter-header">
      <div>
        <h1 class="page-title">${ch.id}. ${escapeHtml(ch.title)}</h1>
        <p class="page-sub" style="margin-bottom:0">${escapeHtml(ch.intro || "")}</p>
      </div>
    </div>
    <div class="tabbar">
      <button data-tab="theory" class="${tab === "theory" ? "active" : ""}">Teooria</button>
      <button data-tab="flashcards" class="${tab === "flashcards" ? "active" : ""}">Flashcardid</button>
      <button data-tab="practice" class="${tab === "practice" ? "active" : ""}">Praktikum</button>
    </div>
    <div id="tab-content"></div>
  `;
  el.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.onclick = () => navigate(`#/chapter/${chapterId}/${btn.dataset.tab}`);
  });

  const content = el.querySelector("#tab-content");
  if (tab === "theory") renderTheory(content, ch);
  else if (tab === "flashcards") renderFlashcards(content, ch);
  else if (tab === "practice") renderPractice(content, ch);
}

// ---------------- Theory ----------------

const pendingGraphs = [];

function renderTheory(el, ch) {
  pendingGraphs.length = 0;
  let html = "";
  ch.theory.forEach((section) => {
    html += `<div class="section-block"><h2>${section.id} ${escapeHtml(section.title)}</h2>`;
    section.blocks.forEach((b, i) => {
      html += renderBlock(b, `${section.id}-${i}`);
    });
    html += `</div>`;
  });
  el.innerHTML = html;
  renderMath(el);
  pendingGraphs.forEach(({ id, spec }) => {
    const c = document.getElementById(id);
    if (c) plotFunction(c, spec);
  });
}

function renderBlock(b, key) {
  switch (b.type) {
    case "text":
      return `<div class="blk blk-text">${b.html}</div>`;
    case "def":
      return `<div class="blk-def">${b.label ? `<div class="blk-label">${escapeHtml(b.label)}</div>` : ""}${b.html}</div>`;
    case "note":
      return `<div class="blk-note">${b.label ? `<div class="blk-label">${escapeHtml(b.label)}</div>` : ""}${b.html}</div>`;
    case "example":
      return `<div class="blk-example">${b.label ? `<div class="blk-label">${escapeHtml(b.label)}</div>` : ""}${b.html}</div>`;
    case "graph": {
      const id = `graph-${key}`;
      pendingGraphs.push({ id, spec: b });
      return `<canvas class="graph-canvas" id="${id}" width="480" height="300"></canvas>`;
    }
    case "check": {
      const aid = `check-${key}`;
      return `
        <div class="blk-check">
          <div class="blk-label">Proovi kohe</div>
          <div class="q">${b.q}</div>
          <button class="ghost reveal-btn" onclick="document.getElementById('${aid}').classList.toggle('hidden'); this.textContent = document.getElementById('${aid}').classList.contains('hidden') ? 'Näita vastust' : 'Peida vastus';">Näita vastust</button>
          <div class="answer hidden" id="${aid}">${b.a}</div>
        </div>`;
    }
    default:
      return "";
  }
}

// ---------------- Flashcards ----------------

let deckState = null;

function renderFlashcards(el, ch) {
  if (!state.progress.flashcards[ch.id]) state.progress.flashcards[ch.id] = {};
  const chState = state.progress.flashcards[ch.id];

  const today = todayStr();
  const due = ch.flashcards.filter((c) => {
    const cs = chState[c.id];
    return !cs || cs.due <= today;
  });

  deckState = {
    ch,
    queue: shuffle(due.slice()),
    flipped: false,
    doneCount: 0,
    total: due.length,
  };

  if (due.length === 0) {
    const masteredCount = ch.flashcards.filter((c) => (chState[c.id]?.box || 1) >= 5).length;
    el.innerHTML = `
      <div class="deck-empty">
        <p><b>Kõik selle peatüki kaardid on täna läbitud! 🎉</b></p>
        <p>${masteredCount}/${ch.flashcards.length} kaarti valdad hästi (boks 5).</p>
        <button class="primary" id="practice-anyway">Harjuta ikkagi kõiki kaarte</button>
      </div>`;
    el.querySelector("#practice-anyway").onclick = () => {
      deckState.queue = shuffle(ch.flashcards.slice());
      deckState.total = deckState.queue.length;
      deckState.freePlay = true;
      renderDeckUI(el);
    };
    return;
  }
  renderDeckUI(el);
}

function renderDeckUI(el) {
  const d = deckState;
  if (d.queue.length === 0) {
    el.innerHTML = `<div class="deck-empty"><p><b>Tubli! Kõik tänased kaardid tehtud.</b></p><button class="ghost" onclick="location.reload()">Värskenda</button></div>`;
    return;
  }
  const card = d.queue[0];
  el.innerHTML = `
    <div class="deck-wrap">
      <div class="deck-stats">Jäänud: <b>${d.queue.length}</b> &nbsp;·&nbsp; Tehtud: <b>${d.doneCount}</b>${d.total ? ` / ${d.total}` : ""}</div>
      <div class="card-stage">
        <div class="flashcard" id="fc-el">
          <div class="tag">${card.tag}</div>
          <div id="fc-content">${card.front}</div>
          <div class="hint">Kliki kaardile, et näha vastust</div>
        </div>
      </div>
      <div class="card-controls hidden" id="fc-controls">
        <button class="btn-again" data-r="again">Uuesti</button>
        <button class="btn-hard" data-r="hard">Raske</button>
        <button class="btn-good" data-r="good">Tean</button>
      </div>
    </div>
  `;
  const cardEl = document.getElementById("fc-el");
  const controls = document.getElementById("fc-controls");
  cardEl.onclick = () => {
    d.flipped = !d.flipped;
    document.getElementById("fc-content").innerHTML = d.flipped ? card.back : card.front;
    cardEl.classList.toggle("flipped", d.flipped);
    cardEl.querySelector(".hint").textContent = d.flipped ? "" : "Kliki kaardile, et näha vastust";
    controls.classList.toggle("hidden", !d.flipped);
    renderMath(cardEl);
  };
  controls.querySelectorAll("button").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      gradeCard(card, btn.dataset.r);
      d.queue.shift();
      d.doneCount++;
      d.flipped = false;
      renderDeckUI(el);
    };
  });
  renderMath(el);
}

function gradeCard(card, result) {
  const chId = deckState.ch.id;
  const chState = state.progress.flashcards[chId];
  const cur = chState[card.id] || { box: 1, due: todayStr() };
  let box = cur.box;
  if (result === "again") box = 1;
  else if (result === "hard") box = Math.max(1, box);
  else if (result === "good") box = Math.min(6, box + 1);
  const days = LEITNER_DAYS[box] ?? 30;
  chState[card.id] = { box, due: addDays(days) };
  saveProgress();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------- Practice ----------------

function renderPractice(el, ch) {
  if (!state.progress.practice[ch.id]) state.progress.practice[ch.id] = {};
  const chState = state.progress.practice[ch.id];

  let html = `<p class="page-sub">${escapeHtml(ch.practice.source)}</p>`;
  if (ch.practice.note) {
    html += `<div class="blk-note" style="margin-bottom:20px;">${escapeHtml(ch.practice.note)}</div>`;
  }
  ch.practice.problems.forEach((p) => {
    const done = !!chState[p.id];
    const subHtml = p.sub
      ? `<ul class="sub-list">${p.sub.map((s) => `<li>${s}</li>`).join("")}</ul>`
      : "";
    const answerId = `ans-${p.id}`;
    html += `
      <div class="problem">
        <div class="problem-head">
          <div><span class="problem-num">Ülesanne ${p.id}</span></div>
          <label class="done-check"><input type="checkbox" data-prob="${p.id}" ${done ? "checked" : ""}/> Tehtud</label>
        </div>
        <div class="problem-body">${p.prompt}${subHtml}</div>
        ${
          p.answer
            ? `<button class="ghost reveal-btn" onclick="document.getElementById('${answerId}').classList.toggle('hidden')">Näita vastust</button>
               <div class="problem-answer hidden" id="${answerId}">${escapeHtml(p.answer)}</div>`
            : `<div class="problem-answer no-official">Ametlikku lühivastust pole (arutlus-/joonistusülesanne) — kontrolli praktikumis.</div>`
        }
      </div>`;
  });

  el.innerHTML = html;
  el.querySelectorAll("[data-prob]").forEach((cb) => {
    cb.onchange = () => {
      chState[cb.dataset.prob] = cb.checked;
      saveProgress();
    };
  });
  renderMath(el);
}

// ---------------- Helpers ----------------

function renderMath(container) {
  if (window.renderMathInElement) {
    window.renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
