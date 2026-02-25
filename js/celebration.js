/**
 * celebration.js — Streak celebrations, toasts, confetti, XP/level-ups.
 */
var App = window.App || {};

App.Celebration = (function () {

  /* ── STREAK MILESTONES ────────────────────────────────────────── */
  var MILESTONES = [
    { streak:  3, emoji: '🔥',  title: '3er Streak!',      sub: 'Du bist im Flow!',            level: 'small'  },
    { streak:  5, emoji: '🔥🔥', title: '5er Streak!',      sub: 'Weiter so!',                  level: 'small'  },
    { streak: 10, emoji: '⚡',  title: '10er Streak!',     sub: 'Unaufhaltbar!',               level: 'medium' },
    { streak: 20, emoji: '💎',  title: '20er Streak!',     sub: 'Außergewöhnlich!',            level: 'large'  },
    { streak: 30, emoji: '🏆',  title: '30er Streak!',     sub: 'Beeindruckend!',             level: 'large'  },
    { streak: 50, emoji: '🌟',  title: '50er Streak!',     sub: 'Legendär! Meister!',         level: 'large'  }
  ];

  var _confettiRunning  = false;
  var _confettiParticles = [];
  var _confettiRaf;
  var _overlayTimer;
  var _toastTimer;

  /* ── STREAK CHECK ─────────────────────────────────────────────── */

  function onStreakUpdate(streak) {
    var milestone = null;
    for (var i = 0; i < MILESTONES.length; i++) {
      if (MILESTONES[i].streak === streak) { milestone = MILESTONES[i]; break; }
    }
    if (!milestone) return;

    if (milestone.level === 'small') {
      showToast(milestone.emoji + ' ' + milestone.title, 'streak');
    } else if (milestone.level === 'medium') {
      showToast(milestone.emoji + ' ' + milestone.title + ' ' + milestone.sub, 'streak');
      burstConfetti(60);
    } else {
      showCelebrationOverlay(milestone);
      rainConfetti(150);
    }
  }

  /* ── MASTERED WORD ────────────────────────────────────────────── */

  function onWordMastered(word) {
    showToast('⭐ Meistert: ' + word, 'success');
  }

  /* ── LEVEL UP ─────────────────────────────────────────────────── */

  function onLevelUp(newLevel) {
    showCelebrationOverlay({
      emoji: '🎌',
      title: 'Level ' + newLevel + ' erreicht!',
      sub:   'Du wirst immer besser!'
    });
    rainConfetti(100);
  }

  /* ── TOAST ────────────────────────────────────────────────────── */

  function showToast(msg, type) {
    var el = document.getElementById('toast');
    if (!el) return;

    clearTimeout(_toastTimer);
    el.className = 'toast ' + (type || '');
    el.textContent = msg;

    // Force reflow so CSS transition fires even if already showing
    void el.offsetHeight;
    el.classList.add('show');

    _toastTimer = setTimeout(function() {
      el.classList.remove('show');
    }, 2400);
  }

  /* ── CELEBRATION OVERLAY ──────────────────────────────────────── */

  function showCelebrationOverlay(milestone) {
    var overlay = document.getElementById('celebration-overlay');
    var box     = document.getElementById('celebration-box');
    if (!overlay || !box) return;

    box.innerHTML =
      '<span class="cel-emoji">' + milestone.emoji  + '</span>' +
      '<div class="cel-title">'  + milestone.title  + '</div>'  +
      '<div class="cel-sub">'    + milestone.sub    + '</div>';

    overlay.classList.remove('hidden');
    clearTimeout(_overlayTimer);

    // Auto-dismiss after 2.5 s; also dismiss on click
    overlay.onclick = dismissOverlay;
    _overlayTimer = setTimeout(dismissOverlay, 2500);
  }

  function dismissOverlay() {
    var overlay = document.getElementById('celebration-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  /* ── CONFETTI ─────────────────────────────────────────────────── */

  var CONFETTI_COLORS = [
    '#e94560','#7c83fd','#06d6a0','#ffd166','#ff6b9d',
    '#c3b1e1','#56cfad','#ff9f43','#54a0ff'
  ];

  function createParticle(x, y, burst) {
    var angle  = burst
      ? (Math.random() * Math.PI * 2)
      : (Math.random() * Math.PI * 0.6 + Math.PI * 0.2);
    var speed  = burst ? (Math.random() * 6 + 2) : (Math.random() * 4 + 1);
    return {
      x: x, y: y,
      vx: Math.cos(angle) * speed * (burst ? 1 : 0.6),
      vy: Math.sin(angle) * speed * (burst ? -1 : -1),
      r:  Math.random() * 5 + 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 10,
      alpha: 1,
      life: 1.0,
      decay: Math.random() * 0.012 + 0.008
    };
  }

  /** Burst from a point (streak milestones). */
  function burstConfetti(count) {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    var cx = canvas.width / 2, cy = canvas.height * 0.35;
    for (var i = 0; i < count; i++) {
      _confettiParticles.push(createParticle(cx, cy, true));
    }
    if (!_confettiRunning) startConfettiLoop();
  }

  /** Rain from the top (big celebrations). */
  function rainConfetti(count) {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    for (var i = 0; i < count; i++) {
      var x = Math.random() * canvas.width;
      _confettiParticles.push(createParticle(x, -10, false));
    }
    if (!_confettiRunning) startConfettiLoop();
  }

  function startConfettiLoop() {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    _confettiRunning = true;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      _confettiParticles = _confettiParticles.filter(function(p) {
        return p.alpha > 0.01;
      });

      _confettiParticles.forEach(function(p) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.12;   // gravity
        p.vx  *= 0.99;
        p.rot += p.rotV;
        p.life -= p.decay;
        p.alpha = Math.max(p.life, 0);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      });

      if (_confettiParticles.length > 0) {
        _confettiRaf = requestAnimationFrame(loop);
      } else {
        _confettiRunning = false;
        window.removeEventListener('resize', resizeCanvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    loop();
  }

  /* ── PUBLIC API ───────────────────────────────────────────────── */
  return {
    onStreakUpdate:         onStreakUpdate,
    onWordMastered:        onWordMastered,
    onLevelUp:             onLevelUp,
    showToast:             showToast,
    showCelebrationOverlay:showCelebrationOverlay,
    dismissOverlay:        dismissOverlay,
    burstConfetti:         burstConfetti,
    rainConfetti:          rainConfetti
  };

}());

window.App = App;
