// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Toggle Producto / El proyecto: oculta/muestra secciones marcadas con
// data-view en vez de navegar a otra página. Los links con #ancla a una
// sección de la otra vista cambian de vista antes de hacer scroll, así
// nunca apuntan a algo oculto.
const viewButtons = document.querySelectorAll('[data-view-btn]');

function setView(view) {
  document.body.classList.toggle('view-proyecto', view === 'proyecto');
  viewButtons.forEach((btn) => {
    const active = btn.dataset.viewBtn === view;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
  });
}

viewButtons.forEach((btn) => {
  btn.addEventListener('click', () => setView(btn.dataset.viewBtn));
});

// Carrusel de capturas del hero: rota sola cada 4.5s, se puede saltar con
// los puntitos, se pausa al pasar el mouse y no arranca sola si el
// visitante pidió menos movimiento.
const carousel = document.getElementById('hero-carousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.device-img');
  const dots = document.querySelectorAll('[data-slide-btn]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
  }

  function start() {
    if (reduceMotion || slides.length < 2) return;
    stop();
    timer = setInterval(() => goTo(current + 1), 4500);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.slideBtn));
      start();
    });
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  start();
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    if (target.dataset.view === 'proyecto' || target.dataset.view === 'producto') {
      setView(target.dataset.view);
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Formulario de demo: sin backend propio todavía, así que arma un mailto
// con los datos precargados en vez de "perderlos" silenciosamente. El día
// que haya un servicio de formularios real (Formspree, o una función
// serverless de Vercel con Resend), este bloque se reemplaza por un
// fetch() a ese endpoint sin tocar el resto del formulario.
const DEMO_EMAIL = 'ordeoapp@gmail.com';

const form = document.getElementById('demo-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const negocio = form.negocio.value.trim();
  const email = form.email.value.trim();
  const telefono = form.telefono.value.trim();
  const mensaje = form.mensaje.value.trim();

  if (!nombre || !negocio || !email) {
    note.textContent = 'Completa nombre, negocio y email para continuar.';
    note.classList.remove('form-note--sent');
    return;
  }

  const subject = `Solicitud de demo — ${negocio}`;
  const bodyLines = [
    `Nombre: ${nombre}`,
    `Negocio: ${negocio}`,
    `Email: ${email}`,
    telefono ? `Teléfono: ${telefono}` : null,
    mensaje ? `\nMensaje:\n${mensaje}` : null,
  ].filter(Boolean);

  const mailto = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

  window.location.href = mailto;

  note.textContent = 'Se abrió tu cliente de correo con la solicitud lista — solo falta que le des enviar.';
  note.classList.add('form-note--sent');
});
