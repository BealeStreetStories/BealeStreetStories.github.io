(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================

  const SITE = {
    name: "Project California RP",
    emoji: "🌴🌊🏖️",
    tagline: "California Based • Semi-serious RP",
    discordUrl: "",   // Add your Discord URL here
    connectUrl: "",   // Add your FiveM connect URL here
    tebexUrl: ""      // Add your Tebex URL here
  };

  // ==============================
  // GLOBAL HEADER (auto-injected)
  // ==============================
  function injectHeader(){
    if (document.querySelector(".globalHeader")) return;

    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          ${SITE.discordUrl ? `<a class="headerBtn" href="${SITE.discordUrl}" target="_blank" rel="noopener">Discord</a>` : ``}
          ${SITE.connectUrl ? `<a class="headerBtn" href="${SITE.connectUrl}" target="_blank" rel="noopener">Connect</a>` : ``}
          ${SITE.tebexUrl ? `<a class="headerBtn" href="${SITE.tebexUrl}" target="_blank" rel="noopener">Tebex</a>` : ``}
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // ==============================
  // BRAND SYNC
  // ==============================
  function syncBrand(){
    const brandEl = document.querySelector(".brand");
    if(brandEl) brandEl.textContent = SITE.name;
  }

  // ==============================
  // TABLE OF CONTENTS (if present)
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
      if(!q || el.textContent.toLowerCase().includes(q)){
        el.style.opacity = "";
      } else {
        el
