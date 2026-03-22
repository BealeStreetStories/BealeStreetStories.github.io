(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================
  const SITE = {
    name: "Project California RP",
    emoji: "🌴🌊🏖️",
    tagline: "California Based • Semi-serious RP",
    discordUrl: "https://discord.gg/vRTB8gq3WN",
    connectUrl: "fivem://connect/163.227.179.61",
    cfxUrl: "https://cfx.re/join/krbzd7",
    tebexUrl: ""
  };

  // ==============================
  // ANNOUNCEMENT BANNER
  // ==============================
  function injectBanner(){
    if(document.getElementById("siteBanner")) return;
    const banner = document.createElement("div");
    banner.id = "siteBanner";
    banner.innerHTML = `
      <span class="bannerText">🎉 Server now OPEN with FREE whitelist! Looking for dedicated staff!</span>
      <button class="bannerClose" id="bannerClose" aria-label="Close">✕</button>
    `;
    document.body.prepend(banner);
    document.getElementById("bannerClose").addEventListener("click", () => {
      banner.style.maxHeight = "0";
      banner.style.padding = "0";
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 400);
      sessionStorage.setItem("bannerClosed", "1");
    });
  }

  // ==============================
  // GLOBAL HEADER
  // ==============================
  function injectHeader(){
    if(document.querySelector(".globalHeader")) return;
    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="waveBar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 28" preserveAspectRatio="none">
          <path class="wave wave1" d="M0,14 C180,28 360,0 540,14 C720,28 900,0 1080,14 C1260,28 1440,14 1440,14 L1440,28 L0,28 Z"/>
          <path class="wave wave2" d="M0,18 C200,4 400,28 600,18 C800,8 1000,28 1200,18 C1320,12 1440,18 1440,18 L1440,28 L0,28 Z"/>
        </svg>
      </div>
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          <div id="serverStatus" class="serverStatus">
            <span class="statusDot"></span>
            <span class="statusText">Checking...</span>
          </div>
          ${SITE.cfxUrl ? `<a class="headerBtn joinBtn" href="${SITE.cfxUrl}" target="_blank" rel="noopener">🎮 Join Now</a>` : ``}
          ${SITE.discordUrl ? `<a class="headerBtn" href="${SITE.discordUrl}" target="_blank" rel="noopener">Discord</a>` : ``}
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // ==============================
  // SERVER STATUS (CFX API)
  // ==============================
  async function fetchServerStatus(){
    const statusEl = document.getElementById("serverStatus");
    if(!statusEl) return;
    try {
      const res = await fetch("https://servers-frontend.fivem.net/api/servers/single/krbzd7");
      if(!res.ok) throw new Error();
      const data = await res.json();
      const players = data?.Data?.clients ?? 0;
      const maxPlayers = data?.Data?.sv_maxclients ?? 64;
      statusEl.innerHTML = `
        <span class="statusDot online"></span>
        <span class="statusText">🟢 Online • ${players}/${maxPlayers} players</span>
      `;
    } catch(e){
      statusEl.innerHTML = `
        <span class="statusDot offline"></span>
        <span class="statusText">🔴 Offline</span>
      `;
    }
  }

  // ==============================
  // SCROLL PROGRESS BAR
  // ==============================
  function injectProgressBar(){
    if(document.getElementById("scrollProgress")) return;
    const bar = document.createElement("div");
    bar.id = "scrollProgress";
    document.body.prepend(bar);
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    }, { passive: true });
  }

  // ==============================
  // BACK TO TOP BUTTON
  // ==============================
  function injectBackToTop(){
    if(document.getElementById("backToTop")) return;
    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.innerHTML = "🌊";
    btn.title = "Back to top";
    document.body.appendChild(btn);
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==============================
  // BREADCRUMBS
  // ==============================
  const NAV_MAP = {
    "/PCRP/": ["Home"],
    "/PCRP/server-bible/": ["Core", "Server Bible"],
    "/PCRP/faction-roe/": ["Rules of Engagement", "Faction ROE"],
    "/PCRP/families-roe/": ["Rules of Engagement", "Families ROE"],
    "/PCRP/leo/": ["Departments", "LEO"],
    "/PCRP/ems/": ["Departments", "EMS"]
  };

  function injectBreadcrumb(){
    const main = document.querySelector(".main");
    if(!main || document.getElementById("breadcrumb")) return;
    let path = window.location.pathname;
    if(!path.endsWith("/")) path += "/";
    const crumbs = NAV_MAP[path];
    if(!crumbs || crumbs.length <= 1) return;
    const nav = document.createElement("nav");
    nav.id = "breadcrumb";
    nav.setAttribute("aria-label", "Breadcrumb");
    const parts = ["<a href='/PCRP/'>🏠 Home</a>", ...crumbs.map((c, i) =>
      i === crumbs.length - 1 ? `<span>${c}</span>` : `<span>${c}</span>`
    )];
    nav.innerHTML = parts.join("<span class='breadSep'>›</span>");
    main.prepend(nav);
  }

  // ==============================
  // SMOOTH PAGE TRANSITIONS
  // ==============================
  function initPageTransitions(){
    document.body.classList.add("pageReady");
    document.querySelectorAll("a[href]").forEach(link => {
      const href = link.getAttribute("href");
      if(!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto") || href.startsWith("fivem")) return;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.remove("pageReady");
        document.body.classList.add("pageLeave");
        setTimeout(() => { window.location.href = href; }, 250);
      });
    });
  }

  // ==============================
  // PARALLAX BACKGROUND
  // ==============================
  function initParallax(){
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.3;
      document.body.style.backgroundPositionY = `calc(center + ${offset}px)`;
    }, { passive: true });
  }

  // ==============================
  // BRAND SYNC
  // ==============================
  function syncBrand(){
    const brandEl = document.querySelector(".brand");
    if(brandEl) brandEl.textContent = SITE.name;
  }

  // ==============================
  // TABLE OF CONTENTS
  // ==============================
  function enableTocIfPresent(){
    const toc = document.getElementById("toc");
    if(!toc) return;
    const headings = document.querySelectorAll(".main h2, .main h3");
    if(!headings.length) return;
    let html = "<ul>";
    headings.forEach(h => {
      if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
      const indent = h.tagName === "H3" ? " style='margin-left:14px'" : "";
      html += `<li${indent}><a href="#${h.id}">${h.textContent}</a></li>`;
    });
    html += "</ul>";
    toc.innerHTML = html;
  }

  // ==============================
  // PAGE FILTER (search highlight)
  // ==============================
  function filterPage(query){
    const q = query.toLowerCase().trim();
    document.querySelectorAll("[data-search-item]").forEach(el => {
      el.style.opacity = (!q || el.textContent.toLowerCase().includes(q)) ? "" : "0.3";
    });
  }

  // ==============================
  // SEARCH FUNCTIONALITY
  // ==============================
  const SITE_PAGES = [
    { title: "Home", path: "/PCRP/" },
    { title: "Server Bible", path: "/PCRP/server-bible/" },
    { title: "Faction ROE", path: "/PCRP/faction-roe/" },
    { title: "Families ROE", path: "/PCRP/families-roe/" },
    { title: "LEO", path: "/PCRP/leo/" },
    { title: "EMS", path: "/PCRP/ems/" }
  ];

  const siteCache = new Map();
  let siteLoading = false;
  const searchInput = document.getElementById("searchInput");

  function ensureSearchBox(){
    let box = document.getElementById("searchResults");
    if(box) return box;
    box = document.createElement("div");
    box.id = "searchResults";
    box.className = "searchResults";
    box.style.display = "none";
    const wrap = document.querySelector(".search");
    if(wrap) wrap.appendChild(box);
    document.addEventListener("click", (e) => {
      if(!searchInput || e.target === searchInput || box.contains(e.target)) return;
      box.style.display = "none";
    });
    return box;
  }

  async function fetchPage(path){
    if(siteCache.has(path)) return siteCache.get(path);
    try {
      const res = await fetch(path);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const nodes = doc.querySelectorAll("[data-search-item]");
      const text = Array.from(nodes).map(n => n.textContent.trim()).join(" ");
      const record = { path, text };
      siteCache.set(path, record);
      return record;
    } catch(e) { return { path, text: "" }; }
  }

  async function buildCache(){
    if(siteLoading) return;
    siteLoading = true;
    await Promise.all(SITE_PAGES.map(p => fetchPage(p.path)));
    siteLoading = false;
  }

  async function searchSite(query){
    const q = query.toLowerCase().trim();
    if(q.length < 2) return [];
    await buildCache();
    return SITE_PAGES.filter(p => {
      const rec = siteCache.get(p.path);
      return rec && rec.text.toLowerCase().includes(q);
    });
  }

  function renderResults(results, query){
    const box = ensureSearchBox();
    if(!results.length){
      box.innerHTML = `<div class="searchResultMeta">No results found</div>`;
      box.style.display = "block";
      return;
    }
    box.innerHTML = results.map(r => `
      <a class="searchResultItem" href="${r.path}?q=${encodeURIComponent(query)}">
        <div class="searchResultTitle">${r.title}</div>
      </a>
    `).join("");
    box.style.display = "block";
  }

  if(searchInput){
    ensureSearchBox();
    searchInput.addEventListener("input", async (e) => {
      const val = e.target.value;
      if(!val.trim()){ ensureSearchBox().style.display = "none"; filterPage(""); return; }
      const results = await searchSite(val);
      renderResults(results, val);
      filterPage(val);
    });
    document.addEventListener("keydown", async (e) => {
      if(e.key === "Enter"){
        const results = await searchSite(searchInput.value);
        if(results.length) window.location.href = `${results[0].path}?q=${encodeURIComponent(searchInput.value)}`;
      }
    });
    document.addEventListener("keydown", (e) => {
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
        e.preventDefault();
        searchInput.focus();
      }
      if(e.key === "Escape"){
        searchInput.value = "";
        filterPage("");
        const sb = document.querySelector(".sidebar");
        if(sb) sb.classList.remove("open");
        const box = document.getElementById("searchResults");
        if(box) box.style.display = "none";
      }
    });
  }

  // ==============================
  // MOBILE MENU BUTTON
  // ==============================
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.querySelector(".sidebar");
  if(menuBtn && sidebar){
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
      menuBtn.innerHTML = sidebar.classList.contains("open") ? "✕ Close" : "☰ Menu";
    });
    document.addEventListener("click", (e) => {
      if(sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== menuBtn){
        sidebar.classList.remove("open");
        menuBtn.innerHTML = "☰ Menu";
      }
    });
  }

  // ==============================
  // OCEAN SCENE (Realistic v2)
  // ==============================
  function injectOceanScene(){
    if(document.getElementById("oceanScene")) return;
    const scene = document.createElement("div");
    scene.id = "oceanScene";
    scene.innerHTML = `
      <svg viewBox="0 0 1440 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#0A4A6A" stop-opacity="0.0"/>
            <stop offset="25%"  stop-color="#0A5578" stop-opacity="0.30"/>
            <stop offset="65%"  stop-color="#062040" stop-opacity="0.72"/>
            <stop offset="100%" stop-color="#030E1E" stop-opacity="0.96"/>
          </linearGradient>
          <linearGradient id="sunsetTint" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#E8601A" stop-opacity="0.12"/>
            <stop offset="35%"  stop-color="#1AB8D4" stop-opacity="0.06"/>
            <stop offset="70%"  stop-color="#1AB8D4" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#F5C030" stop-opacity="0.10"/>
          </linearGradient>
          <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#C8943A" stop-opacity="0.70"/>
            <stop offset="100%" stop-color="#7A4E18" stop-opacity="0.90"/>
          </linearGradient>
          <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#FF7040"/>
            <stop offset="100%" stop-color="#8B2500"/>
          </linearGradient>
          <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#FFD040"/>
            <stop offset="100%" stop-color="#8B6000"/>
          </linearGradient>
          <linearGradient id="cg3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#FF40B0"/>
            <stop offset="100%" stop-color="#6B0040"/>
          </linearGradient>
          <linearGradient id="cg4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#40E0B0"/>
            <stop offset="100%" stop-color="#006040"/>
          </linearGradient>
          <linearGradient id="swGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#3DDB80" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#0F4A24" stop-opacity="1"/>
          </linearGradient>
          <linearGradient id="anemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#FF80C0"/>
            <stop offset="100%" stop-color="#8B1050"/>
          </linearGradient>
          <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#2A3A50"/>
            <stop offset="100%" stop-color="#0A1220"/>
          </linearGradient>
          <filter id="causticBlur">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
        </defs>

        <!-- CAUSTIC LIGHT RAYS -->
        <g opacity="0.9">
          <polygon class="caustic"  points="200,0 230,0 180,130 155,130" fill="rgba(180,230,255,0.12)" filter="url(#causticBlur)"/>
          <polygon class="caustic2" points="420,0 455,0 400,130 370,130" fill="rgba(180,230,255,0.10)" filter="url(#causticBlur)"/>
          <polygon class="caustic3" points="680,0 710,0 660,130 635,130" fill="rgba(180,230,255,0.11)" filter="url(#causticBlur)"/>
          <polygon class="caustic"  points="920,0 948,0 900,130 876,130" fill="rgba(180,230,255,0.09)" filter="url(#causticBlur)"/>
          <polygon class="caustic2" points="1150,0 1178,0 1132,130 1108,130" fill="rgba(180,230,255,0.10)" filter="url(#causticBlur)"/>
          <polygon class="caustic3" points="1360,0 1385,0 1345,130 1323,130" fill="rgba(180,230,255,0.08)" filter="url(#causticBlur)"/>
        </g>

        <!-- WATER BODY -->
        <rect x="0" y="0" width="1440" height="160" fill="url(#waterGrad)"/>
        <rect x="0" y="0" width="1440" height="160" fill="url(#sunsetTint)"/>

        <!-- SANDY FLOOR -->
        <path d="M0,132 C180,126 360,136 540,130 C720,124 900,134 1080,128 C1260,122 1440,132 1440,132 L1440,160 L0,160 Z" fill="url(#sandGrad)"/>
        <path d="M0,133 C160,128 340,137 520,132 C700,127 880,136 1060,130 C1240,124 1440,133 1440,133" fill="none" stroke="rgba(220,170,80,0.35)" stroke-width="1.5"/>
        <ellipse class="sandRipple" cx="150"  cy="142" rx="90"  ry="4"   fill="rgba(200,150,60,0.6)"/>
        <ellipse class="sandRipple" cx="420"  cy="145" rx="130" ry="3.5" fill="rgba(200,150,60,0.5)"/>
        <ellipse class="sandRipple" cx="750"  cy="143" rx="110" ry="3.5" fill="rgba(200,150,60,0.55)"/>
        <ellipse class="sandRipple" cx="1050" cy="144" rx="100" ry="3"   fill="rgba(200,150,60,0.5)"/>
        <ellipse class="sandRipple" cx="1320" cy="142" rx="85"  ry="4"   fill="rgba(200,150,60,0.55)"/>
        <!-- Pebbles -->
        <ellipse cx="60"   cy="136" rx="7" ry="4"   fill="#1A2A3A" opacity="0.70"/>
        <ellipse cx="240"  cy="138" rx="5" ry="3"   fill="#1E3040" opacity="0.65"/>
        <ellipse cx="610"  cy="136" rx="9" ry="4.5" fill="#162230" opacity="0.72"/>
        <ellipse cx="880"  cy="137" rx="6" ry="3.5" fill="#1A2A3A" opacity="0.68"/>
        <ellipse cx="1180" cy="136" rx="8" ry="4"   fill="#1E3040" opacity="0.70"/>
        <ellipse cx="1400" cy="137" rx="5" ry="3"   fill="#162230" opacity="0.65"/>

        <!-- ROCKS -->
        <ellipse cx="50"   cy="138" rx="36" ry="14" fill="url(#rockGrad)" opacity="0.88"/>
        <ellipse cx="50"   cy="133" rx="28" ry="10" fill="#1E3045" opacity="0.70"/>
        <ellipse cx="520"  cy="139" rx="30" ry="12" fill="url(#rockGrad)" opacity="0.85"/>
        <ellipse cx="520"  cy="134" rx="22" ry="8"  fill="#1E3045" opacity="0.68"/>
        <ellipse cx="1060" cy="138" rx="34" ry="13" fill="url(#rockGrad)" opacity="0.86"/>
        <ellipse cx="1060" cy="133" rx="26" ry="9"  fill="#1E3045" opacity="0.69"/>
        <ellipse cx="1420" cy="139" rx="28" ry="11" fill="url(#rockGrad)" opacity="0.82"/>

        <!-- SEAWEED -->
        <g class="seaweed sw1">
          <path d="M90,135 C86,118 94,100 87,82 C80,64 90,50 88,36" stroke="url(#swGrad)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M88,108 C100,99 112,102 117,94" stroke="url(#swGrad)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
          <path d="M87,82 C75,73 65,76 60,68" stroke="url(#swGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw2">
          <path d="M170,135 C166,114 176,92 169,70" stroke="url(#swGrad)" stroke-width="3.8" fill="none" stroke-linecap="round"/>
          <path d="M169,102 C181,93 191,96 196,88" stroke="url(#swGrad)" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw3">
          <path d="M710,135 C705,110 718,85 710,60 C702,38 714,24 712,10" stroke="url(#swGrad)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M711,96 C725,85 737,89 743,80" stroke="url(#swGrad)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
          <path d="M710,68 C697,58 685,62 680,53" stroke="url(#swGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw4">
          <path d="M1110,135 C1106,114 1118,92 1110,70" stroke="url(#swGrad)" stroke-width="3.8" fill="none" stroke-linecap="round"/>
          <path d="M1111,102 C1124,93 1135,96 1141,88" stroke="url(#swGrad)" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw5">
          <path d="M1390,135 C1386,114 1396,92 1388,70" stroke="url(#swGrad)" stroke-width="3.8" fill="none" stroke-linecap="round"/>
          <path d="M1389,105 C1401,96 1411,99 1416,91" stroke="url(#swGrad)" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        </g>

        <!-- ANEMONE @ x=340 (pink) -->
        <g transform="translate(340,135)">
          <ellipse cx="0" cy="0" rx="14" ry="5" fill="#8B1050" opacity="0.85"/>
          <line class="anemone" x1="-10" y1="0" x2="-14" y2="-20" stroke="url(#anemGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line class="anemone" x1="-5"  y1="0" x2="-6"  y2="-22" stroke="url(#anemGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line class="anemone" x1="0"   y1="0" x2="1"   y2="-24" stroke="url(#anemGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line class="anemone" x1="5"   y1="0" x2="7"   y2="-22" stroke="url(#anemGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line class="anemone" x1="10"  y1="0" x2="15"  y2="-20" stroke="url(#anemGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="-14" cy="-20" r="3"   fill="#FF80C0"/>
          <circle cx="-6"  cy="-22" r="3"   fill="#FF90CC"/>
          <circle cx="1"   cy="-24" r="3"   fill="#FF80C0"/>
          <circle cx="7"   cy="-22" r="3"   fill="#FF90CC"/>
          <circle cx="15"  cy="-20" r="3"   fill="#FF80C0"/>
        </g>

        <!-- ANEMONE @ x=990 (teal) -->
        <g transform="translate(990,135)">
          <ellipse cx="0" cy="0" rx="12" ry="4" fill="#006040" opacity="0.85"/>
          <line class="anemone" x1="-9"  y1="0" x2="-12" y2="-18" stroke="url(#cg4)" stroke-width="2.2" stroke-linecap="round"/>
          <line class="anemone" x1="-4"  y1="0" x2="-5"  y2="-20" stroke="url(#cg4)" stroke-width="2.2" stroke-linecap="round"/>
          <line class="anemone" x1="0"   y1="0" x2="0"   y2="-21" stroke="url(#cg4)" stroke-width="2.2" stroke-linecap="round"/>
          <line class="anemone" x1="5"   y1="0" x2="6"   y2="-20" stroke="url(#cg4)" stroke-width="2.2" stroke-linecap="round"/>
          <line class="anemone" x1="9"   y1="0" x2="13"  y2="-18" stroke="url(#cg4)" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="-12" cy="-18" r="2.5" fill="#40E0B0"/>
          <circle cx="-5"  cy="-20" r="2.5" fill="#50EEC0"/>
          <circle cx="0"   cy="-21" r="2.5" fill="#40E0B0"/>
          <circle cx="6"   cy="-20" r="2.5" fill="#50EEC0"/>
          <circle cx="13"  cy="-18" r="2.5" fill="#40E0B0"/>
        </g>

        <!-- CORAL CLUSTERS -->
        <!-- Orange branching @ x=300 -->
        <g class="coralGlow">
          <line x1="300" y1="135" x2="300" y2="104" stroke="url(#cg1)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="300" y1="116" x2="284" y2="96"  stroke="url(#cg1)" stroke-width="3.8" stroke-linecap="round"/>
          <line x1="300" y1="116" x2="317" y2="93"  stroke="url(#cg1)" stroke-width="3.8" stroke-linecap="round"/>
          <line x1="284" y1="96"  x2="276" y2="82"  stroke="url(#cg1)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="284" y1="96"  x2="293" y2="80"  stroke="url(#cg1)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="317" y1="93"  x2="310" y2="79"  stroke="url(#cg1)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="317" y1="93"  x2="326" y2="80"  stroke="url(#cg1)" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="276" cy="80"  r="4.5" fill="#FF8050"/>
          <circle cx="293" cy="78"  r="4"   fill="#FF6030"/>
          <circle cx="310" cy="77"  r="4.5" fill="#FF8050"/>
          <circle cx="326" cy="78"  r="4"   fill="#FF7040"/>
          <circle cx="300" cy="102" r="5"   fill="#FF6030"/>
        </g>
        <!-- Yellow fan @ x=490 -->
        <g class="coralGlow2">
          <line x1="490" y1="135" x2="490" y2="108" stroke="url(#cg2)" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="490" y1="120" x2="474" y2="102" stroke="url(#cg2)" stroke-width="3.2" stroke-linecap="round"/>
          <line x1="490" y1="120" x2="506" y2="100" stroke="url(#cg2)" stroke-width="3.2" stroke-linecap="round"/>
          <line x1="490" y1="120" x2="490" y2="97"  stroke="url(#cg2)" stroke-width="2.6" stroke-linecap="round"/>
          <line x1="474" y1="102" x2="466" y2="90"  stroke="url(#cg2)" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="506" y1="100" x2="514" y2="88"  stroke="url(#cg2)" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="466" cy="88"  r="4"   fill="#FFD840"/>
          <circle cx="490" cy="95"  r="4.5" fill="#FFE050"/>
          <circle cx="514" cy="86"  r="4"   fill="#FFD840"/>
          <circle cx="474" cy="100" r="3.5" fill="#FFE060"/>
          <circle cx="506" cy="98"  r="3.5" fill="#FFD840"/>
        </g>
        <!-- Teal branching @ x=650 -->
        <g class="coralGlow3">
          <line x1="650" y1="135" x2="650" y2="108" stroke="url(#cg4)" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="650" y1="118" x2="636" y2="100" stroke="url(#cg4)" stroke-width="3.2" stroke-linecap="round"/>
          <line x1="650" y1="118" x2="664" y2="98"  stroke="url(#cg4)" stroke-width="3.2" stroke-linecap="round"/>
          <line x1="636" y1="100" x2="629" y2="88"  stroke="url(#cg4)" stroke-width="2.4" stroke-linecap="round"/>
          <line x1="664" y1="98"  x2="671" y2="86"  stroke="url(#cg4)" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="629" cy="86"  r="4"   fill="#40E8B8"/>
          <circle cx="650" cy="106" r="4.5" fill="#30D8A8"/>
          <circle cx="671" cy="84"  r="4"   fill="#40E8B8"/>
        </g>
        <!-- Pink/magenta @ x=860 -->
        <g class="coralGlow">
          <line x1="860" y1="135" x2="860" y2="104" stroke="url(#cg3)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="860" y1="116" x2="844" y2="96"  stroke="url(#cg3)" stroke-width="3.8" stroke-linecap="round"/>
          <line x1="860" y1="116" x2="877" y2="93"  stroke="url(#cg3)" stroke-width="3.8" stroke-linecap="round"/>
          <line x1="844" y1="96"  x2="836" y2="82"  stroke="url(#cg3)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="844" y1="96"  x2="853" y2="80"  stroke="url(#cg3)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="877" y1="93"  x2="869" y2="79"  stroke="url(#cg3)" stroke-width="2.8" stroke-linecap="round"/>
          <line x1="877" y1="93"  x2="886" y2="80"  stroke="url(#cg3)" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="836" cy="80"  r="4.5" fill="#FF50C0"/>
          <circle cx="853" cy="78"  r="4"   fill="#FF40B0"/>
          <circle cx="869" cy="77"  r="4.5" fill="#FF50C0"/>
          <circle cx="886" cy="78"  r="4"   fill="#FF60CC"/>
          <circle cx="860" cy="102" r="5"   fill="#FF40B0"/>
        </g>
        <!-- Orange small @ x=1200 -->
        <g class="coralGlow2">
          <line x1="1200" y1="135" x2="1200" y2="110" stroke="url(#cg1)" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="1200" y1="120" x2="1187" y2="104" stroke="url(#cg1)" stroke-width="3.2" stroke-linecap="round"/>
          <line x1="1200" y1="120" x2="1214" y2="102" stroke="url(#cg1)" stroke-width="3.2" stroke-linecap="round"/>
          <line x1="1187" y1="104" x2="1180" y2="92"  stroke="url(#cg1)" stroke-width="2.4" stroke-linecap="round"/>
          <line x1="1214" y1="102" x2="1221" y2="90"  stroke="url(#cg1)" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="1180" cy="90"  r="4"   fill="#FF8050"/>
          <circle cx="1200" cy="108" r="4.5" fill="#FF6030"/>
          <circle cx="1221" cy="88"  r="4"   fill="#FF8050"/>
        </g>
        <!-- Brain corals -->
        <g class="coralGlow3">
          <ellipse cx="410" cy="134" rx="24" ry="14" fill="#C83A10" opacity="0.82"/>
          <ellipse cx="410" cy="128" rx="19" ry="10" fill="#E84A20" opacity="0.72"/>
          <path d="M396,128 C400,124 404,130 408,125 C412,120 416,126 420,122 C424,118 426,124 428,128" fill="none" stroke="rgba(255,120,60,.40)" stroke-width="1.5"/>
        </g>
        <g class="coralGlow">
          <ellipse cx="970" cy="134" rx="20" ry="12" fill="#A02880" opacity="0.80"/>
          <ellipse cx="970" cy="128" rx="15" ry="8"  fill="#C038A0" opacity="0.70"/>
          <path d="M958,128 C962,124 966,129 970,124 C974,119 978,125 982,128" fill="none" stroke="rgba(255,80,180,.40)" stroke-width="1.5"/>
        </g>
        <g class="coralGlow2">
          <ellipse cx="1350" cy="134" rx="22" ry="13" fill="#B06010" opacity="0.80"/>
          <ellipse cx="1350" cy="128" rx="17" ry="9"  fill="#D07820" opacity="0.70"/>
          <path d="M1338,128 C1342,123 1346,129 1350,124 C1354,119 1358,125 1362,128" fill="none" stroke="rgba(255,180,40,.38)" stroke-width="1.5"/>
        </g>

        <!-- FISH -->

        <!-- Fish 1: Clownfish (orange + white stripes), going RIGHT, depth y=48 -->
        <g class="fish fish1" transform="translate(-70,0)">
          <g transform="translate(0,48)">
            <g class="fishTail" transform="translate(-15,0)">
              <path d="M0,0 L-14,-10 L-18,0 L-14,10 Z" fill="#E86820"/>
            </g>
            <g class="fishBody">
              <ellipse cx="0" cy="0" rx="16" ry="8" fill="#F07030"/>
              <rect x="-3" y="-8" width="6" height="16" rx="3" fill="white" opacity="0.85"/>
              <rect x="6"  y="-7" width="4" height="14" rx="2" fill="white" opacity="0.75"/>
              <g class="dorsalFin">
                <path d="M-4,-8 C-2,-18 4,-20 8,-8" fill="#E86020" opacity="0.9"/>
              </g>
              <path d="M2,4 C8,12 14,10 12,4" fill="#F08040" opacity="0.80"/>
              <circle cx="10" cy="-1" r="3.5" fill="white"/>
              <circle cx="11" cy="-1" r="2"   fill="#1A1A1A"/>
              <circle cx="11.5" cy="-1.5" r="0.7" fill="white"/>
            </g>
          </g>
        </g>

        <!-- Fish 2: Blue tang, going LEFT, depth y=28 -->
        <g class="fish fish2" transform="translate(1520,0)">
          <g transform="translate(0,28)">
            <g class="fishTail2" transform="translate(-14,0)">
              <path d="M0,0 L-12,-9 L-16,0 L-12,9 Z" fill="#0870B8"/>
            </g>
            <g class="fishBody2">
              <ellipse cx="0" cy="0" rx="14" ry="9" fill="#1090D8"/>
              <ellipse cx="-10" cy="0" rx="5" ry="4" fill="#F0C030" opacity="0.80"/>
              <path d="M-8,-9 C-4,-9 4,-9 8,-9 C8,-4 6,4 8,9 C4,9 -4,9 -8,9 C-10,4 -10,-4 -8,-9 Z" fill="none" stroke="#0A4080" stroke-width="1.8" opacity="0.6"/>
              <g class="dorsalFin">
                <path d="M-5,-9 C-3,-20 5,-22 9,-9" fill="#0880C8" opacity="0.85"/>
              </g>
              <path d="M1,5 C7,13 13,11 11,5" fill="#1098E0" opacity="0.75"/>
              <circle cx="9"  cy="-1" r="3.2" fill="white"/>
              <circle cx="10" cy="-1" r="1.8" fill="#1A1A1A"/>
              <circle cx="10.5" cy="-1.5" r="0.6" fill="white"/>
            </g>
          </g>
        </g>

        <!-- Fish 3: Yellow butterfly fish, going RIGHT, depth y=100 -->
        <g class="fish fish3" transform="translate(-55,0)">
          <g transform="translate(0,100)">
            <g class="fishTail" transform="translate(-12,0)">
              <path d="M0,0 L-11,-8 L-14,0 L-11,8 Z" fill="#D4A010"/>
            </g>
            <g class="fishBody">
              <ellipse cx="0" cy="0" rx="12" ry="8" fill="#F0C820"/>
              <rect x="4" y="-8" width="5" height="16" rx="2" fill="#1A1A1A" opacity="0.70"/>
              <ellipse cx="0" cy="0" rx="12" ry="8" fill="none" stroke="#8B7000" stroke-width="1.5" opacity="0.6"/>
              <g class="dorsalFin">
                <path d="M-3,-8 C-1,-17 5,-18 7,-8" fill="#D4B010" opacity="0.88"/>
              </g>
              <path d="M1,4 C6,11 11,9 9,4" fill="#E8C020" opacity="0.75"/>
              <circle cx="8" cy="-1" r="2.8" fill="white"/>
              <circle cx="9" cy="-1" r="1.6" fill="#1A1A1A"/>
              <circle cx="9.5" cy="-1.5" r="0.5" fill="white"/>
            </g>
          </g>
        </g>

        <!-- Fish 4: Pink anthias, going LEFT, depth y=72 -->
        <g class="fish fish4" transform="translate(1520,0)">
          <g transform="translate(0,72)">
            <g class="fishTail2" transform="translate(-13,0)">
              <path d="M0,0 L-11,-8 L-15,0 L-11,8 Z" fill="#C02880"/>
            </g>
            <g class="fishBody2">
              <ellipse cx="0" cy="0" rx="13" ry="7" fill="#E040A0"/>
              <ellipse cx="2" cy="2" rx="9" ry="4" fill="#F060B0" opacity="0.55"/>
              <g class="dorsalFin">
                <path d="M-4,-7 C-2,-17 5,-18 8,-7" fill="#D030A0" opacity="0.88"/>
              </g>
              <path d="M1,4 C7,12 12,10 10,4" fill="#E850A8" opacity="0.78"/>
              <circle cx="8" cy="-1" r="3"   fill="white"/>
              <circle cx="9" cy="-1" r="1.7" fill="#1A1A1A"/>
              <circle cx="9.5" cy="-1.5" r="0.6" fill="white"/>
            </g>
          </g>
        </g>

        <!-- Fish 5: Green damselfish, going RIGHT, depth y=118 -->
        <g class="fish fish5" transform="translate(-50,0)">
          <g transform="translate(0,118)">
            <g class="fishTail" transform="translate(-11,0)">
              <path d="M0,0 L-10,-7 L-13,0 L-10,7 Z" fill="#18882A"/>
            </g>
            <g class="fishBody3">
              <ellipse cx="0" cy="0" rx="11" ry="6" fill="#28CC50"/>
              <ellipse cx="1" cy="1" rx="7" ry="3.5" fill="#38E060" opacity="0.55"/>
              <g class="dorsalFin">
                <path d="M-3,-6 C-1,-15 4,-16 6,-6" fill="#20B040" opacity="0.85"/>
              </g>
              <path d="M1,3 C5,10 10,8 8,3" fill="#30D055" opacity="0.78"/>
              <circle cx="7" cy="-1" r="2.5" fill="white"/>
              <circle cx="8" cy="-1" r="1.4" fill="#1A1A1A"/>
              <circle cx="8.4" cy="-1.4" r="0.5" fill="white"/>
            </g>
          </g>
        </g>

        <!-- Fish 6: Red snapper, going LEFT, depth y=55 -->
        <g class="fish fish6" transform="translate(1520,0)">
          <g transform="translate(0,55)">
            <g class="fishTail2" transform="translate(-14,0)">
              <path d="M0,0 L-12,-9 L-16,0 L-12,9 Z" fill="#A82010"/>
            </g>
            <g class="fishBody2">
              <ellipse cx="0" cy="0" rx="15" ry="7.5" fill="#D03020"/>
              <ellipse cx="1" cy="2" rx="10" ry="4"   fill="#E84030" opacity="0.55"/>
              <ellipse cx="2" cy="3" rx="8"  ry="2.5" fill="rgba(255,220,200,0.35)"/>
              <g class="dorsalFin">
                <path d="M-5,-7.5 C-3,-18 5,-20 9,-7.5" fill="#C02818" opacity="0.88"/>
              </g>
              <path d="M1,4 C7,13 13,11 11,4" fill="#D83828" opacity="0.78"/>
              <circle cx="9"  cy="-1" r="3.2" fill="white"/>
              <circle cx="10" cy="-1" r="1.8" fill="#1A1A1A"/>
              <circle cx="10.5" cy="-1.5" r="0.6" fill="white"/>
            </g>
          </g>
        </g>

        <!-- BUBBLES -->
        <circle class="bubble b1" cx="125"  cy="132" r="3.5" fill="rgba(180,230,255,0.25)" stroke="rgba(200,240,255,0.60)" stroke-width="1.2"/>
        <circle class="bubble b2" cx="450"  cy="134" r="2.5" fill="rgba(180,230,255,0.20)" stroke="rgba(200,240,255,0.55)" stroke-width="1"/>
        <circle class="bubble b3" cx="790"  cy="132" r="3"   fill="rgba(180,230,255,0.22)" stroke="rgba(200,240,255,0.58)" stroke-width="1.1"/>
        <circle class="bubble b4" cx="1110" cy="133" r="3.5" fill="rgba(180,230,255,0.20)" stroke="rgba(200,240,255,0.55)" stroke-width="1.2"/>
        <circle class="bubble b5" cx="1360" cy="132" r="2.5" fill="rgba(180,230,255,0.22)" stroke="rgba(200,240,255,0.50)" stroke-width="1"/>
        <circle class="bubble b6" cx="620"  cy="133" r="2"   fill="rgba(180,230,255,0.18)" stroke="rgba(200,240,255,0.48)" stroke-width="0.9"/>

        <!-- WATER SURFACE -->
        <g class="waterSurface">
          <path class="waveLayer1" d="M-100,16 C100,4 300,28 500,16 C700,4 900,28 1100,16 C1300,4 1440,16 1540,16 L1540,0 L-100,0 Z" fill="rgba(26,184,212,0.18)"/>
          <path class="waveLayer2" d="M-100,20 C150,8 350,32 600,20 C850,8 1050,32 1300,20 C1400,14 1540,20 1540,20 L1540,0 L-100,0 Z" fill="rgba(245,190,60,0.08)"/>
          <path class="waveLayer3" d="M-100,12 C200,24 400,6 700,12 C1000,18 1200,6 1440,12 C1480,14 1540,12 1540,12 L1540,0 L-100,0 Z" fill="rgba(26,184,212,0.12)"/>
        </g>
      </svg>
    `;
    document.body.appendChild(scene);
  }

  // ==============================
  // INIT
  // ==============================
  if(!sessionStorage.getItem("bannerClosed")) injectBanner();
  injectHeader();
  syncBrand();
  enableTocIfPresent();
  injectProgressBar();
  injectBackToTop();
  injectBreadcrumb();
  initPageTransitions();
  initParallax();
  fetchServerStatus();
  injectOceanScene();

})();
