(function () {
  "use strict";
  const grid = document.getElementById("caseGrid");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => Math.round(Number(n) || 0).toLocaleString("ru-RU") + " ₽";

  // 0..3 — «уровень риска» по месту кейса в списке цен (зелёный → красный)
  function tierOf(price, sorted) {
    if (sorted.length < 2) return 0;
    const rank = sorted.indexOf(price) / (sorted.length - 1);
    return Math.min(3, Math.floor(rank * 4));
  }

  function render(cases) {
    if (!cases.length) { grid.innerHTML = '<div class="state">Кейсов пока нет</div>'; return; }
    const prices = cases.map((c) => Number(c.price) || 0).sort((a, b) => a - b);
    grid.innerHTML = cases.map((c) => {
      const t = tierOf(Number(c.price) || 0, prices);
      const bars = [0, 1, 2, 3].map((i) => `<i data-c="${i}"${i === t ? ' class="on"' : ""}></i>`).join("");
      return `<a class="case-tile" href="/case.html?id=${encodeURIComponent(c.id)}">
        <div class="case-art">
          <img src="${esc(c.image || "/images/case_ak47.png")}" alt="" loading="lazy">
          <span class="price-tag">${money(c.price)}</span>
        </div>
        <div class="tier">${bars}</div>
        <div class="case-name">${esc(c.name)}</div>
      </a>`;
    }).join("");
  }

  fetch("/api/cases", { cache: "no-store" })
    .then((r) => r.json())
    .then((d) => render(Array.isArray(d.cases) ? d.cases : []))
    .catch(() => { grid.innerHTML = '<div class="state">Не удалось загрузить кейсы</div>'; });
})();
