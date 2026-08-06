/* La Logia Barbería — lo mínimo indispensable. Sin librerías. */
(function () {
  'use strict';

  var suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* año del pie */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* la barra se pinta al salir de la portada */
  var barra = document.getElementById('barra');
  var portada = document.querySelector('.portada');
  if (barra && portada && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      barra.classList.toggle('esta-abajo', !e[0].isIntersecting);
    }, { rootMargin: '-90% 0px 0px 0px' }).observe(portada);
  }

  /* revelado por secciones */
  var conRevelado = document.querySelectorAll('.portada, .junta, .casa, .carta, .rito, .visita, .cierre');
  if (!suave || !('IntersectionObserver' in window)) {
    conRevelado.forEach(function (s) { s.classList.add('is-in'); });
    return;
  }
  var ojo = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); ojo.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  conRevelado.forEach(function (s) { ojo.observe(s); });
})();
