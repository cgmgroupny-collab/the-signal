/* ============================================
   THE SIGNAL — Tech Signal Noir JS
   ============================================ */

(function () {
  'use strict';

  /* --- Mobile Navigation --- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* --- Sticky Header Shadow --- */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* --- Newsletter Form Enhancement --- */
  /* Auto-tag subscribers by section so you can segment in Buttondown */
  var path = window.location.pathname;
  var subscriberTag = 'homepage';
  if (path.indexOf('/ai-tools/') !== -1) subscriberTag = 'ai-tools';
  else if (path.indexOf('/crypto/') !== -1) subscriberTag = 'crypto';
  else if (path.indexOf('/sports-betting/') !== -1) subscriberTag = 'sports-betting';
  else if (path.indexOf('/about') !== -1) subscriberTag = 'about';

  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button');
      var email = input.value.trim();
      if (!email) return;
      var orig = btn.textContent;
      btn.textContent = 'Subscribing...';
      btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'email=' + encodeURIComponent(email) + '&tag=' + encodeURIComponent(subscriberTag) + '&referrer_url=' + encodeURIComponent(window.location.href)
      }).then(function (res) {
        if (!res.ok) throw new Error('Subscribe failed');
        input.value = '';
        btn.textContent = 'Subscribed!';
        btn.style.background = '#00D4AA';
        btn.style.color = '#0B0F19';
        setTimeout(function () {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      }).catch(function () { form.submit(); });
    });
  });

  /* --- Smooth Scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ============================================
     HERO CANVAS — Signal Waveform Animation
     ============================================ */
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var w, h;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  /* Particles — more, brighter, multi-color */
  var particles = [];
  var particleCount = Math.min(90, Math.floor(w / 14));
  var colors = [
    [0, 212, 170],   /* teal */
    [59, 130, 246],   /* blue */
    [255, 77, 0],     /* orange */
    [0, 255, 208],    /* bright mint */
    [130, 100, 255],  /* purple */
  ];

  function createParticle() {
    var c = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.5 + 0.15,
      color: c,
      pulse: Math.random() * Math.PI * 2
    };
  }

  for (var i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  /* Waveform config — brighter, more visible */
  var time = 0;
  var waves = [
    { amp: 50, freq: 0.008, speed: 0.015, color: 'rgba(0, 212, 170, 0.25)', width: 2.5 },
    { amp: 30, freq: 0.012, speed: 0.02,  color: 'rgba(0, 255, 208, 0.15)', width: 2 },
    { amp: 70, freq: 0.005, speed: 0.01,  color: 'rgba(59, 130, 246, 0.12)', width: 1.5 },
    { amp: 20, freq: 0.02,  speed: 0.025, color: 'rgba(255, 77, 0, 0.10)',  width: 1.5 },
    { amp: 35, freq: 0.015, speed: 0.018, color: 'rgba(130, 100, 255, 0.08)', width: 1 },
  ];

  function draw() {
    ctx.clearRect(0, 0, w, h);
    time += 1;

    /* Draw glowing waves */
    var midY = h * 0.55;
    waves.forEach(function (wave) {
      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = wave.width;
      ctx.shadowColor = wave.color.replace(/[\d.]+\)$/, '0.4)');
      ctx.shadowBlur = 12;
      for (var x = 0; x < w; x += 2) {
        var y = midY + Math.sin(x * wave.freq + time * wave.speed) * wave.amp
                     + Math.sin(x * wave.freq * 1.5 + time * wave.speed * 0.7) * wave.amp * 0.3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    /* Draw particles with glow and pulse */
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      var pulseR = p.r + Math.sin(p.pulse) * 0.5;
      var pulseO = p.opacity + Math.sin(p.pulse) * 0.1;

      /* Outer glow */
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (pulseO * 0.15) + ')';
      ctx.fill();

      /* Core dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + pulseO + ')';
      ctx.fill();
    });

    /* Draw connections between nearby particles */
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          var alpha = 0.12 * (1 - dist / 150);
          var c = particles[i].color;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
