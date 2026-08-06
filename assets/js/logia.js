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

  /* kinetic grid — helper function */
  function initKineticGrid(canvasId, containerId) {
    var kineticCanvas = document.getElementById(canvasId);
    if (!kineticCanvas) return;

    var ctx = kineticCanvas.getContext('2d');
    var mousePos = { x: -9999, y: -9999 };
    var targetMousePos = { x: -9999, y: -9999 };
    var ripples = [];
    var rafId = null;

    var CELL_SIZE = 55;
    var INFLUENCE_RADIUS = 260;
    var MAX_WARP = 24;
    var DOT_SPACING = 28;
    var LERP_SPEED = 0.08;

    var LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 };
    var NODE_BASE_RADIUS = 1.8;
    var NODE_ACTIVE_RADIUS = 3.2;

    var THEME = {
      bg: '#0B0B0C',
      lineActive: { r: 216, g: 30, b: 21, a: 0.9 },
      nodeActive: { r: 216, g: 30, b: 21, a: 1.0 },
      glow: '216,30,21',
      ripple: '255,100,80'
    };

    function lerpN(a, b, t) {
      return a + (b - a) * t;
    }

    function lerpColor(base, active, t) {
      var r = Math.round(lerpN(base.r, active.r, t));
      var g = Math.round(lerpN(base.g, active.g, t));
      var b = Math.round(lerpN(base.b, active.b, t));
      var a = lerpN(base.a, active.a, t);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
    }

    function setCanvasSize() {
      var container = document.getElementById(containerId);
      if (!container) return;
      var rect = container.getBoundingClientRect();
      kineticCanvas.width = rect.width;
      kineticCanvas.height = rect.height;
    }

    function getWarpedPoint(gx, gy, col, row, mouse, ripples, cols, rows) {
      var edgeMargin = 1.5;
      var colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
      var rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
      var pinFactor = colPin * colPin * rowPin * rowPin;

      var dx = gx - mouse.x;
      var dy = gy - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      var rx = 0, ry = 0;
      for (var i = 0; i < ripples.length; i++) {
        var r = ripples[i];
        var rdx = gx - r.x;
        var rdy = gy - r.y;
        var rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        var waveWidth = 55;
        var diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          var strength = (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
          var angle = Math.atan2(rdy, rdx);
          var sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        var t = dist / INFLUENCE_RADIUS;
        var eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        var warpAmt = eased * MAX_WARP * pinFactor;
        var angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry
          },
          proximity: proximity
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity: proximity };
    }

    function animate() {
      var w = kineticCanvas.width;
      var h = kineticCanvas.height;

      mousePos.x = lerpN(mousePos.x, targetMousePos.x, LERP_SPEED);
      mousePos.y = lerpN(mousePos.y, targetMousePos.y, LERP_SPEED);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = THEME.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (var x = DOT_SPACING / 2; x < w; x += DOT_SPACING) {
        for (var y = DOT_SPACING / 2; y < h; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      var now = performance.now();
      for (var i = ripples.length - 1; i >= 0; i--) {
        var r = ripples[i];
        var age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      var cols = Math.max(2, Math.ceil(w / CELL_SIZE)) + 1;
      var rows = Math.max(2, Math.ceil(h / CELL_SIZE)) + 1;
      var cellW = w / (cols - 1);
      var cellH = h / (rows - 1);

      var pts = [];
      var prox = [];

      for (var row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (var col = 0; col < cols; col++) {
          var warp = getWarpedPoint(col * cellW, row * cellH, col, row, mousePos, ripples, cols, rows);
          pts[row][col] = warp.pt;
          prox[row][col] = warp.proximity;
        }
      }

      var drawSeg = function(p1, p2, pr1, pr2) {
        var avg = (pr1 + pr2) / 2;
        var t = avg * avg * (3 - 2 * avg);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(LINE_BASE, THEME.lineActive, t);
        ctx.lineWidth = lerpN(0.8, 1.5, t);
        ctx.stroke();
      };

      ctx.lineCap = 'butt';

      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols - 1; col++) {
          drawSeg(pts[row][col], pts[row][col + 1], prox[row][col], prox[row][col + 1]);
        }
      }

      for (var col = 0; col < cols; col++) {
        for (var row = 0; row < rows - 1; row++) {
          drawSeg(pts[row][col], pts[row + 1][col], prox[row][col], prox[row + 1][col]);
        }
      }

      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          var p = pts[row][col];
          var pr = prox[row][col];
          var t = pr * pr * (3 - 2 * pr);
          var r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

          if (t > 0.3) {
            var glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
            var grd = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR);
            grd.addColorStop(0, 'rgba(' + THEME.glow + ',' + (t * 0.3).toFixed(3) + ')');
            grd.addColorStop(1, 'rgba(' + THEME.glow + ',0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor({ r: 255, g: 255, b: 255, a: 0.2 }, THEME.nodeActive, t);
          ctx.fill();
        }
      }

      for (var i = 0; i < ripples.length; i++) {
        var r = ripples[i];
        var safeRadius = Math.max(0, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + THEME.ripple + ',' + (r.opacity * 0.28).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(animate);
    }

    setCanvasSize();
    var resizeObserver = new ResizeObserver(function() { setCanvasSize(); });
    var container = document.getElementById(containerId);
    if (container) resizeObserver.observe(container);

    document.addEventListener('mousemove', function(e) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var rect = container.getBoundingClientRect();
      targetMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    document.addEventListener('click', function(e) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var rect = container.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var clickY = e.clientY - rect.top;
      if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
        ripples.push({
          x: clickX,
          y: clickY,
          radius: 0,
          opacity: 1,
          born: performance.now()
        });
      }
    });

    animate();
  }

  /* kinetic grid footer */
  initKineticGrid('kinetic-grid-canvas', 'pie-footer');

  /* kinetic grid header */
  initKineticGrid('kinetic-grid-header', 'barra');

  var kineticCanvas = document.getElementById('kinetic-grid-canvas');
  if (kineticCanvas) {
    var ctx = kineticCanvas.getContext('2d');
    var mousePos = { x: -9999, y: -9999 };
    var targetMousePos = { x: -9999, y: -9999 };
    var ripples = [];
    var rafId = null;

    var CELL_SIZE = 55;
    var INFLUENCE_RADIUS = 260;
    var MAX_WARP = 24;
    var DOT_SPACING = 28;
    var LERP_SPEED = 0.08;

    var LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 };
    var NODE_BASE_RADIUS = 1.8;
    var NODE_ACTIVE_RADIUS = 3.2;

    var THEME = {
      bg: '#0B0B0C',
      lineActive: { r: 216, g: 30, b: 21, a: 0.9 },
      nodeActive: { r: 216, g: 30, b: 21, a: 1.0 },
      glow: '216,30,21',
      ripple: '255,100,80'
    };

    function lerpN(a, b, t) {
      return a + (b - a) * t;
    }

    function lerpColor(base, active, t) {
      var r = Math.round(lerpN(base.r, active.r, t));
      var g = Math.round(lerpN(base.g, active.g, t));
      var b = Math.round(lerpN(base.b, active.b, t));
      var a = lerpN(base.a, active.a, t);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a.toFixed(3) + ')';
    }

    function setCanvasSize() {
      var footer = document.getElementById('pie-footer');
      if (!footer) return;
      var rect = footer.getBoundingClientRect();
      kineticCanvas.width = rect.width;
      kineticCanvas.height = rect.height;
    }

    function getWarpedPoint(gx, gy, col, row, mouse, ripples, cols, rows) {
      var edgeMargin = 1.5;
      var colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
      var rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
      var pinFactor = colPin * colPin * rowPin * rowPin;

      var dx = gx - mouse.x;
      var dy = gy - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      var rx = 0, ry = 0;
      for (var i = 0; i < ripples.length; i++) {
        var r = ripples[i];
        var rdx = gx - r.x;
        var rdy = gy - r.y;
        var rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        var waveWidth = 55;
        var diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          var strength = (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
          var angle = Math.atan2(rdy, rdx);
          var sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        var t = dist / INFLUENCE_RADIUS;
        var eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        var warpAmt = eased * MAX_WARP * pinFactor;
        var angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry
          },
          proximity: proximity
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity: proximity };
    }

    function animate() {
      var w = kineticCanvas.width;
      var h = kineticCanvas.height;

      mousePos.x = lerpN(mousePos.x, targetMousePos.x, LERP_SPEED);
      mousePos.y = lerpN(mousePos.y, targetMousePos.y, LERP_SPEED);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = THEME.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (var x = DOT_SPACING / 2; x < w; x += DOT_SPACING) {
        for (var y = DOT_SPACING / 2; y < h; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      var now = performance.now();
      for (var i = ripples.length - 1; i >= 0; i--) {
        var r = ripples[i];
        var age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      var cols = Math.max(2, Math.ceil(w / CELL_SIZE)) + 1;
      var rows = Math.max(2, Math.ceil(h / CELL_SIZE)) + 1;
      var cellW = w / (cols - 1);
      var cellH = h / (rows - 1);

      var pts = [];
      var prox = [];

      for (var row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (var col = 0; col < cols; col++) {
          var warp = getWarpedPoint(col * cellW, row * cellH, col, row, mousePos, ripples, cols, rows);
          pts[row][col] = warp.pt;
          prox[row][col] = warp.proximity;
        }
      }

      var drawSeg = function(p1, p2, pr1, pr2) {
        var avg = (pr1 + pr2) / 2;
        var t = avg * avg * (3 - 2 * avg);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(LINE_BASE, THEME.lineActive, t);
        ctx.lineWidth = lerpN(0.8, 1.5, t);
        ctx.stroke();
      };

      ctx.lineCap = 'butt';

      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols - 1; col++) {
          drawSeg(pts[row][col], pts[row][col + 1], prox[row][col], prox[row][col + 1]);
        }
      }

      for (var col = 0; col < cols; col++) {
        for (var row = 0; row < rows - 1; row++) {
          drawSeg(pts[row][col], pts[row + 1][col], prox[row][col], prox[row + 1][col]);
        }
      }

      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          var p = pts[row][col];
          var pr = prox[row][col];
          var t = pr * pr * (3 - 2 * pr);
          var r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

          if (t > 0.3) {
            var glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
            var grd = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR);
            grd.addColorStop(0, 'rgba(' + THEME.glow + ',' + (t * 0.3).toFixed(3) + ')');
            grd.addColorStop(1, 'rgba(' + THEME.glow + ',0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor({ r: 255, g: 255, b: 255, a: 0.2 }, THEME.nodeActive, t);
          ctx.fill();
        }
      }

      for (var i = 0; i < ripples.length; i++) {
        var r = ripples[i];
        var safeRadius = Math.max(0, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + THEME.ripple + ',' + (r.opacity * 0.28).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(animate);
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    document.addEventListener('mousemove', function(e) {
      var footer = document.getElementById('pie-footer');
      if (!footer) return;
      var rect = footer.getBoundingClientRect();
      targetMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });

    document.addEventListener('click', function(e) {
      var footer = document.getElementById('pie-footer');
      if (!footer) return;
      var rect = footer.getBoundingClientRect();
      var clickX = e.clientX - rect.left;
      var clickY = e.clientY - rect.top;
      if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
        ripples.push({
          x: clickX,
          y: clickY,
          radius: 0,
          opacity: 1,
          born: performance.now()
        });
      }
    });

    animate();
  }
})();
