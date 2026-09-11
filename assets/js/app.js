import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import { courses } from "../../data/index.js";
import { plotFunction } from "./graph.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const root = document.getElementById("app");

const state = {
  user: null,
  // progress.courses[courseId] = { flashcards: {chId:{cardId:{box,due}}}, practice: {chId:{probId:true}}, points: {tk1,tk2,kt1,kt2,testid,lisa} }
  progress: { courses: {} },
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
      if (d.courses) {
        state.progress.courses = d.courses;
      } else if (d.flashcards || d.practice) {
        // Vana (kursuseta) andmekuju - migreeri "km" kursuse alla.
        state.progress.courses = { km: { flashcards: d.flashcards || {}, practice: d.practice || {}, points: {} } };
        saveProgress();
      }
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
        { courses: state.progress.courses, updatedAt: Date.now() },
        { merge: true }
      );
    } catch (e) {
      console.error("Progressi salvestamine ebaõnnestus:", e);
    }
  }, 500);
}

function courseState(courseId) {
  if (!state.progress.courses[courseId]) {
    state.progress.courses[courseId] = { flashcards: {}, practice: {}, points: {} };
  }
  const cs = state.progress.courses[courseId];
  if (!cs.flashcards) cs.flashcards = {};
  if (!cs.practice) cs.practice = {};
  if (!cs.points) cs.points = {};
  if (!cs.prep) cs.prep = {};
  if (!cs.notes) cs.notes = {};
  return cs;
}

function findCourse(courseId) {
  return courses.find((c) => c.meta.id === courseId);
}
function findChapter(course, chapterId) {
  return course && course.chapters.find((c) => c.id === chapterId);
}

// ---------------- Router ----------------

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function getRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "review") return { name: "review" };
  if (parts[0] === "course" && parts[1]) {
    if (parts[2] === "chapter" && parts[3]) {
      return { name: "chapter", courseId: parts[1], chapterId: Number(parts[3]), tab: parts[4] || "theory" };
    }
    if (parts[2] === "ajakava") return { name: "ajakava", courseId: parts[1] };
    if (parts[2] === "exam") return { name: "exam", courseId: parts[1] };
    return { name: "course", courseId: parts[1] };
  }
  return { name: "home" };
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
      <a class="brand" onclick="location.hash=''"><span>Gerteni</span> Õpikeskkond</a>
      <nav>
        <button id="nav-home">Avaleht</button>
        <span style="color:var(--text-dim);font-size:0.85rem;">${escapeHtml(displayName(state.user.email))}</span>
        <button id="nav-logout">Logi välja</button>
      </nav>
    </div>
    <main><div class="container wide" id="main-content"></div></main>
    <footer class="foot">Gerteni Õpikeskkond · isiklik õpiplatvorm</footer>
  `;
  document.getElementById("nav-home").onclick = () => navigate("");
  document.getElementById("nav-logout").onclick = () => signOut(auth);

  const content = document.getElementById("main-content");
  if (route.name === "home") renderHome(content);
  else if (route.name === "review") renderReviewPage(content);
  else if (route.name === "course") renderCoursePage(content, route.courseId);
  else if (route.name === "ajakava") renderAjakavaPage(content, route.courseId);
  else if (route.name === "exam") renderExamPage(content, route.courseId);
  else if (route.name === "chapter") renderChapterPage(content, route.courseId, route.chapterId, route.tab);

  renderMath(root);
}

function renderGate() {
  root.innerHTML = `
    <div class="gate-wrap">
      <div class="gate-card">
        <h1>Gerteni Õpikeskkond</h1>
        <p class="sub">Logi sisse, et pääseda ligi kursustele, flashcardidele ja harjutustele.</p>
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

// ---------------- Home ----------------

function renderHome(el) {
  const dueItems = buildAllDueItems();
  const dueCount = dueItems.length;

  const upcoming = allUpcomingDeadlines(3);

  const courseCards = courses
    .map((course) => {
      const pct = courseProgressPct(course);
      const chCount = course.chapters.length;
      return `
        <div class="chapter-card" onclick="location.hash='#/course/${course.meta.id}'" style="cursor:pointer;border-left:4px solid ${course.meta.color || "var(--accent)"}">
          <div class="body">
            <h3>${escapeHtml(course.meta.title)}</h3>
            <div class="meta">${chCount} peatükki · ${escapeHtml(course.meta.term || "")}</div>
            <div class="progress-bar"><div style="width:${pct}%"></div></div>
          </div>
        </div>`;
    })
    .join("");

  el.innerHTML = `
    <h1 class="page-title">Tere, ${escapeHtml(firstName(state.user.email))}!</h1>
    <p class="page-sub">Sinu isiklik õpikeskkond — kõik kursused, flashcardid ja praktikumid ühes kohas.</p>

    <div class="today-widget">
      <div>
        <div class="today-count">${dueCount}</div>
        <div class="today-label">${dueCount === 1 ? "kaart on täna kordamiseks" : "kaarti on täna kordamiseks"}</div>
      </div>
      <button class="primary" id="start-review" ${dueCount === 0 ? "disabled" : ""}>Alusta tänast kordamist</button>
    </div>

    ${
      upcoming.length
        ? `<div class="deadline-widget">
            <div class="deadline-widget-title">Lähenevad tähtajad</div>
            ${upcoming.map((d) => `<div class="deadline-row"><span>${escapeHtml(d.label)}</span><span class="deadline-date">${formatDate(d.date)}</span></div>`).join("")}
          </div>`
        : ""
    }

    <div id="daily-widgets"></div>

    <h2 style="margin:32px 0 14px;">Kursused</h2>
    <div class="chapter-grid">${courseCards || "<p>Kursuseid pole veel lisatud.</p>"}</div>
  `;
  const btn = document.getElementById("start-review");
  if (btn) btn.onclick = () => navigate("#/review");

  renderDailyWidgets(document.getElementById("daily-widgets"));
}

