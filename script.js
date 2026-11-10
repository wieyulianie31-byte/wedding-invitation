/**
 * SCRIPT.JS - Interaktivitas Utama Undangan Digital
 */

document.addEventListener("DOMContentLoaded", () => {
  initURLParams();
  initCountdown();
  initGallery();
  initAudio();
  initGuestbook();
  initFormListeners();
  initScrollSpy();
});

/* -------------------------------------------------------------------------- */
/* 1. URL PARAMS & PERSONALISASI NAMA TAMU                                     */
/* -------------------------------------------------------------------------- */
function initURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const familyParam = urlParams.get('to');
  const guestParam = urlParams.get('guest');

  const familyEl = document.getElementById('guest-family-name');
  const guestEl = document.getElementById('guest-individual-name');

  // Keamanan: Gunakan textContent untuk mencegah injeksi XSS
  if (familyParam && guestParam) {
    familyEl.textContent = familyParam;
    guestEl.textContent = guestParam;
  } else if (familyParam) {
    familyEl.textContent = familyParam;
    guestEl.textContent = "";
  } else if (guestParam) {
    familyEl.textContent = guestParam;
    guestEl.textContent = "";
  } else {
    familyEl.textContent = "Tamu Undangan";
    guestEl.textContent = "";
  }
}

/* -------------------------------------------------------------------------- */
/* 2. AUDIO & OPENING COVER                                                  */
/* -------------------------------------------------------------------------- */
let isPlaying = false;
const audio = document.getElementById("wedding-audio");

function initAudio() {
  const btnOpen = document.getElementById("btn-open-invitation");
  const musicToggle = document.getElementById("music-toggle");
  const cover = document.getElementById("opening-cover");
  const mainContent = document.getElementById("main-content");

  btnOpen.addEventListener("click", () => {
    // Hide cover with animation
    cover.style.transform = "translateY(-100%)";
    cover.style.opacity = "0";
    setTimeout(() => {
      cover.classList.add("hidden");
      mainContent.classList.remove("hidden-content");
    }, 800);

    // Play Audio
    playMusic();
    musicToggle.classList.remove("hidden");
  });

  musicToggle.addEventListener("click", () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });
}

function playMusic() {
  audio.play().then(() => {
    isPlaying = true;
    const toggle = document.getElementById("music-toggle");
    toggle.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
  }).catch(err => {
    console.warn("Autoplay dicegah oleh browser:", err);
  });
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  const toggle = document.getElementById("music-toggle");
  toggle.innerHTML = '<i class="fas fa-play"></i>';
}

/* -------------------------------------------------------------------------- */
/* 3. COUNTDOWN TIMER                                                         */
/* -------------------------------------------------------------------------- */
function initCountdown() {
  const eventDate = new Date(WEDDING_CONFIG.event.dateIso).getTime();

  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      document.getElementById("countdown-timer").classList.add("hidden");
      document.getElementById("countdown-passed-msg").classList.remove("hidden");
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("cd-days").innerText = String(days).padStart(2, '0');
    document.getElementById("cd-hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("cd-minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("cd-seconds").innerText = String(seconds).padStart(2, '0');
  }, 1000);
}

/* -------------------------------------------------------------------------- */
/* 4. GALERI FOTO & LIGHTBOX                                                 */
/* -------------------------------------------------------------------------- */
let currentImgIdx = 0;

function initGallery() {
  const galleryContainer = document.getElementById("gallery-grid");
  galleryContainer.innerHTML = "";

  WEDDING_CONFIG.gallery.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/151515/D4AF37?text=Prewedding+Foto'">`;
    div.addEventListener("click", () => openLightbox(index));
    galleryContainer.appendChild(div);
  });

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => navigateLightbox(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => navigateLightbox(1));
}

function openLightbox(index) {
  currentImgIdx = index;
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  img.src = WEDDING_CONFIG.gallery[currentImgIdx].src;
  modal.classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox-modal").classList.add("hidden");
}

function navigateLightbox(direction) {
  currentImgIdx += direction;
  if (currentImgIdx < 0) currentImgIdx = WEDDING_CONFIG.gallery.length - 1;
  if (currentImgIdx >= WEDDING_CONFIG.gallery.length) currentImgIdx = 0;
  document.getElementById("lightbox-img").src = WEDDING_CONFIG.gallery[currentImgIdx].src;
}

