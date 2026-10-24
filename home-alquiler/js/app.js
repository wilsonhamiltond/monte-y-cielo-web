(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  function waLink(property) {
    const text = property
      ? `Hola, quiero reservar *${property.name}*. ¿Tienen disponibilidad para las fechas: ___?`
      : "Hola, quiero información sobre los alojamientos disponibles.";
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function formatPhone(n) {
    return "+" + n;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- Site-wide text ----------
  document.title = `${SITE.brandName} — Alquiler de apartamentos y casa`;
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = SITE.brandName));
  $("#tagline").textContent = SITE.tagline;
  $("#location").textContent = SITE.location;
  $("#year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = waLink(null)));
  $("#phone-text").textContent = formatPhone(SITE.whatsappNumber);

  // ---------- Cards ----------
  const grid = $("#grid");
  grid.innerHTML = PROPERTIES.map(
    (p) => `
    <article class="card">
      <button class="card-media" data-open="${p.id}" aria-label="Ver detalles de ${escapeHtml(p.name)}">
        <img src="${p.photos[0]}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <span class="badge">${escapeHtml(p.type)}</span>
        <span class="photo-count">📷 ${p.photos.length} fotos</span>
      </button>
      <div class="card-body">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="summary">${escapeHtml(p.summary)}</p>
        <ul class="specs">
          <li>👥 ${p.guests} huéspedes</li>
          <li>🛏️ ${p.bedrooms} hab.</li>
          <li>🛁 ${p.bathrooms} baños</li>
        </ul>
        <p class="price">${escapeHtml(p.price)}</p>
        <div class="card-actions">
          <button class="btn btn-ghost" data-open="${p.id}">Ver detalles</button>
          <a class="btn btn-wa" href="${waLink(p)}" target="_blank" rel="noopener">Reservar aquí</a>
        </div>
      </div>
    </article>`
  ).join("");

  // ---------- Detail modal with gallery ----------
  const modal = $("#modal");
  let current = null;
  let idx = 0;

  function renderGallery() {
    $("#g-main").src = current.photos[idx];
    $("#g-main").alt = `${current.name} — foto ${idx + 1}`;
    $("#g-counter").textContent = `${idx + 1} / ${current.photos.length}`;
    $("#g-thumbs").querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === idx));
  }

  function openModal(id) {
    current = PROPERTIES.find((p) => p.id === id);
    if (!current) return;
    idx = 0;
    $("#m-type").textContent = current.type;
    $("#m-title").textContent = current.name;
    $("#m-desc").textContent = current.description;
    $("#m-price").textContent = current.price;
    $("#m-specs").innerHTML = `
      <li>👥 ${current.guests} huéspedes</li>
      <li>🛏️ ${current.bedrooms} habitaciones</li>
      <li>🛁 ${current.bathrooms} baños</li>`;
    $("#m-amenities").innerHTML = current.amenities.map((a) => `<li>✓ ${escapeHtml(a)}</li>`).join("");
    $("#m-wa").href = waLink(current);
    $("#g-thumbs").innerHTML = current.photos
      .map((src, i) => `<button data-idx="${i}" aria-label="Foto ${i + 1}"><img src="${src}" alt="" loading="lazy" /></button>`)
      .join("");
    renderGallery();
    modal.showModal();
    document.body.classList.add("no-scroll");
  }

  function step(d) {
    idx = (idx + d + current.photos.length) % current.photos.length;
    renderGallery();
  }

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) openModal(opener.dataset.open);
    const thumb = e.target.closest("#g-thumbs [data-idx]");
    if (thumb) { idx = +thumb.dataset.idx; renderGallery(); }
  });
  $("#g-prev").addEventListener("click", () => step(-1));
  $("#g-next").addEventListener("click", () => step(1));
  $("#m-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener("close", () => document.body.classList.remove("no-scroll"));
  document.addEventListener("keydown", (e) => {
    if (!modal.open) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // Swipe on mobile
  let x0 = null;
  $("#g-main").addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  $("#g-main").addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    x0 = null;
  });
})();