// ---------------- Päevaülesanded ----------------

function currentChapterForCourse(course) {
  if (!course.chapters.length) return null;
  const today = todayStr();
  let currentWeekNum = null;
  (course.meta.schedule || []).forEach((w) => {
    if (w.dates && isCurrentWeek(w.dates, today)) currentWeekNum = w.week;
  });
  if (currentWeekNum === null) {
    let best = null;
    (course.meta.schedule || []).forEach((w) => {
      const m = w.dates && w.dates.match(/(\d{2})\.(\d{2})/);
      if (!m) return;
      const year = Number(today.slice(0, 4));
      const start = `${year}-${m[2]}-${m[1]}`;
      if (start <= today) best = w.week;
    });
    currentWeekNum = best ?? course.chapters[0].week;
  }
  let chosen = null;
  course.chapters.forEach((ch) => {
    if (ch.week <= currentWeekNum && (!chosen || ch.week > chosen.week)) chosen = ch;
  });
  return chosen || course.chapters[0];
}

function seededShuffle(arr, seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderDailyWidgets(el) {
  if (!el) return;
  let html = "";
  courses.forEach((course) => {
    const ch = currentChapterForCourse(course);
    if (!ch) return;
    const pool = ch.practice.problems.filter((p) => p.answer);
    if (pool.length === 0) return;
    const seed = todayStr() + "-" + course.meta.id + "-" + ch.id;
    const picked = seededShuffle(pool, seed).slice(0, 3);
    const cs = courseState(course.meta.id);
    if (!cs.practice[ch.id]) cs.practice[ch.id] = {};
    const chState = cs.practice[ch.id];

    html += `
      <div class="daily-widget" data-course="${course.meta.id}" data-chapter="${ch.id}">
        <div class="daily-widget-head">
          <h3>📌 Päevaülesanded — ${escapeHtml(course.meta.title)}</h3>
          <a href="#/course/${course.meta.id}/chapter/${ch.id}/practice" style="font-size:0.8rem;color:var(--text-dim);">kõik ülesanded →</a>
        </div>
        <p class="daily-widget-sub">${escapeHtml(ch.title)} (peatükk ${ch.id}) — tänaseks valitud, vahetub homme.</p>
        ${picked
          .map((p) => {
            const done = !!chState[p.id];
            const subHtml = p.sub ? `<ul class="sub-list">${p.sub.map((s) => `<li>${s}</li>`).join("")}</ul>` : "";
            const answerId = `daily-ans-${course.meta.id}-${ch.id}-${p.id}`;
            return `
              <div class="problem">
                <div class="problem-head">
                  <span class="problem-num">Ülesanne ${p.id}</span>
                  <label class="done-check"><input type="checkbox" data-daily-prob="${p.id}" data-daily-ch="${ch.id}" data-daily-course="${course.meta.id}" ${done ? "checked" : ""}/> Tehtud</label>
                </div>
                <div class="problem-body">${p.prompt}${subHtml}</div>
                <button class="ghost reveal-btn" onclick="document.getElementById('${answerId}').classList.toggle('hidden')">Näita vastust</button>
                <div class="problem-answer hidden" id="${answerId}">${escapeHtml(p.answer)}</div>
              </div>`;
          })
          .join("")}
      </div>`;
  });
  el.innerHTML = html;
  el.querySelectorAll("[data-daily-prob]").forEach((cb) => {
    cb.onchange = () => {
      const cs2 = courseState(cb.dataset.dailyCourse);
      if (!cs2.practice[cb.dataset.dailyCh]) cs2.practice[cb.dataset.dailyCh] = {};
      cs2.practice[cb.dataset.dailyCh][cb.dataset.dailyProb] = cb.checked;
      saveProgress();
    };
  });
  renderMath(el);
}

function firstName(email) {
  if (email === LOGIN_ALIASES["külastaja"]) return "külastaja";
  const guess = (email || "").split("@")[0];
  return guess ? guess.charAt(0).toUpperCase() + guess.slice(1) : "";
}

function allUpcomingDeadlines(limit) {
  const today = todayStr();
  const all = [];
  courses.forEach((c) => (c.meta.deadlines || []).forEach((d) => all.push(d)));
  return all
    .filter((d) => d.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, limit);
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function courseProgressPct(course) {
  if (!course.chapters.length) return 0;
  const total = course.chapters.reduce((sum, ch) => sum + chapterProgressPct(course.meta.id, ch), 0);
  return Math.round(total / course.chapters.length);
}

// ---------------- Course overview page ----------------

function renderCoursePage(el, courseId) {
  const course = findCourse(courseId);
  if (!course) {
    el.innerHTML = `<p>Kursust ei leitud. <a href="#/">Tagasi</a></p>`;
    return;
  }
  const meta = course.meta;
  const cs = courseState(courseId);

  const gradingRows = (meta.grading || [])
    .map((g) => `<div class="grading-row"><span>${escapeHtml(g.label)}</span><b>${g.points}p</b><span class="grading-detail">${escapeHtml(g.detail || "")}</span></div>`)
    .join("");

  const deadlineRows = (meta.deadlines || [])
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((d) => {
      const past = d.date < todayStr();
      return `<div class="deadline-row${past ? " past" : ""}"><span>${escapeHtml(d.label)}</span><span class="deadline-date">${formatDate(d.date)}</span></div>`;
    })
    .join("");

  const resourceRows = (meta.resources || [])
    .map((r) => `<a class="resource-link" href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.label)} ↗</a>`)
    .join("");

  const chapterCards = course.chapters
    .map((ch) => {
      const pct = chapterProgressPct(courseId, ch);
      return `
        <div class="chapter-card">
          <div class="num">${ch.id}</div>
          <div class="body">
            <h3>${escapeHtml(ch.title)}</h3>
            <div class="meta">Nädal ${ch.week} · ${ch.flashcards.length} flashcardi · ${ch.practice.problems.length} ülesannet</div>
            <div class="progress-bar"><div style="width:${pct}%"></div></div>
          </div>
          <div class="actions">
            <button class="ghost" onclick="location.hash='#/course/${courseId}/chapter/${ch.id}/theory'">Teooria</button>
            <button class="ghost" onclick="location.hash='#/course/${courseId}/chapter/${ch.id}/flashcards'">Flashcardid</button>
            <button class="ghost" onclick="location.hash='#/course/${courseId}/chapter/${ch.id}/practice'">Praktikum</button>
            <button class="ghost" onclick="location.hash='#/course/${courseId}/chapter/${ch.id}/spikker'">Spikker</button>
          </div>
        </div>`;
    })
    .join("");

  const th = meta.thresholds || {};
  const pk = cs.points;
  const examSum = numOr0(pk.tk1) + numOr0(pk.tk2) + numOr0(pk.kt1) + numOr0(pk.kt2) + numOr0(pk.testid);
  const totalSum = examSum + numOr0(pk.lisa) + numOr0(pk.eksam);

  el.innerHTML = `
    <p style="margin-bottom:4px;"><a href="#/" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;">← Avaleht</a></p>
    <h1 class="page-title">${escapeHtml(meta.title)}</h1>
    <p class="page-sub">${escapeHtml(meta.lecturer || "")}${meta.lecturerEmail ? ` · ${escapeHtml(meta.lecturerEmail)}` : ""} · ${escapeHtml(meta.term || "")}</p>

    <div class="course-toolbar">
      ${meta.schedule ? `<button class="ghost" onclick="location.hash='#/course/${courseId}/ajakava'">📅 Ajakava</button>` : ""}
      <button class="ghost" onclick="location.hash='#/course/${courseId}/exam'">⏱ Mini-kontrolltöö simulatsioon</button>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h3>Hindamine</h3>
        ${gradingRows || "<p>Hindamise info pole lisatud.</p>"}
      </div>
      <div class="info-box">
        <h3>Tähtajad</h3>
        ${deadlineRows || "<p>Tähtaegu pole lisatud.</p>"}
      </div>
    </div>

    ${resourceRows ? `<div class="info-box" style="margin-bottom:24px;"><h3>Materjalid</h3><div class="resource-list">${resourceRows}</div></div>` : ""}

    <div class="info-box calc-box" style="margin-bottom:32px;">
      <h3>Punktikalkulaator</h3>
      <div class="calc-grid">
        ${calcInput("tk1", "TK1", 0, 4, pk.tk1)}
        ${calcInput("tk2", "TK2", 0, 4, pk.tk2)}
        ${calcInput("kt1", "KT1", 0, 20, pk.kt1)}
        ${calcInput("kt2", "KT2", 0, 20, pk.kt2)}
        ${calcInput("testid", "Moodle testid", 0, 8, pk.testid)}
        ${calcInput("lisa", "Lisapunktid", 0, 10, pk.lisa)}
        ${calcInput("eksam", "Eksam", 0, 44, pk.eksam)}
      </div>
      <div class="calc-results">
        <div class="calc-result-row">
          <span>Eksamile pääsemiseks (ilma lisapunktideta)</span>
          <b>${examSum} / ${th.examAccess ?? "?"}</b>
        </div>
        <div class="progress-bar"><div style="width:${pctClamp(examSum, th.examAccess)}%;background:${examSum >= (th.examAccess || 0) ? "var(--good)" : "var(--accent)"}"></div></div>
        <div class="calc-result-row" style="margin-top:14px;">
          <span>Positiivseks hindeks kokku (koos lisapunktide ja eksamiga)</span>
          <b>${totalSum} / ${th.passGrade ?? "?"}</b>
        </div>
        <div class="progress-bar"><div style="width:${pctClamp(totalSum, th.passGrade)}%;background:${totalSum >= (th.passGrade || 0) ? "var(--good)" : "var(--accent)"}"></div></div>
      </div>
    </div>

    <h2 style="margin:0 0 14px;">Peatükid</h2>
    <div class="chapter-grid">${chapterCards || "<p>Peatükke pole veel lisatud.</p>"}</div>
  `;

  el.querySelectorAll("[data-pk]").forEach((inp) => {
    inp.oninput = () => {
      const v = inp.value === "" ? "" : Number(inp.value);
      cs.points[inp.dataset.pk] = v;
      saveProgress();
      renderCoursePage(el, courseId);
    };
  });
}

function calcInput(key, label, min, max, val) {
  return `<label class="calc-field">${label}<input type="number" min="${min}" max="${max}" data-pk="${key}" value="${val ?? ""}" placeholder="0" /></label>`;
}
function numOr0(v) {
  return typeof v === "number" && !isNaN(v) ? v : 0;
}
function pctClamp(v, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, Math.round((v / max) * 100)));
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

// ---------------- Ajakava ----------------

function renderAjakavaPage(el, courseId) {
  const course = findCourse(courseId);
  if (!course || !course.meta.schedule) {
    el.innerHTML = `<p>Ajakava pole lisatud. <a href="#/course/${courseId}">Tagasi</a></p>`;
    return;
  }
  const today = todayStr();
  const rows = course.meta.schedule
    .map((w) => {
      const isCurrent = isCurrentWeek(w.dates, today);
      return `
        <div class="week-row${isCurrent ? " current" : ""}">
          <div class="week-num">${w.week}. nädal</div>
          <div class="week-body">
            <div class="week-dates">${escapeHtml(w.dates)}</div>
            ${w.theme ? `<div class="week-theme">${escapeHtml(w.theme)}</div>` : ""}
            ${w.practicum ? `<div class="week-practicum">${escapeHtml(w.practicum)}</div>` : ""}
            ${w.tasks ? `<div class="week-tasks">${escapeHtml(w.tasks)}</div>` : ""}
            ${(w.events || []).map((e) => `<div class="week-event">⚑ ${escapeHtml(e)}</div>`).join("")}
            ${w.note ? `<div class="week-note">${escapeHtml(w.note)}</div>` : ""}
          </div>
        </div>`;
    })
    .join("");

  el.innerHTML = `
    <p style="margin-bottom:4px;"><a href="#/course/${courseId}" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;">← ${escapeHtml(course.meta.title)}</a></p>
    <h1 class="page-title">Ajakava</h1>
    <p class="page-sub">Kõik õppenädalad, praktikumid, ülesanded ja tähtajad ühes kohas.</p>
    <div class="week-list">${rows}</div>
  `;
}

function isCurrentWeek(dates, todayIso) {
  const m = dates.match(/(\d{2})\.(\d{2})–(\d{2})\.(\d{2})/);
  if (!m) return false;
  const year = Number(todayIso.slice(0, 4));
  const start = `${year}-${m[2]}-${m[1]}`;
  const end = `${year}-${m[4]}-${m[3]}`;
  return todayIso >= start && todayIso <= end;
}

// ---------------- Mini-kontrolltöö simulatsioon ----------------

let examState = null;
let examTimerId = null;

function renderExamPage(el, courseId) {
  const course = findCourse(courseId);
  if (!course) {
    el.innerHTML = `<p>Kursust ei leitud.</p>`;
    return;
  }
  const pool = [];
  course.chapters.forEach((ch) => {
    ch.practice.problems.forEach((p) => {
      if (p.answer) pool.push({ ch, p });
    });
  });

  if (pool.length === 0) {
    el.innerHTML = `<p>Selles kursuses pole veel piisavalt vastustega ülesandeid mini-kontrolltöö jaoks.</p><a href="#/course/${courseId}">Tagasi</a>`;
    return;
  }

  const count = Math.min(8, pool.length);
  const chosen = shuffle(pool.slice()).slice(0, count);
  const durationSec = Math.max(600, count * 150);

  examState = { chosen, durationSec, remaining: durationSec, finished: false, selfCorrect: {} };
  renderExamUI(el, courseId);

  clearInterval(examTimerId);
  examTimerId = setInterval(() => {
    if (!examState || examState.finished) {
      clearInterval(examTimerId);
      return;
    }
    examState.remaining--;
    const timerEl = document.getElementById("exam-timer");
    if (timerEl) timerEl.textContent = formatTimer(examState.remaining);
    if (examState.remaining <= 0) {
      finishExam(el, courseId);
    }
  }, 1000);
}

function renderExamUI(el, courseId) {
  const problemsHtml = examState.chosen
    .map(({ ch, p }, i) => {
      const subHtml = p.sub ? `<ul class="sub-list">${p.sub.map((s) => `<li>${s}</li>`).join("")}</ul>` : "";
      return `
        <div class="problem">
          <div class="problem-head"><span class="problem-num">${i + 1}. (${escapeHtml(ch.title)}, ül. ${p.id})</span></div>
          <div class="problem-body">${p.prompt}${subHtml}</div>
        </div>`;
    })
    .join("");

  el.innerHTML = `
    <p style="margin-bottom:4px;"><a href="#/course/${courseId}" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;">← ${escapeHtml(findCourse(courseId).meta.title)}</a></p>
    <h1 class="page-title">Mini-kontrolltöö simulatsioon</h1>
    <p class="page-sub">${examState.chosen.length} ülesannet segatud kõigist läbitud peatükkidest. Proovi lahendada ilma vastuseid vaatamata — ajapiirang aitab harjutada päris kontrolltöö tempoga.</p>
    <div class="exam-toolbar">
      <div class="exam-timer" id="exam-timer">${formatTimer(examState.remaining)}</div>
      <button class="primary" id="exam-finish">Lõpeta ja näita vastuseid</button>
    </div>
    <div id="exam-problems">${problemsHtml}</div>
  `;
  document.getElementById("exam-finish").onclick = () => finishExam(el, courseId);
  renderMath(el);
}

function finishExam(el, courseId) {
  if (!examState || examState.finished) return;
  examState.finished = true;
  clearInterval(examTimerId);

  const problemsHtml = examState.chosen
    .map(({ ch, p }, i) => {
      const subHtml = p.sub ? `<ul class="sub-list">${p.sub.map((s) => `<li>${s}</li>`).join("")}</ul>` : "";
      return `
        <div class="problem">
          <div class="problem-head">
            <span class="problem-num">${i + 1}. (${escapeHtml(ch.title)}, ül. ${p.id})</span>
            <label class="done-check"><input type="checkbox" data-exam-i="${i}" /> Sain õigesti</label>
          </div>
          <div class="problem-body">${p.prompt}${subHtml}</div>
          <div class="problem-answer">${escapeHtml(p.answer)}</div>
        </div>`;
    })
    .join("");

  el.innerHTML = `
    <p style="margin-bottom:4px;"><a href="#/course/${courseId}" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;">← ${escapeHtml(findCourse(courseId).meta.title)}</a></p>
    <h1 class="page-title">Tulemused</h1>
    <p class="page-sub">Aeg läbi! Vaata vastuseid ja märgi, mis sul õigesti läks.</p>
    <div class="exam-score-box"><span id="exam-score">0</span> / ${examState.chosen.length} õigesti</div>
    <div id="exam-problems">${problemsHtml}</div>
    <button class="ghost" onclick="location.hash='#/course/${courseId}/exam'" style="margin-top:16px;">Proovi uue ülesannete valikuga uuesti</button>
  `;
  el.querySelectorAll("[data-exam-i]").forEach((cb) => {
    cb.onchange = () => {
      const score = el.querySelectorAll("[data-exam-i]:checked").length;
      document.getElementById("exam-score").textContent = score;
    };
  });
  renderMath(el);
}

function formatTimer(sec) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// ---------------- Chapter page shell ----------------

function renderChapterPage(el, courseId, chapterId, tab) {
  const course = findCourse(courseId);
  const ch = findChapter(course, chapterId);
  if (!course || !ch) {
    el.innerHTML = `<p>Peatükki ei leitud. <a href="#/">Tagasi</a></p>`;
    return;
  }
  el.innerHTML = `
    <p style="margin-bottom:4px;"><a href="#/course/${courseId}" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;">← ${escapeHtml(course.meta.title)}</a></p>
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
      <button data-tab="spikker" class="${tab === "spikker" ? "active" : ""}">Spikker</button>
    </div>
    <div id="tab-content"></div>
  `;
  el.querySelectorAll(".tabbar button").forEach((btn) => {
    btn.onclick = () => navigate(`#/course/${courseId}/chapter/${chapterId}/${btn.dataset.tab}`);
  });

  const content = el.querySelector("#tab-content");
  if (tab === "theory") renderTheory(content, courseId, ch);
  else if (tab === "flashcards") renderChapterFlashcards(content, courseId, ch);
  else if (tab === "practice") renderPractice(content, courseId, ch);
  else if (tab === "spikker") renderCheatSheet(content, courseId, ch);
}

// ---------------- Theory ----------------

const pendingGraphs = [];

function renderTheory(el, courseId, ch) {
  pendingGraphs.length = 0;
  const cs = courseState(courseId);
  if (!cs.prep) cs.prep = {};
  if (!cs.notes) cs.notes = {};
  const prepState = cs.prep[ch.id] || (cs.prep[ch.id] = {});
  const prepDone = ch.theory.filter((s) => prepState[s.id]).length;

  let html = `
    <div class="prep-box">
      <div class="prep-head">
        <b>Enne loengut</b>
        <span class="prep-count">${prepDone} / ${ch.theory.length} läbitud</span>
      </div>
      <div class="prep-list">
        ${ch.theory.map((s) => `
          <label class="prep-item">
            <input type="checkbox" data-prep="${s.id}" ${prepState[s.id] ? "checked" : ""} />
            ${s.id} ${escapeHtml(s.title)}
          </label>`).join("")}
      </div>
    </div>
  `;
  ch.theory.forEach((section) => {
    html += `<div class="section-block"><h2>${section.id} ${escapeHtml(section.title)}</h2>`;
    section.blocks.forEach((b, i) => {
      html += renderBlock(b, `${ch.id}-${section.id}-${i}`);
    });
    html += `</div>`;
  });
  html += `
    <div class="notes-box">
      <h3>Minu märkmed — selgita see peatükk enda sõnadega</h3>
      <p class="notes-hint">Feynmani tehnika: kui suudad teema lihtsate sõnadega ära seletada, oled selle päriselt selgeks saanud.</p>
      <textarea id="notes-area" placeholder="Kirjuta siia oma kokkuvõte, näited, mis sulle meelde jäid, või kohad, mis veel segased on...">${escapeHtml(cs.notes[ch.id] || "")}</textarea>
    </div>
  `;
  el.innerHTML = html;
  renderMath(el);
  pendingGraphs.forEach(({ id, spec }) => {
    const c = document.getElementById(id);
    if (c) plotFunction(c, spec);
  });
  wireConfidenceButtons(el);

  el.querySelectorAll("[data-prep]").forEach((cb) => {
    cb.onchange = () => {
      prepState[cb.dataset.prep] = cb.checked;
      saveProgress();
      const done = ch.theory.filter((s) => prepState[s.id]).length;
      el.querySelector(".prep-count").textContent = `${done} / ${ch.theory.length} läbitud`;
    };
  });

  const notesArea = el.querySelector("#notes-area");
  let notesTimer = null;
  notesArea.oninput = () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      cs.notes[ch.id] = notesArea.value;
      saveProgress();
    }, 600);
  };
}

