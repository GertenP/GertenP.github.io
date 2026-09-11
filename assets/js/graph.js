// Lihtne funktsioonigraafiku joonistaja canvasele. Ei vaja ühtegi teeki.
export function plotFunction(canvas, spec) {
  const { fn, xmin, xmax, ymin, ymax, label } = spec;
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 480;
  const cssH = 300;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const styles = getComputedStyle(document.documentElement);
  const colBorder = styles.getPropertyValue("--border").trim() || "#ddd";
  const colText = styles.getPropertyValue("--text-dim").trim() || "#888";
  const colAxis = styles.getPropertyValue("--text").trim() || "#333";
  const colLine = styles.getPropertyValue("--accent").trim() || "#3457d5";

  const padL = 34, padR = 14, padT = 16, padB = 24;
  const plotW = cssW - padL - padR;
  const plotH = cssH - padT - padB;

  const toPx = (x) => padL + ((x - xmin) / (xmax - xmin)) * plotW;
  const toPy = (y) => padT + plotH - ((y - ymin) / (ymax - ymin)) * plotH;

  ctx.clearRect(0, 0, cssW, cssH);

  // grid
  ctx.strokeStyle = colBorder;
  ctx.lineWidth = 1;
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillStyle = colText;

  const niceStep = (range) => {
    const raw = range / 8;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    let step;
    if (norm < 1.5) step = 1;
    else if (norm < 3.5) step = 2;
    else if (norm < 7.5) step = 5;
    else step = 10;
    return step * mag;
  };

  const stepX = niceStep(xmax - xmin);
  const stepY = niceStep(ymax - ymin);

  ctx.beginPath();
  for (let gx = Math.ceil(xmin / stepX) * stepX; gx <= xmax; gx += stepX) {
    const px = toPx(gx);
    ctx.moveTo(px, padT);
    ctx.lineTo(px, padT + plotH);
  }
  for (let gy = Math.ceil(ymin / stepY) * stepY; gy <= ymax; gy += stepY) {
    const py = toPy(gy);
    ctx.moveTo(padL, py);
    ctx.lineTo(padL + plotW, py);
  }
  ctx.stroke();

  // axis labels
  ctx.textAlign = "center";
  for (let gx = Math.ceil(xmin / stepX) * stepX; gx <= xmax; gx += stepX) {
    if (Math.abs(gx) < stepX / 100) continue;
    ctx.fillText(trimNum(gx), toPx(gx), toPy(0) + 12 > cssH - padB + 12 ? cssH - padB + 12 : toPy(0) + 12);
  }
  ctx.textAlign = "right";
  for (let gy = Math.ceil(ymin / stepY) * stepY; gy <= ymax; gy += stepY) {
    if (Math.abs(gy) < stepY / 100) continue;
    ctx.fillText(trimNum(gy), toPx(0) - 6 < padL ? padL + 26 : toPx(0) - 6, toPy(gy) + 3);
  }

  // axes
  ctx.strokeStyle = colAxis;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  const y0 = toPy(Math.max(ymin, Math.min(ymax, 0)));
  const x0 = toPx(Math.max(xmin, Math.min(xmax, 0)));
  ctx.moveTo(padL, y0); ctx.lineTo(padL + plotW, y0);
  ctx.moveTo(x0, padT); ctx.lineTo(x0, padT + plotH);
  ctx.stroke();

  // function curve
  const f = new Function("x", "return (" + fn + ");");
  const N = 700;
  const yRange = ymax - ymin;
  ctx.strokeStyle = colLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let drawing = false;
  let prevY = null;
  for (let i = 0; i <= N; i++) {
    const x = xmin + ((xmax - xmin) * i) / N;
    let y;
    try { y = f(x); } catch (e) { y = NaN; }
    const valid = isFinite(y);
    const jump = prevY !== null && valid && Math.abs(y - prevY) > yRange * 1.6;
    if (!valid || jump) {
      drawing = false;
      prevY = valid ? y : null;
      continue;
    }
    const py = toPy(Math.max(ymin - yRange * 0.4, Math.min(ymax + yRange * 0.4, y)));
    const px = toPx(x);
    if (!drawing) { ctx.moveTo(px, py); drawing = true; }
    else ctx.lineTo(px, py);
    prevY = y;
  }
  ctx.stroke();

  if (label) {
    ctx.fillStyle = colLine;
    ctx.textAlign = "left";
    ctx.font = "12px 'Georgia', serif";
    ctx.fillText(label, padL + 6, padT + 14);
  }
}

function trimNum(n) {
  return Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : n.toFixed(2);
}
