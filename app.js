(() => {
  const STORAGE_KEY = "de-roadmap-progress-v1";

  const defaultState = () => ({
    checked: {},
    dailyLog: [],
    fastTrack: false,
    week9Track: "aws",
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const state = defaultState();
        // Seed Week 1 Days 1–4 as done (matches roadmap tracker)
        ROADMAP.weeks[0].days.forEach((d) => {
          if (d.doneDefault) state.checked[`w1-d${d.day}`] = true;
        });
        return state;
      }
      const parsed = JSON.parse(raw);
      return {
        ...defaultState(),
        ...parsed,
        checked: parsed.checked || {},
        dailyLog: Array.isArray(parsed.dailyLog) ? parsed.dailyLog : [],
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let state = loadState();

  function isChecked(id) {
    return Boolean(state.checked[id]);
  }

  function setChecked(id, value) {
    if (value) state.checked[id] = true;
    else delete state.checked[id];
    saveState();
    updateProgress();
  }

  function setSqlDays(week, value) {
    const n = Math.max(0, Math.min(7, Number(value) || 0));
    state.checked[`sql-w${week}`] = n;
    saveState();
    updateProgress();
  }

  function getSqlDays(week) {
    const v = state.checked[`sql-w${week}`];
    return typeof v === "number" ? v : 0;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function badge(priority) {
    if (priority === "core") return '<span class="badge core">CORE</span>';
    if (priority === "exposure") return '<span class="badge exposure">EXPOSURE</span>';
    return "";
  }

  function checklistItem({ id, text, priority }) {
    const checked = isChecked(id);
    const pClass = priority === "core" ? "item-core" : priority === "exposure" ? "item-exposure" : "";
    return `
      <li class="${pClass} ${checked ? "done" : ""}" data-priority="${priority || ""}" data-id="${id}">
        <input type="checkbox" data-check-id="${id}" ${checked ? "checked" : ""} />
        <label for="">${badge(priority)}${escapeHtml(text)}</label>
      </li>
    `;
  }

  function renderNav() {
    const nav = document.getElementById("siteNav");
    const weekLinks = ROADMAP.weeks
      .map((w) => `<a href="#week-${w.id}" data-nav>W${w.id} · ${escapeHtml(shortWeekTitle(w))}</a>`)
      .join("");
    nav.innerHTML = `
      <div class="nav-group-label">// BASE</div>
      <a href="#prereqs" data-nav>01 · PREREQS</a>
      <a href="#sqlHabit" data-nav>02 · SQL_HABIT</a>
      <div class="nav-group-label">// WEEKS</div>
      ${weekLinks}
      <div class="nav-group-label">// SYSTEM</div>
      <a href="#components" data-nav>COMPONENTS</a>
      <a href="#dailyLog" data-nav>DAILY_LOG</a>
    `;
  }

  function shortWeekTitle(week) {
    const t = week.title || "";
    if (t.length <= 18) return t;
    return t.slice(0, 16) + "…";
  }

  function setActiveNav(hash) {
    const target = hash || window.location.hash || "#prereqs";
    document.querySelectorAll("#siteNav a[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === target);
    });
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.hidden = true;
  }

  function openSidebar() {
    document.body.classList.add("sidebar-open");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.hidden = false;
  }

  function renderPrereqs() {
    const el = document.getElementById("prereqs");
    el.innerHTML = `
      <h2>Prerequisite Check</h2>
      <p class="muted">Do once, before Week 1.</p>
      <ul class="checklist">
        ${ROADMAP.prerequisites.map((p) => checklistItem(p)).join("")}
      </ul>
    `;
  }

  function renderSqlHabit() {
    const el = document.getElementById("sqlHabit");
    const cells = ROADMAP.sqlHabit.weeks
      .map((w) => {
        const val = getSqlDays(w);
        return `
          <div class="sql-cell">
            <label for="sql-w${w}">Week ${w} · days practiced</label>
            <input type="number" id="sql-w${w}" min="0" max="7" value="${val}" data-sql-week="${w}" />
            <div class="muted" style="font-size:0.75rem;margin-top:0.25rem">${val} / 7</div>
          </div>
        `;
      })
      .join("");

    const focus = ROADMAP.sqlHabit.focus
      .map((f) => `<li><strong>Weeks ${escapeHtml(f.weeks)}:</strong> ${escapeHtml(f.text)}</li>`)
      .join("");

    el.innerHTML = `
      <h2>Standing Habit — Daily SQL Practice</h2>
      <p class="muted">${escapeHtml(ROADMAP.sqlHabit.description)}</p>
      <div class="sql-grid">${cells}</div>
      <ul class="sql-focus">${focus}</ul>
    `;
  }

  function weekItemIds(week) {
    const ids = [];
    week.days.forEach((d) => ids.push({ id: `w${week.id}-d${d.day}`, priority: d.priority }));
    if (week.miniProject) {
      week.miniProject.dod.forEach((_, i) =>
        ids.push({ id: `w${week.id}-mini-dod-${i}`, priority: "core" })
      );
      week.miniProject.stretch.forEach((_, i) =>
        ids.push({ id: `w${week.id}-mini-stretch-${i}`, priority: "exposure" })
      );
    }
    if (week.quiz) ids.push({ id: `w${week.id}-quiz`, priority: "core" });
    if (week.capstones) {
      week.capstones.forEach((c) => {
        c.items.forEach((_, i) =>
          ids.push({ id: `${c.id}-${i}`, priority: c.priority })
        );
      });
    }
    if (week.cloudTracks) {
      const track = state.week9Track || "aws";
      week.cloudTracks[track].forEach((_, i) =>
        ids.push({ id: `w9-${track}-${i}`, priority: "core" })
      );
    }
    return ids;
  }

  function weekProgress(week) {
    const items = weekItemIds(week).filter((it) => {
      if (state.fastTrack && it.priority === "exposure") return false;
      return true;
    });
    const done = items.filter((it) => isChecked(it.id)).length;
    const total = items.length || 1;
    return { done, total, pct: Math.round((done / total) * 100) };
  }

  function renderWeek(week) {
    const { done, total, pct } = weekProgress(week);
    let body = `<p class="goal">${escapeHtml(week.goal)}</p>`;

    if (week.days.length) {
      body += `<h3>Daily progress</h3><ul class="checklist">`;
      body += week.days
        .map((d) =>
          checklistItem({
            id: `w${week.id}-d${d.day}`,
            text: `Day ${d.day} — ${d.text}`,
            priority: d.priority,
          })
        )
        .join("");
      body += `</ul>`;
    }

    if (week.capstones) {
      week.capstones.forEach((c) => {
        body += `<h3>${badge(c.priority)}${escapeHtml(c.name)}</h3><ul class="checklist">`;
        body += c.items
          .map((text, i) =>
            checklistItem({ id: `${c.id}-${i}`, text, priority: c.priority })
          )
          .join("");
        body += `</ul>`;
      });
    }

    if (week.cloudTracks) {
      const track = state.week9Track || "aws";
      body += `
        <div class="track-switch" role="group" aria-label="Cloud track">
          <button type="button" data-track="aws" class="${track === "aws" ? "active" : ""}">AWS</button>
          <button type="button" data-track="gcp" class="${track === "gcp" ? "active" : ""}">GCP</button>
        </div>
        <h3>${track.toUpperCase()} track</h3>
        <ul class="checklist" id="week9-track-list">
          ${week.cloudTracks[track]
            .map((text, i) =>
              checklistItem({ id: `w9-${track}-${i}`, text, priority: "core" })
            )
            .join("")}
        </ul>
      `;
    }

    if (week.miniProject) {
      body += `<h3>Mini Project — "${escapeHtml(week.miniProject.name)}" (DoD)</h3><ul class="checklist">`;
      body += week.miniProject.dod
        .map((text, i) =>
          checklistItem({ id: `w${week.id}-mini-dod-${i}`, text, priority: "core" })
        )
        .join("");
      body += `</ul>`;
      if (week.miniProject.stretch.length) {
        body += `<h3>Stretch</h3><ul class="checklist">`;
        body += week.miniProject.stretch
          .map((text, i) =>
            checklistItem({
              id: `w${week.id}-mini-stretch-${i}`,
              text,
              priority: "exposure",
            })
          )
          .join("");
        body += `</ul>`;
      }
    }

    if (week.quiz) {
      body += `<h3>End-of-week quiz</h3><ul class="checklist">`;
      body += checklistItem({
        id: `w${week.id}-quiz`,
        text: `Reviewed: ${week.quiz}`,
        priority: "core",
      });
      body += `</ul>`;
    }

    return `
      <article class="week-card" id="week-${week.id}" data-week="${week.id}">
        <div class="week-header" data-toggle-week="${week.id}">
          <div>
            <h2><span class="chevron">▸</span>Week ${week.id} — ${escapeHtml(week.title)}</h2>
          </div>
          <div class="week-meta">
            <span class="week-pct" data-week-pct="${week.id}">${done}/${total} · ${pct}%</span>
            <div class="mini-bar"><div data-week-bar="${week.id}" style="width:${pct}%"></div></div>
          </div>
        </div>
        <div class="week-body">${body}</div>
      </article>
    `;
  }

  function renderWeeks() {
    const el = document.getElementById("weeks");
    el.innerHTML = ROADMAP.weeks.map(renderWeek).join("");
  }

  function renderComponents() {
    const el = document.getElementById("components");
    const rows = ROADMAP.components
      .map((c) => {
        const checked = isChecked(c.id);
        return `
          <tr>
            <td>W${c.week}</td>
            <td><code>${escapeHtml(c.name)}</code></td>
            <td>${escapeHtml(c.reusedIn)}</td>
            <td>
              <input type="checkbox" data-check-id="${c.id}" ${checked ? "checked" : ""} />
            </td>
          </tr>
        `;
      })
      .join("");

    el.innerHTML = `
      <h2>Reusable Components Tracker</h2>
      <p class="muted">Save each to /components/ after finishing the week.</p>
      <table class="components-table">
        <thead>
          <tr><th>Week</th><th>Component</th><th>Reused In</th><th>Saved?</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function renderDailyLog() {
    const el = document.getElementById("dailyLog");
    const today = new Date().toISOString().slice(0, 10);
    const logItems = state.dailyLog.length
      ? [...state.dailyLog]
          .map((e, originalIndex) => ({ ...e, originalIndex }))
          .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
          .map(
            (entry) => `
            <li>
              <span class="log-date">${escapeHtml(entry.date)}</span>
              <span class="log-note">${escapeHtml(entry.note)}</span>
              <button type="button" class="btn-x" data-log-delete="${entry.originalIndex}" title="Delete">×</button>
            </li>
          `
          )
          .join("")
      : '<li class="muted" style="border:none;background:transparent">No entries yet.</li>';

    el.innerHTML = `
      <h2>Daily Log</h2>
      <p class="muted">Add a line each day you study.</p>
      <form class="log-form" id="logForm">
        <input type="date" id="logDate" value="${today}" required />
        <input type="text" id="logNote" placeholder="What did you study?" required />
        <button type="submit" class="btn">Add</button>
      </form>
      <ul class="log-list" id="logList">${logItems}</ul>
    `;
  }

  function collectAllItems() {
    const items = [];
    ROADMAP.prerequisites.forEach((p) => items.push({ id: p.id, priority: p.priority }));
    ROADMAP.sqlHabit.weeks.forEach((w) =>
      items.push({ id: `sql-w${w}`, priority: "core", kind: "sql" })
    );
    ROADMAP.weeks.forEach((week) => {
      weekItemIds(week).forEach((it) => items.push(it));
    });
    ROADMAP.components.forEach((c) => items.push({ id: c.id, priority: "core" }));
    return items;
  }

  function isItemDone(item) {
    if (item.kind === "sql") {
      return getSqlDays(Number(item.id.replace("sql-w", ""))) >= 7;
    }
    return isChecked(item.id);
  }

  function updateProgress() {
    const all = collectAllItems();
    const visible = state.fastTrack
      ? all.filter((it) => it.priority !== "exposure")
      : all;
    const coreOnly = all.filter((it) => it.priority === "core");

    const doneVisible = visible.filter(isItemDone).length;
    const doneCore = coreOnly.filter(isItemDone).length;

    const overallPct = visible.length
      ? Math.round((doneVisible / visible.length) * 100)
      : 0;
    const corePct = coreOnly.length
      ? Math.round((doneCore / coreOnly.length) * 100)
      : 0;

    document.getElementById("overallPct").textContent = `${overallPct}%`;
    document.getElementById("corePct").textContent = `${corePct}%`;
    document.getElementById("overallBar").style.width = `${overallPct}%`;
    document.getElementById("coreBar").style.width = `${corePct}%`;
    document.getElementById("progressMeta").textContent = state.fastTrack
      ? `${doneVisible} / ${visible.length} Fast Track items · Core ${doneCore}/${coreOnly.length}`
      : `${doneVisible} / ${visible.length} items · Core ${doneCore}/${coreOnly.length}`;

    ROADMAP.weeks.forEach((week) => {
      const { done, total, pct } = weekProgress(week);
      const pctEl = document.querySelector(`[data-week-pct="${week.id}"]`);
      const barEl = document.querySelector(`[data-week-bar="${week.id}"]`);
      if (pctEl) pctEl.textContent = `${done}/${total} · ${pct}%`;
      if (barEl) barEl.style.width = `${pct}%`;
    });

    // Sync done class on checklist items
    document.querySelectorAll("[data-check-id]").forEach((input) => {
      const id = input.getAttribute("data-check-id");
      const li = input.closest("li");
      if (li) li.classList.toggle("done", input.checked);
    });
  }

  function applyFastTrackUI() {
    document.body.classList.toggle("fast-track", state.fastTrack);
    document.getElementById("fastTrackToggle").checked = state.fastTrack;
    updateProgress();
  }

  function bindEvents() {
    document.body.addEventListener("change", (e) => {
      const t = e.target;
      if (t.matches("[data-check-id]")) {
        setChecked(t.getAttribute("data-check-id"), t.checked);
      }
      if (t.matches("[data-sql-week]")) {
        setSqlDays(t.getAttribute("data-sql-week"), t.value);
        const cell = t.closest(".sql-cell");
        if (cell) {
          const hint = cell.querySelector(".muted");
          if (hint) hint.textContent = `${getSqlDays(t.getAttribute("data-sql-week"))} / 7`;
        }
      }
    });

    document.body.addEventListener("click", (e) => {
      const navLink = e.target.closest("#siteNav a[data-nav]");
      if (navLink) {
        setActiveNav(navLink.getAttribute("href"));
        closeSidebar();
      }

      const header = e.target.closest("[data-toggle-week]");
      if (header) {
        const card = header.closest(".week-card");
        if (card) {
          card.classList.toggle("open");
          const chev = card.querySelector(".chevron");
          if (chev) chev.textContent = card.classList.contains("open") ? "▾" : "▸";
        }
        return;
      }

      const trackBtn = e.target.closest("[data-track]");
      if (trackBtn) {
        state.week9Track = trackBtn.getAttribute("data-track");
        saveState();
        renderWeeks();
        bindWeek9Only();
        applyFastTrackUI();
        // Re-open week 9
        const w9 = document.getElementById("week-9");
        if (w9) {
          w9.classList.add("open");
          const chev = w9.querySelector(".chevron");
          if (chev) chev.textContent = "▾";
        }
        return;
      }

      const del = e.target.closest("[data-log-delete]");
      if (del) {
        const idx = Number(del.getAttribute("data-log-delete"));
        state.dailyLog.splice(idx, 1);
        saveState();
        renderDailyLog();
      }
    });

    document.getElementById("fastTrackToggle").addEventListener("change", (e) => {
      state.fastTrack = e.target.checked;
      saveState();
      applyFastTrackUI();
    });

    document.getElementById("btnReset").addEventListener("click", () => {
      if (
        !confirm(
          "Reset ALL progress in localStorage? This cannot be undone (unless you have a Backup)."
        )
      )
        return;
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      renderAll();
    });

    document.getElementById("btnBackup").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `de-roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("restoreFile").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          state = {
            ...defaultState(),
            ...parsed,
            checked: parsed.checked || {},
            dailyLog: Array.isArray(parsed.dailyLog) ? parsed.dailyLog : [],
          };
          saveState();
          renderAll();
          alert("Progress restored.");
        } catch {
          alert("Invalid JSON file.");
        }
        e.target.value = "";
      };
      reader.readAsText(file);
    });

    document.body.addEventListener("submit", (e) => {
      if (e.target.id !== "logForm") return;
      e.preventDefault();
      const date = document.getElementById("logDate").value;
      const note = document.getElementById("logNote").value.trim();
      if (!date || !note) return;
      state.dailyLog.push({ date, note });
      saveState();
      renderDailyLog();
    });
  }

  function bindWeek9Only() {
    // Events are delegated on body; nothing extra needed after re-render.
  }

  function renderAll() {
    renderNav();
    renderPrereqs();
    renderSqlHabit();
    renderWeeks();
    renderComponents();
    renderDailyLog();
    applyFastTrackUI();
    // Open Week 1 by default
    const w1 = document.getElementById("week-1");
    if (w1) {
      w1.classList.add("open");
      const chev = w1.querySelector(".chevron");
      if (chev) chev.textContent = "▾";
    }
  }

  const menuBtn = document.getElementById("menuBtn");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  if (menuBtn) menuBtn.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);
  window.addEventListener("hashchange", () => setActiveNav(window.location.hash));

  bindEvents();
  renderAll();
  setActiveNav(window.location.hash || "#prereqs");
})();
