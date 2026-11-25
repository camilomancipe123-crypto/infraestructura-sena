const menu = document.querySelector('.menu');
const nav = document.querySelector('.links');
const themeButton = document.querySelector('#theme-toggle');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  themeButton.textContent = theme === 'light' ? '☾ Oscuro' : '☀ Claro';
  themeButton.setAttribute('aria-label', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('mi-formacion-theme') || 'dark'; } catch (_) {}
setTheme(savedTheme);
themeButton.addEventListener('click', () => {
  const theme = document.body.classList.contains('light') ? 'dark' : 'light';
  setTheme(theme);
  try { localStorage.setItem('mi-formacion-theme', theme); } catch (_) {}
});
const topButton = document.querySelector('#back-to-top');
window.addEventListener('scroll', () => { topButton.hidden = window.scrollY < 400; }, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.observe').forEach(element => observer.observe(element));
}
const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const search = document.querySelector('#site-search');
if (search) {
  const index = [
    ['Ofimática y documentos', 'ofimatica.html#documentos', 'texto word procesadores'], ['Hojas de cálculo', 'ofimatica.html#hojas', 'excel formulas'], ['Presentaciones y colaboración', 'ofimatica.html#colaboracion', 'office diapositivas'],
    ['Mantenimiento de equipos y hardware', 'mantenimiento.html#hardware', 'componentes computador'], ['Mantenimiento preventivo y limpieza', 'mantenimiento.html#preventivo', 'limpieza seguridad'], ['Mantenimiento correctivo y diagnóstico', 'mantenimiento.html#correctivo', 'fallas herramientas'],
    ['Infraestructura y necesidades', 'infraestructura.html#necesidades', 'planificacion documentacion'], ['Redes y topologías', 'infraestructura.html#redes', 'router switch cableado'], ['Configuración y sistemas operativos', 'configuracion.html#sistema', 'windows linux instalacion'], ['Configuración de redes y periféricos', 'configuracion.html#red', 'conectividad impresora'], ['Virtualización y seguridad', 'configuracion.html#virtualizacion', 'virtualbox programas'],
    ['Herramientas tecnológicas', 'Webtemas.html#herramientas', 'visual studio code windows linux office hardware'], ['Proyectos y prácticas', 'Webtemas.html#proyectos', 'demostracion'], ['Cuestionario TIC', 'Webtemas.html#cuestionario', 'hardware software mantenimiento redes ofimatica'], ['Glosario tecnológico', 'Webtemas.html#glosario', 'cpu ram ssd hdd ip bios uefi']
  ];
  const results = document.querySelector('#search-results');
  search.addEventListener('input', () => {
    results.replaceChildren();
    const query = normalize(search.value.trim());
    if (!query) return;
    const matches = index.filter(item => normalize(item.join(' ')).includes(query));
    if (!matches.length) { results.textContent = 'No se encontraron resultados.'; return; }
    matches.forEach(([title, href]) => { const link = document.createElement('a'); link.href = href; link.textContent = title; results.append(link); });
  });
}
const glossaryFilter = document.querySelector('#glossary-filter');
if (glossaryFilter) glossaryFilter.addEventListener('input', () => {
  const query = normalize(glossaryFilter.value.trim());
  document.querySelectorAll('.glossary-item').forEach(item => { item.hidden = !normalize(item.textContent).includes(query); });
});
const quiz = document.querySelector('#quiz-form');
if (quiz) {
  const answers = [
    ['b', 'La RAM almacena temporalmente datos y programas en uso.'],
    ['a', 'El sistema operativo administra los recursos del equipo y permite ejecutar aplicaciones.'],
    ['b', 'La limpieza periódica forma parte del mantenimiento preventivo.'],
    ['a', 'Un switch conecta dispositivos dentro de una red local.'],
    ['b', 'Una hoja de cálculo organiza datos y permite realizar cálculos con fórmulas.']
  ];
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    let score = 0;
    let complete = true;
    answers.forEach(([correct, explanation], index) => {
      const selected = quiz.querySelector(`input[name="q${index}"]:checked`);
      const feedback = quiz.querySelector(`#feedback-${index}`);
      if (!selected) { complete = false; feedback.textContent = 'Selecciona una respuesta.'; return; }
      const right = selected.value === correct;
      if (right) score++;
      feedback.textContent = `${right ? 'Correcto.' : 'Incorrecto.'} ${explanation}`;
    });
    document.querySelector('#quiz-score').textContent = complete ? `Puntuación final: ${score} de ${answers.length}.` : 'Responde todas las preguntas para obtener la puntuación final.';
  });
  quiz.addEventListener('reset', () => { quiz.querySelectorAll('.feedback').forEach(element => { element.textContent = ''; }); document.querySelector('#quiz-score').textContent = ''; });
}

