(() => {
  const main = document.getElementById("mainContent");
  const nav = document.getElementById("siteNav");
  const searchInput = document.getElementById("searchInput");

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getTool(id) {
    return LIBRARY.tools[id];
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

  function currentId() {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash || hash === "home") return null;
    return LIBRARY.tools[hash] ? hash : null;
  }

  function renderNav(filter = "") {
    const q = filter.trim().toLowerCase();
    let html = `<div class="nav-group-label">// INDEX</div>
      <a href="#home" data-nav data-id="home">HOME</a>`;

    LIBRARY.parts.forEach((part) => {
      html += `<div class="nav-group-label">${escapeHtml(part.label)}</div>`;
      part.tools.forEach((id) => {
        const tool = getTool(id);
        if (!tool) return;
        const hay = `${tool.name} ${tool.part} ${tool.summary} ${tool.week}`.toLowerCase();
        const hidden = q && !hay.includes(q) ? " hidden" : "";
        html += `<a href="#${id}" class="${hidden}" data-nav data-id="${id}">${escapeHtml(tool.name)}</a>`;
      });
    });

    nav.innerHTML = html;
    setActiveNav();
  }

  function setActiveNav() {
    const id = currentId() || "home";
    nav.querySelectorAll("a[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("data-id") === id);
    });
  }

  function renderHome() {
    const cards = Object.values(LIBRARY.tools)
      .map(
        (t) => `
      <button type="button" class="home-card" data-open="${t.id}">
        <div class="part">${escapeHtml(t.part)} · ${escapeHtml(t.week)}</div>
        <h3>${escapeHtml(t.name)}</h3>
        <p>${escapeHtml(t.summary)}</p>
      </button>`
      )
      .join("");

    main.innerHTML = `
      <section class="doc-header">
        <div class="meta">
          <span class="pill part">ARCHIVE</span>
          <span class="pill week">${Object.keys(LIBRARY.tools).length} TOOLS</span>
        </div>
        <h2>DATA ENGINEERING TOOL LIBRARY</h2>
        <p class="summary">Roadmap-aligned reference: business why · technical how · example code. Pick a tool from the sidebar or cards below.</p>
      </section>
      <div class="home-grid">${cards}</div>
    `;
  }

  function renderTool(id) {
    const tool = getTool(id);
    if (!tool) {
      renderHome();
      return;
    }

    const biz = tool.business.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    const tech = tool.technical.map((t) => `<li>${escapeHtml(t)}</li>`).join("");

    main.innerHTML = `
      <article>
        <header class="doc-header">
          <div class="meta">
            <span class="pill part">${escapeHtml(tool.part)}</span>
            <span class="pill week">${escapeHtml(tool.week)}</span>
          </div>
          <h2>${escapeHtml(tool.name)}</h2>
          <p class="summary">${escapeHtml(tool.summary)}</p>
        </header>

        <section class="section-card business">
          <h3>// BUSINESS REQUIREMENT</h3>
          <ul>${biz}</ul>
        </section>

        <section class="section-card technical">
          <h3>// TECHNICAL</h3>
          <ul>${tech}</ul>
          ${
            tool.whenNot
              ? `<div class="when-not"><strong>WHEN NOT:</strong> ${escapeHtml(tool.whenNot)}</div>`
              : ""
          }
        </section>

        <section class="section-card example">
          <h3>// EXAMPLE CODE</h3>
          <pre><code>${escapeHtml(tool.example)}</code></pre>
        </section>
      </article>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function route() {
    const id = currentId();
    if (!id) renderHome();
    else renderTool(id);
    setActiveNav();
  }

  document.getElementById("menuBtn").addEventListener("click", openSidebar);
  document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
  document.getElementById("sidebarBackdrop").addEventListener("click", closeSidebar);

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-nav]");
    if (a) closeSidebar();
  });

  main.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    const id = btn.getAttribute("data-open");
    window.location.hash = id;
  });

  searchInput.addEventListener("input", () => {
    renderNav(searchInput.value);
  });

  window.addEventListener("hashchange", route);

  renderNav();
  route();
})();
