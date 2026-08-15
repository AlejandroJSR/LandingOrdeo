// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Toggle Producto / El proyecto: oculta/muestra secciones marcadas con
// data-view en vez de navegar a otra página. Los links con #ancla a una
// sección de la otra vista cambian de vista antes de hacer scroll, así
// nunca apuntan a algo oculto. Demo no tiene data-view — queda visible en
// las dos vistas, porque le sirve tanto al que quiere probar el producto
// como al inversionista que solo quiere dejar contacto.
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
  btn.addEventListener('click', () => {
    const view = btn.dataset.viewBtn;
    setView(view);
    const target = document.getElementById(view === 'proyecto' ? 'proyecto' : 'top');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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

// Formulario de contacto: se envía por fetch() al endpoint /ajax/ de
// FormSubmit en vez de dejar que el navegador navegue a la página de
// confirmación de FormSubmit — así el visitante nunca sale de la landing,
// y la confirmación es el propio botón cambiando de estado.
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const btn = document.getElementById('contact-form-btn');
  const btnLabelDefault = btn.textContent;
  const emailField = document.getElementById('c-email');
  const whatsappField = document.getElementById('c-whatsapp');

  // Chequeo propio, además del atributo pattern del HTML — así no depende
  // solo de la validación nativa del navegador para bloquear un email o un
  // WhatsApp de un solo carácter.
  function validateContact() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(emailField.value.trim());
    const digits = whatsappField.value.replace(/[^0-9]/g, '');
    const whatsappOk = digits.length >= 8;

    emailField.setCustomValidity(emailOk ? '' : 'Ingresá un email válido, ej. nombre@dominio.com');
    whatsappField.setCustomValidity(whatsappOk ? '' : 'Ingresá un número de WhatsApp válido, con código de país si podés.');

    if (!emailOk) { emailField.reportValidity(); return false; }
    if (!whatsappOk) { whatsappField.reportValidity(); return false; }
    return true;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    if (!validateContact()) return;

    btn.disabled = true;
    btn.textContent = 'Enviando…';
    btn.classList.remove('btn-error');

    const ajaxAction = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

    try {
      const res = await fetch(ajaxAction, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      if (!res.ok) throw new Error('request failed');

      btn.textContent = 'Enviado ✓';
      btn.classList.add('btn-success');
      contactForm.reset();
    } catch (err) {
      console.error('Error al enviar el formulario de contacto:', err);
      btn.disabled = false;
      btn.textContent = 'No se pudo enviar, probá de nuevo →';
      btn.classList.add('btn-error');
      setTimeout(() => {
        btn.textContent = btnLabelDefault;
        btn.classList.remove('btn-error');
      }, 4000);
    }
  });
}