const CONFIDENCE_LABELS = { unsure: "😬 Ei tea", maybe: "🤔 Pole kindel", sure: "😎 Kindel" };

function wireConfidenceButtons(el) {
  el.querySelectorAll(".conf-btn").forEach((btn) => {
    btn.onclick = () => {
      const key = btn.dataset.key;
      const row = document.getElementById(`conf-${key}`);
      const aid = row.nextElementSibling; // .answer div immediately follows
      row.innerHTML = `<span class="confidence-chosen">Sinu hinnang: ${CONFIDENCE_LABELS[btn.dataset.c]}</span>`;
      aid.classList.remove("hidden");
      renderMath(aid);
    };
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
    case "simple":
      return `<div class="blk-simple"><div class="blk-label">Lihtsamalt öeldes</div>${b.html}</div>`;
    case "mistake":
      return `<div class="blk-mistake"><div class="blk-label">⚠ Levinud viga</div>${b.html}</div>`;
    case "graph": {
      const id = `graph-${key}`;
      pendingGraphs.push({ id, spec: b });
      return `<canvas class="graph-canvas" id="${id}" width="480" height="300"></canvas>`;
    }
    case "check": {
      const aid = `check-${key}`;
      const gid = `checkgraph-${key}`;
      if (b.graph) pendingGraphs.push({ id: gid, spec: b.graph });
      return `
        <div class="blk-check">
          <div class="blk-label">Proovi kohe</div>
          <div class="q">${b.q}</div>
          ${b.graph ? `<canvas class="graph-canvas" id="${gid}" width="480" height="300"></canvas>` : ""}
          <div class="confidence-row" id="conf-${key}">
            <span class="confidence-prompt">Kui kindel oled?</span>
            <button class="ghost conf-btn" data-key="${key}" data-c="unsure">😬 Ei tea</button>
            <button class="ghost conf-btn" data-key="${key}" data-c="maybe">🤔 Pole kindel</button>
            <button class="ghost conf-btn" data-key="${key}" data-c="sure">😎 Kindel</button>
          </div>
          <div class="answer hidden" id="${aid}">${b.a}</div>
        </div>`;
    }
    default:
      return "";
  }
}

// ---------------- Flashcard deck (jagatud mootor) ----------------

let deckState = null;

function buildDeckItems(courseId, ch) {
  const cs = courseState(courseId);
  if (!cs.flashcards[ch.id]) cs.flashcards[ch.id] = {};
  const chState = cs.flashcards[ch.id];
  const today = todayStr();
  return ch.flashcards
    .filter((c) => {
      const s = chState[c.id];
      return !s || s.due <= today;
    })
    .map((c) => ({ courseId, chapterId: ch.id, card: c }));
}

function buildAllDueItems() {
  const items = [];
  courses.forEach((course) => {
    course.chapters.forEach((ch) => {
      items.push(...buildDeckItems(course.meta.id, ch));
    });
  });
  return items;
}

function renderChapterFlashcards(el, courseId, ch, mode) {
  mode = mode || "due";
  const dueItems = buildDeckItems(courseId, ch);
  const allItems = shuffle(ch.flashcards.map((c) => ({ courseId, chapterId: ch.id, card: c })));
  const items = mode === "all" ? allItems : dueItems;

  el.innerHTML = `
    <div class="deck-toolbar">
      <button class="ghost${mode === "due" ? " active-toggle" : ""}" id="mode-due">Tänased (${dueItems.length})</button>
      <button class="ghost${mode === "all" ? " active-toggle" : ""}" id="mode-all">Kõik kaardid (${allItems.length})</button>
    </div>
    <div id="deck-container"></div>
  `;
  document.getElementById("mode-due").onclick = () => renderChapterFlashcards(el, courseId, ch, "due");
  document.getElementById("mode-all").onclick = () => renderChapterFlashcards(el, courseId, ch, "all");

  const deckEl = document.getElementById("deck-container");
  if (items.length === 0) {
    const cs = courseState(courseId);
    const chState = cs.flashcards[ch.id] || {};
    const masteredCount = ch.flashcards.filter((c) => (chState[c.id]?.box || 1) >= 5).length;
    deckEl.innerHTML = `
      <div class="deck-empty">
        <p><b>Kõik selle peatüki kaardid on täna läbitud! 🎉</b></p>
        <p>${masteredCount}/${ch.flashcards.length} kaarti valdad hästi (boks 5). Kliki üleval "Kõik kaardid", et harjutada ikkagi.</p>
      </div>`;
    return;
  }
  startDeck(deckEl, shuffle(items.slice()), { emptyText: "Tubli, valmis!" });
}

function renderReviewPage(el, mode) {
  mode = mode || "due";
  const dueItems = buildAllDueItems();
  const allItems = [];
  courses.forEach((course) => {
    course.chapters.forEach((ch) => {
      allItems.push(...ch.flashcards.map((card) => ({ courseId: course.meta.id, chapterId: ch.id, card })));
    });
  });
  const items = mode === "all" ? allItems : dueItems;

  el.innerHTML = `
    <h1 class="page-title">Tänane kordamine</h1>
    <p class="page-sub">Kaardid kõigist kursustest ja peatükkidest.</p>
    <div class="deck-toolbar">
      <button class="ghost${mode === "due" ? " active-toggle" : ""}" id="rmode-due">Tänased (${dueItems.length})</button>
      <button class="ghost${mode === "all" ? " active-toggle" : ""}" id="rmode-all">Kõik kaardid (${allItems.length})</button>
    </div>
    <div id="review-deck"></div>`;
  document.getElementById("rmode-due").onclick = () => renderReviewPage(el, "due");
  document.getElementById("rmode-all").onclick = () => renderReviewPage(el, "all");

  const deckEl = document.getElementById("review-deck");
  if (items.length === 0) {
    deckEl.innerHTML = `<div class="deck-empty"><p><b>Kõik on täna korratud! 🎉</b></p><a class="primary" href="#/">Tagasi avalehele</a></div>`;
    return;
  }
  startDeck(deckEl, shuffle(items.slice()), { emptyText: "Tubli! Kõik kaardid tehtud.", showChapterTag: true });
}

function startDeck(el, items, opts) {
  deckState = { items, flipped: false, doneCount: 0, total: items.length, opts };
  renderDeckUI(el);
}

function renderDeckUI(el) {
  const d = deckState;
  if (d.items.length === 0) {
    el.innerHTML = `<div class="deck-empty"><p><b>${escapeHtml(d.opts.emptyText || "Tubli! Kõik tänased kaardid tehtud.")}</b></p></div>`;
    return;
  }
  const item = d.items[0];
  const card = item.card;
  const course = findCourse(item.courseId);
  const ch = findChapter(course, item.chapterId);
  el.innerHTML = `
    <div class="deck-wrap">
      <div class="deck-stats">Jäänud: <b>${d.items.length}</b> &nbsp;·&nbsp; Tehtud: <b>${d.doneCount}</b>${d.total ? ` / ${d.total}` : ""}</div>
      <div class="card-stage">
        <div class="flashcard" id="fc-el">
          <div class="tag">${escapeHtml(card.tag)}${d.opts.showChapterTag && ch ? ` · ${escapeHtml(course.meta.shortTitle)} ${ch.id}` : ""}</div>
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
      gradeCard(item, btn.dataset.r);
      d.items.shift();
      d.doneCount++;
      d.flipped = false;
      renderDeckUI(el);
    };
  });
  renderMath(el);
}

function gradeCard(item, result) {
  const cs = courseState(item.courseId);
  if (!cs.flashcards[item.chapterId]) cs.flashcards[item.chapterId] = {};
  const chState = cs.flashcards[item.chapterId];
  const cur = chState[item.card.id] || { box: 1, due: todayStr() };
  let box = cur.box;
  if (result === "again") box = 1;
  else if (result === "hard") box = Math.max(1, box);
  else if (result === "good") box = Math.min(6, box + 1);
  const days = LEITNER_DAYS[box] ?? 30;
  chState[item.card.id] = { box, due: addDays(days) };
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

// ---------------- Chapter progress ----------------

function chapterProgressPct(courseId, ch) {
  const cs = courseState(courseId);
  const fcState = cs.flashcards[ch.id] || {};
  const fcMastered = ch.flashcards.filter((c) => (fcState[c.id]?.box || 1) >= 5).length;
  const fcPct = ch.flashcards.length ? fcMastered / ch.flashcards.length : 0;

  const prState = cs.practice[ch.id] || {};
  const prDone = ch.practice.problems.filter((p) => prState[p.id]).length;
  const prPct = ch.practice.problems.length ? prDone / ch.practice.problems.length : 0;

  return Math.round(((fcPct + prPct) / 2) * 100);
}

// ---------------- Practice ----------------

const pendingPracticeGraphs = [];

function renderPractice(el, courseId, ch, filterIds) {
  pendingPracticeGraphs.length = 0;
  const cs = courseState(courseId);
  if (!cs.practice[ch.id]) cs.practice[ch.id] = {};
  const chState = cs.practice[ch.id];
  const answeredCount = ch.practice.problems.filter((p) => p.answer).length;

  const problems = filterIds ? ch.practice.problems.filter((p) => filterIds.includes(p.id)) : ch.practice.problems;

  let html = `<p class="page-sub">${escapeHtml(ch.practice.source)}</p>`;
  if (ch.practice.note && !filterIds) {
    html += `<div class="blk-note" style="margin-bottom:20px;">${escapeHtml(ch.practice.note)}</div>`;
  }
  if (!filterIds && answeredCount >= 3) {
    html += `<div class="random-practice-bar"><button class="ghost" id="random-practice-btn">🎲 Vali mulle 5 juhuslikku ülesannet (millel on vastus)</button></div>`;
  }
  if (filterIds) {
    html += `<div class="random-practice-bar"><button class="ghost" id="clear-random-btn">← Kõik ülesanded tagasi</button></div>`;
  }
  problems.forEach((p) => {
    const done = !!chState[p.id];
    const subHtml = p.sub
      ? `<ul class="sub-list">${p.sub.map((s) => `<li>${s}</li>`).join("")}</ul>`
      : "";
    const answerId = `ans-${ch.id}-${p.id}`;
    const graphsHtml = (p.graphs || [])
      .map((g, gi) => {
        const gid = `pgraph-${ch.id}-${p.id}-${gi}`;
        pendingPracticeGraphs.push({ id: gid, spec: g });
        return `<canvas class="graph-canvas" id="${gid}" width="480" height="300"></canvas>`;
      })
      .join("");
    html += `
      <div class="problem">
        <div class="problem-head">
          <div><span class="problem-num">Ülesanne ${p.id}</span>${p.tag ? ` <span class="badge">${escapeHtml(p.tag)}</span>` : ""}</div>
          <label class="done-check"><input type="checkbox" data-prob="${p.id}" ${done ? "checked" : ""}/> Tehtud</label>
        </div>
        <div class="problem-body">${p.prompt}${subHtml}</div>
        ${graphsHtml}
        ${
          p.answer
            ? `<button class="ghost reveal-btn" onclick="document.getElementById('${answerId}').classList.toggle('hidden')">Näita vastust</button>
               <div class="problem-answer hidden" id="${answerId}">${escapeHtml(p.answer)}</div>`
            : `<div class="problem-answer no-official">${escapeHtml(p.noAnswerNote || "Ametlikku lühivastust pole (arutlus-/joonistusülesanne) — kontrolli praktikumis.")}</div>`
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
  const randBtn = document.getElementById("random-practice-btn");
  if (randBtn) {
    randBtn.onclick = () => {
      const pool = ch.practice.problems.filter((p) => p.answer).map((p) => p.id);
      const picked = shuffle(pool.slice()).slice(0, Math.min(5, pool.length));
      renderPractice(el, courseId, ch, picked);
    };
  }
  const clearBtn = document.getElementById("clear-random-btn");
  if (clearBtn) clearBtn.onclick = () => renderPractice(el, courseId, ch);

  renderMath(el);
  pendingPracticeGraphs.forEach(({ id, spec }) => {
    const c = document.getElementById(id);
    if (c) plotFunction(c, spec);
  });
}

// ---------------- Spikker (auto-genereeritud kordamisleht) ----------------

function renderCheatSheet(el, courseId, ch) {
  const cs = courseState(courseId);
  const chState = cs.flashcards[ch.id] || {};
  const mastered = ch.flashcards.filter((c) => (chState[c.id]?.box || 1) >= 5);

  if (mastered.length === 0) {
    el.innerHTML = `
      <div class="deck-empty">
        <p><b>Spikker on veel tühi.</b></p>
        <p>Kui kordad flashcarde ja jõuad boksini 5 (valdad hästi), ilmuvad need kaardid automaatselt siia kompaktse kordamislehena — hea enne kontrolltööd üle vaadata.</p>
      </div>`;
    return;
  }

  el.innerHTML = `
    <p class="page-sub">${mastered.length} / ${ch.flashcards.length} kaarti oled hästi valdanud — need on siin kokku kogutud kiireks kordamiseks (nt enne kontrolltööd).</p>
    <div class="cheat-grid">
      ${mastered.map((c) => `<div class="cheat-card"><div class="cheat-front">${c.front}</div><div class="cheat-back">${c.back}</div></div>`).join("")}
    </div>
  `;
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
