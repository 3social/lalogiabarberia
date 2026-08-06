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

  /* coverflow carousel */
  var coverflowFrame = document.querySelector('.coverflow__frame');
  var coverflowSlides = document.querySelectorAll('.coverflow__slide');
  var coverflowPrevBtn = document.querySelector('.coverflow__nav--prev');
  var coverflowNextBtn = document.querySelector('.coverflow__nav--next');
  var coverflowDots = document.querySelectorAll('.coverflow__dot');

  if (coverflowFrame && coverflowSlides.length > 0) {
    var coverflowIndex = 0;
    var coverflowCount = coverflowSlides.length;
    var isDragging = false;
    var dragStart = 0;
    var dragCurrent = 0;

    function updateCoverflow() {
      coverflowSlides.forEach(function(slide, i) {
        slide.classList.remove('is-center', 'is-prev', 'is-next', 'is-prev-2', 'is-next-2');

        var offset = (i - coverflowIndex + coverflowCount) % coverflowCount;
        if (offset > coverflowCount / 2) offset -= coverflowCount;

        if (offset === 0) {
          slide.classList.add('is-center');
          var angle = 0;
          var distance = 0;
          slide.style.transform = 'translate(-50%, -50%) rotateY(' + angle + 'deg) translateZ(' + distance + 'px)';
          slide.style.opacity = '1';
          slide.style.zIndex = '10';
        } else if (offset === -1) {
          slide.classList.add('is-prev');
          var angle = 45;
          var distance = -200;
          slide.style.transform = 'translate(-50%, -50%) rotateY(' + angle + 'deg) translateZ(' + distance + 'px)';
          slide.style.opacity = '0.6';
          slide.style.zIndex = '5';
        } else if (offset === 1) {
          slide.classList.add('is-next');
          var angle = -45;
          var distance = -200;
          slide.style.transform = 'translate(-50%, -50%) rotateY(' + angle + 'deg) translateZ(' + distance + 'px)';
          slide.style.opacity = '0.6';
          slide.style.zIndex = '5';
        } else if (offset === -2) {
          slide.classList.add('is-prev-2');
          var angle = 70;
          var distance = -350;
          slide.style.transform = 'translate(-50%, -50%) rotateY(' + angle + 'deg) translateZ(' + distance + 'px)';
          slide.style.opacity = '0.3';
          slide.style.zIndex = '1';
        } else if (offset === 2) {
          slide.classList.add('is-next-2');
          var angle = -70;
          var distance = -350;
          slide.style.transform = 'translate(-50%, -50%) rotateY(' + angle + 'deg) translateZ(' + distance + 'px)';
          slide.style.opacity = '0.3';
          slide.style.zIndex = '1';
        } else {
          slide.style.opacity = '0';
          slide.style.zIndex = '0';
        }
      });

      coverflowDots.forEach(function(dot, i) {
        dot.classList.toggle('coverflow__dot--active', i === coverflowIndex);
        dot.setAttribute('aria-selected', i === coverflowIndex ? 'true' : 'false');
      });
    }

    function goToSlide(index) {
      coverflowIndex = (index % coverflowCount + coverflowCount) % coverflowCount;
      updateCoverflow();
    }

    function nextSlide() {
      goToSlide(coverflowIndex + 1);
    }

    function prevSlide() {
      goToSlide(coverflowIndex - 1);
    }

    /* Eventos de click */
    if (coverflowPrevBtn) coverflowPrevBtn.addEventListener('click', prevSlide);
    if (coverflowNextBtn) coverflowNextBtn.addEventListener('click', nextSlide);

    coverflowDots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { goToSlide(i); });
    });

    /* Teclado */
    coverflowFrame.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    });

    /* Drag */
    coverflowFrame.addEventListener('pointerdown', function(e) {
      isDragging = true;
      dragStart = e.clientX;
    });

    document.addEventListener('pointermove', function(e) {
      if (!isDragging) return;
      dragCurrent = e.clientX;
    });

    document.addEventListener('pointerup', function() {
      if (!isDragging) return;
      isDragging = false;
      var diff = dragStart - dragCurrent;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    });

    updateCoverflow();
  }
})();
