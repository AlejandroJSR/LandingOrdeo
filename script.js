// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

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
    note.textContent = 'Completá nombre, negocio y email para continuar.';
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
