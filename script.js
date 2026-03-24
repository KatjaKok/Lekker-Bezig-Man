// ========== Initialize Lucide Icons ==========
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initScrollReveal();
  initStickyHeader();
  initMobileMenu();
  initDropdown();
  initCalculator();
  initContactForm();
  initCopyright();
  initProjectModal();
});

// ========== Scroll Reveal ==========
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ========== Sticky Header ==========
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
}

// ========== Mobile Menu ==========
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');

  if (!toggle || !menu || !icon) return;

  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('hidden', !open);
    icon.setAttribute('data-lucide', open ? 'x' : 'menu');
    lucide.createIcons();
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      open = false;
      menu.classList.add('hidden');
      icon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });
}

// ========== Dropdown ==========
function initDropdown() {
  const container = document.getElementById('diensten-dropdown');
  const menu = document.getElementById('dropdown-menu');

  if (!container || !menu) return;

  container.addEventListener('mouseenter', () => menu.classList.remove('hidden'));
  container.addEventListener('mouseleave', () => menu.classList.add('hidden'));
}

// ========== Price Calculator ==========
function initCalculator() {
  const sizeInput = document.getElementById('roofSize');
  const materialSelect = document.getElementById('material');
  const serviceSelect = document.getElementById('serviceType');
  const roofType = document.getElementById('roofType');
  const priceResult = document.getElementById('price-result');

  if (!sizeInput || !materialSelect || !serviceSelect || !roofType || !priceResult) return;

  const materialPrices = { pannen: 45, bitumen: 35, epdm: 55, zink: 85, sedum: 95 };
  const serviceMultipliers = { reparatie: 0.3, renovatie: 1.0, spoed: 1.5, isolatie: 0.6, afwerking: 0.4 };
  const selectedExtras = new Set();

  function calculate() {
    const size = parseInt(sizeInput.value) || 80;
    const matPrice = materialPrices[materialSelect.value] || 45;
    const srvMult = serviceMultipliers[serviceSelect.value] || 1.0;

    let total = matPrice * size * srvMult;
    if (selectedExtras.has('steiger')) total += 800;
    if (selectedExtras.has('goten')) total += 25 * Math.sqrt(size) * 4;
    if (selectedExtras.has('isolatie_extra')) total += 20 * size;

    priceResult.textContent = '€' + Math.round(total).toLocaleString('nl-NL');
  }

  [sizeInput, materialSelect, serviceSelect, roofType].forEach((el) => {
    el.addEventListener('change', calculate);
    el.addEventListener('input', calculate);
  });

  document.querySelectorAll('.extra-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const extra = btn.dataset.extra;
      if (selectedExtras.has(extra)) {
        selectedExtras.delete(extra);
        btn.classList.remove('active');
      } else {
        selectedExtras.add(extra);
        btn.classList.add('active');
      }
      calculate();
    });
  });

  calculate();
}

// ========== Contact Form ==========
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('hidden');
    success.classList.remove('hidden');
  });
}

// ========== Copyright Year ==========
function initCopyright() {
  const el = document.getElementById('copyright-text');
  if (!el) return;

  el.textContent =
    `© ${new Date().getFullYear()} Lekker Bezig Man · lekkerbezigman.nl · Alle rechten voorbehouden.`;
}

// ========== Project Modal ==========
function initProjectModal() {
  const cards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const image = document.getElementById('modal-image');
  const title = document.getElementById('modal-title');
  const description = document.getElementById('modal-description');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  if (!cards.length || !modal || !closeBtn || !image || !title || !description || !prevBtn || !nextBtn) return;

  const backdrop = modal.querySelector('.project-modal-backdrop');
  if (!backdrop) return;

  let currentImages = [];
  let currentIndex = 0;

  function renderSlide() {
    if (!currentImages.length) return;
    image.src = currentImages[currentIndex].trim();
    image.alt = title.textContent;
  }

  function openModal(card) {
    currentImages = (card.dataset.images || '').split(',').filter(Boolean);
    currentIndex = 0;

    title.textContent = card.dataset.title || '';
    description.textContent = card.dataset.description || '';

    renderSlide();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    image.src = '';
    image.alt = '';
    currentImages = [];
    currentIndex = 0;
  }

  function showNext() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderSlide();
  }

  function showPrev() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderSlide();
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;

    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

const panelData = {
  werktijden: {
    label: "Planning",
    title: "Werktijden: ma-vr 07:00–18:00",
    text: "Tijdens reguliere werkdagen voeren wij inspecties, onderhoud en renovaties uit.",
    extra: "Door duidelijke werktijden kunnen wij offertes en uitvoering beter plannen."
  },
  spoed: {
    label: "Service",
    title: "Spoedservice 24/7 beschikbaar",
    text: "Bij lekkages, stormschade of acute dakproblemen staan wij dag en nacht klaar.",
    extra: "Snelle reactie voorkomt vaak grotere schade."
  },
  planning: {
    label: "Condities",
    title: "Weersafhankelijke planning",
    text: "Dakwerk is sterk afhankelijk van regen, wind en temperatuur.",
    extra: "Een goede planning verhoogt veiligheid en kwaliteit."
  },
  actie: {
    label: "Actie",
    title: "Voorjaarsactie: 10% korting op dakinspectie",
    text: "Nieuwe aanvragen profiteren tijdelijk van korting op een professionele dakinspectie.",
    extra: "Preventieve inspectie is goedkoper dan grote reparaties achteraf."
  }
};

function openPanel(key) {
  const panel = document.getElementById("slidePanel");
  const content = document.getElementById("slideContent");

  document.getElementById("panelLabel").textContent = panelData[key].label;
  document.getElementById("panelTitle").textContent = panelData[key].title;
  document.getElementById("panelText").textContent = panelData[key].text;
  document.getElementById("panelExtra").textContent = panelData[key].extra;

  panel.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");

  requestAnimationFrame(() => {
    content.classList.remove("translate-x-full");
    content.classList.add("translate-x-0");
  });
}

function closePanel() {
  const panel = document.getElementById("slidePanel");
  const content = document.getElementById("slideContent");

  content.classList.remove("translate-x-0");
  content.classList.add("translate-x-full");

  setTimeout(() => {
    panel.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }, 300);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closePanel();
  }
});

const serviceModal = document.getElementById('service-modal');
const modalTitle = document.getElementById('modal-title');
const modalLabel = document.getElementById('modal-label');
const modalDescription = document.getElementById('modal-description');
const modalPoints = document.getElementById('modal-points');

function openServiceModal(service) {
  modalTitle.textContent = service.title || '';
  modalLabel.textContent = service.label || '';
  modalDescription.textContent = service.description || '';

  modalPoints.innerHTML = '';

  if (service.points && Array.isArray(service.points)) {
    service.points.forEach(point => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-3 text-white/80';

      li.innerHTML = `
        <span class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/15">
          <span class="block h-2 w-2 rounded-full bg-gold-light"></span>
        </span>
        <span>${point}</span>
      `;

      modalPoints.appendChild(li);
    });
  }

  serviceModal.classList.remove('hidden');
  serviceModal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

function closeServiceModal() {
  serviceModal.classList.add('hidden');
  serviceModal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeServiceModal();
  }
});
