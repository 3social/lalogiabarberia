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
  var conRevelado = document.querySelectorAll('.portada, .junta, .casa, .carta, .rito, .galeria, .resenas, .visita, .cierre');
  if (!suave || !('IntersectionObserver' in window)) {
    conRevelado.forEach(function (s) { s.classList.add('is-in'); });
    document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('is-in'); });
    return;
  }
  var ojo = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); ojo.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  conRevelado.forEach(function (s) { ojo.observe(s); });

  /* carrusel fluido */
  var carrusel = document.querySelector('.galeria__carrusel');
  if (carrusel) {
    var esScrollable = carrusel.scrollWidth > carrusel.clientWidth;
    if (esScrollable) {
      carrusel.style.cursor = 'grab';
      carrusel.addEventListener('mousedown', function (e) {
        var inicio = e.pageX - carrusel.offsetLeft;
        var scroll = carrusel.scrollLeft;
        carrusel.style.cursor = 'grabbing';
        var mover = function (m) {
          var x = m.pageX - carrusel.offsetLeft;
          carrusel.scrollLeft = scroll - (x - inicio);
        };
        var soltar = function () {
          carrusel.style.cursor = 'grab';
          document.removeEventListener('mousemove', mover);
          document.removeEventListener('mouseup', soltar);
        };
        document.addEventListener('mousemove', mover);
        document.addEventListener('mouseup', soltar);
      });
    }
  }
})();
