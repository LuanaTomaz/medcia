/* =========================================================
   MEDCIA — INTERAÇÕES DO SITE
   1. Navegação suave e indicação da seção atual
   2. Carrossel de médicos (setas + avanço automático)
   3. Carrossel de avaliações (setas + avanço automático)
   ========================================================= */

// Navegação suave para os links internos da página.
const sectionLinks = Array.from(document.querySelectorAll('.nav-dot'));
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const selector = link.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Destaca a bolinha correspondente à seção que está na tela.
const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Função auxiliar: pausa o avanço automático enquanto o mouse está sobre o carrossel.
function autoplay(elements, step, ms) {
  let timer = setInterval(step, ms);
  elements.forEach((el) => {
    el?.addEventListener('mouseenter', () => clearInterval(timer));
    el?.addEventListener('mouseleave', () => { clearInterval(timer); timer = setInterval(step, ms); });
  });
}

// Carrossel de médicos: troca um perfil a cada 8 segundos.
const doctorTrack = document.querySelector('.doctor-track');
const doctorSlides = Array.from(document.querySelectorAll('.doctor-slide'));
const doctorPrev = document.querySelector('.carousel-arrow.prev');
const doctorNext = document.querySelector('.carousel-arrow.next');
const doctorStatus = document.querySelector('.carousel-status');
let doctorIndex = 0;
function showDoctor(index) {
  if (!doctorTrack || !doctorSlides.length) return;
  doctorIndex = (index + doctorSlides.length) % doctorSlides.length;
  doctorTrack.style.transform = `translateX(-${doctorIndex * 100}%)`;
  if (doctorStatus) doctorStatus.textContent = `Médico ${doctorIndex + 1} de ${doctorSlides.length}`;
  doctorSlides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== doctorIndex)));
}
doctorPrev?.addEventListener('click', () => showDoctor(doctorIndex - 1));
doctorNext?.addEventListener('click', () => showDoctor(doctorIndex + 1));
showDoctor(0);
autoplay([doctorPrev, doctorNext, doctorTrack], () => showDoctor(doctorIndex + 1), 8000);

// Carrossel de avaliações: mostra 3 cartões (2 em tablet, 1 no celular) e avança um por vez.
const reviewTrack = document.querySelector('#reviewTrack');
const reviewCards = Array.from(document.querySelectorAll('.review-card'));
const reviewPrev = document.querySelector('.review-prev');
const reviewNext = document.querySelector('.review-next');
const reviewStatus = document.querySelector('.review-status');
let reviewIndex = 0;
function showReviews(index) {
  if (!reviewTrack || !reviewCards.length) return;
  const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
  const cardWidth = reviewCards[0].getBoundingClientRect().width;
  const step = cardWidth + gap;
  const visible = Math.max(1, Math.round((reviewTrack.parentElement.clientWidth + gap) / step));
  const lastIndex = Math.max(0, reviewCards.length - visible);
  reviewIndex = index > lastIndex ? 0 : index < 0 ? lastIndex : index;
  reviewTrack.style.transform = `translateX(-${reviewIndex * step}px)`;
  if (reviewStatus) {
    const total = reviewCards.length;
    reviewStatus.textContent = visible === 1
      ? `Avaliação ${reviewIndex + 1} de ${total}`
      : `Avaliações ${reviewIndex + 1}–${reviewIndex + visible} de ${total}`;
  }
}
reviewPrev?.addEventListener('click', () => showReviews(reviewIndex - 1));
reviewNext?.addEventListener('click', () => showReviews(reviewIndex + 1));
showReviews(0);
autoplay([reviewPrev, reviewNext, reviewTrack], () => showReviews(reviewIndex + 1), 8000);
window.addEventListener('resize', () => showReviews(reviewIndex));
