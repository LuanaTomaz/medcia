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
let doctorTimer = setInterval(() => showDoctor(doctorIndex + 1), 8000);
[doctorPrev, doctorNext, doctorTrack].forEach((element) => {
  element?.addEventListener('mouseenter', () => clearInterval(doctorTimer));
  element?.addEventListener('mouseleave', () => { clearInterval(doctorTimer); doctorTimer = setInterval(() => showDoctor(doctorIndex + 1), 8000); });
});

// Carrossel de avaliações: avança um cartão a cada 8 segundos.
const reviewTrack = document.querySelector('#reviewTrack');
const reviewCards = Array.from(document.querySelectorAll('.review-card'));
const reviewPrev = document.querySelector('.review-prev');
const reviewNext = document.querySelector('.review-next');
const reviewStatus = document.querySelector('.review-status');
let reviewIndex = 0;
function showReviews(index) {
  if (!reviewTrack || !reviewCards.length) return;
  reviewIndex = (index + reviewCards.length) % reviewCards.length;
  const card = reviewCards[reviewIndex];
  const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
  const step = card.getBoundingClientRect().width + gap;
  // Limita o deslocamento ao fim real da faixa para não deixar um espaço vazio.
  const maxOffset = Math.max(0, reviewTrack.scrollWidth - reviewTrack.parentElement.clientWidth);
  const offset = Math.min(reviewIndex * step, maxOffset);
  reviewTrack.style.transform = `translateX(-${offset}px)`;
  if (reviewStatus) reviewStatus.textContent = `Avaliação ${reviewIndex + 1} de ${reviewCards.length}`;
}
reviewPrev?.addEventListener('click', () => showReviews(reviewIndex - 1));
reviewNext?.addEventListener('click', () => showReviews(reviewIndex + 1));
showReviews(0);
let reviewTimer = setInterval(() => showReviews(reviewIndex + 1), 8000);
[reviewPrev, reviewNext, reviewTrack].forEach((element) => {
  element?.addEventListener('mouseenter', () => clearInterval(reviewTimer));
  element?.addEventListener('mouseleave', () => { clearInterval(reviewTimer); reviewTimer = setInterval(() => showReviews(reviewIndex + 1), 8000); });
});
window.addEventListener('resize', () => showReviews(reviewIndex));