/* -------------------------------------------------------------------------- */
/* 5. FORM SUBMISSION (RSVP & BUKU TAMU)                                       */
/* -------------------------------------------------------------------------- */
function initFormListeners() {
  // RSVP Submit
  document.getElementById("rsvp-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("rsvp-name").value.trim();
    const status = document.getElementById("rsvp-status").value;
    const btn = document.getElementById("btn-submit-rsvp");

    if (!name || !status) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    try {
      if (WEDDING_CONFIG.appsScriptUrl && WEDDING_CONFIG.appsScriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        await fetch(WEDDING_CONFIG.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ action: "rsvp", name: name, status: status })
        });
      }
      showToast("Terima kasih, konfirmasi Anda berhasil terkirim!");
      document.getElementById("rsvp-form").reset();
    } catch (err) {
      showToast("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> KIRIM KONFIRMASI';
    }
  });

  // Guestbook Submit
  document.getElementById("guestbook-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("gb-name").value.trim();
    const message = document.getElementById("gb-message").value.trim();
    const btn = document.getElementById("btn-submit-gb");

    if (!name || !message) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    try {
      if (WEDDING_CONFIG.appsScriptUrl && WEDDING_CONFIG.appsScriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        await fetch(WEDDING_CONFIG.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ action: "guestbook", name: name, message: message })
        });
      }
      
      // Tampilkan secara langsung di UI (Optimistic update)
      renderSingleMessage({ name, message, timestamp: "Baru saja" }, true);
      showToast("Ucapan Anda berhasil terkirim!");
      document.getElementById("guestbook-form").reset();
    } catch (err) {
      showToast("Gagal mengirim ucapan.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-comment-dots"></i> KIRIM UCAPAN';
    }
  });

  // WhatsApp Share Button
  document.getElementById("btn-share-wa").addEventListener("click", () => {
    const text = `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nDengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan:\nAdi Sutisna & Anita Intan Lestari\nSabtu, 28 November 2026.\n\nInformasi lengkap:\n${window.location.href}\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.`;
    
    if (navigator.share) {
      navigator.share({ title: 'Undangan Pernikahan Adi & Anita', text: text, url: window.location.href });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 6. FETCH & RENDER BUKU TAMU                                               */
/* -------------------------------------------------------------------------- */
async function initGuestbook() {
  const container = document.getElementById("guestbook-messages-container");
  if (!WEDDING_CONFIG.appsScriptUrl || WEDDING_CONFIG.appsScriptUrl === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
    container.innerHTML = `
      <div class="msg-card">
        <div class="msg-header"><span class="msg-author">Sistem</span></div>
        <div class="msg-body">Selamat menempuh hidup baru Adi & Anita. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.</div>
      </div>`;
    return;
  }

  try {
    const res = await fetch(`${WEDDING_CONFIG.appsScriptUrl}?action=getGuestbook`);
    const data = await res.json();
    container.innerHTML = "";
    if (data.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">Belum ada ucapan. Jadilah yang pertama!</p>`;
      return;
    }
    data.forEach(msg => renderSingleMessage(msg, false));
  } catch (e) {
    container.innerHTML = `<p class="text-center text-muted">Gagal memuat daftar ucapan.</p>`;
  }
}

function renderSingleMessage(data, prepend = false) {
  const container = document.getElementById("guestbook-messages-container");
  const card = document.createElement("div");
  card.className = "msg-card";

  // Escape HTML untuk mencegah XSS
  const safeName = escapeHTML(data.name);
  const safeMsg = escapeHTML(data.message);
  const safeDate = escapeHTML(data.timestamp || "Baru saja");

  card.innerHTML = `
    <div class="msg-header">
      <span class="msg-author">${safeName}</span>
      <span class="msg-date">${safeDate}</span>
    </div>
    <div class="msg-body">${safeMsg}</div>
  `;

  if (prepend && container.firstChild) {
    container.insertBefore(card, container.firstChild);
  } else {
    container.appendChild(card);
  }
}

/* -------------------------------------------------------------------------- */
/* 7. UTILITIES (TOAST & CLIPBOARD)                                           */
/* -------------------------------------------------------------------------- */
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Nomor rekening ${label} berhasil disalin.`);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3500);
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

/* -------------------------------------------------------------------------- */
/* 8. SCROLLSPY UNTUK BOTTOM NAV                                              */
/* -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });
}
