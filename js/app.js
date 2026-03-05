/**
 * app.js — Main application controller.
 * Handles navigation, the practice loop (vocabulary + sentences),
 * statistics screen, and reference screen.
 */
var App = window.App || {};

/* ════════════════════════════════════════════════════════════════════
   GLOBAL STATE
═══════════════════════════════════════════════════════════════════ */
App.state = {
  screen:    'home',
  mode:      'vocabulary',    // 'vocabulary' | 'sentences'
  version:   'v1',
  direction: 'de-to-jp',     // 'de-to-jp' | 'jp-to-de'  (vocab only)
  session:   null
};

/* ════════════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════════════ */
App.navigate = function (screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });

  var target = document.getElementById('screen-' + screenName);
  if (target) target.classList.add('active');
  App.state.screen = screenName;

  // Per-screen init
  if (screenName === 'home')      App._initHome();
  if (screenName === 'stats')     App.Stats.render();
  if (screenName === 'reference') App._renderReference();
  if (screenName === 'editor')    App.Editor.init();
  if (screenName === 'splash')    {}  // nothing to init
};

/* ════════════════════════════════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════════════════════════════ */
App._initHome = function () {
  var gs = App.Data.getGlobalStats();
  el('home-xp').textContent    = '⭐ ' + gs.totalXP + ' XP';
  el('home-level').textContent = 'Lv.' + gs.level;
  App._updateVersionHint();
};

App.setMode = function (mode) {
  App.state.mode = mode;
  document.querySelectorAll('#mode-group .btn-toggle').forEach(function (b) {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  // Direction is selectable for both modes
  App._updateVersionHint();
};

App.setVersion = function (v) {
  App.state.version = v;
  App._updateVersionHint();
};

App.setDirection = function (dir) {
  App.state.direction = dir;
  document.querySelectorAll('#dir-group .btn-toggle').forEach(function (b) {
    b.classList.toggle('active', b.dataset.dir === dir);
  });
};

App._updateVersionHint = function () {
  var hint = el('version-hint');
  if (!hint) return;
  if (App.state.mode === 'vocabulary') {
    var count = App.Data.getVocabCount(App.state.version);
    hint.textContent = 'Enthält ' + count + ' Vokabeln (kumulativ V1–' + App.state.version.toUpperCase() + ')';
  } else {
    var sents = App.Data.getSentences(App.state.version, true);
    hint.textContent = 'Enthält ' + sents.length + ' Sätze (kumulativ V1–' + App.state.version.toUpperCase() + ')';
  }
};

/* ════════════════════════════════════════════════════════════════════
   SESSION MANAGEMENT
═══════════════════════════════════════════════════════════════════ */
App.startSession = function () {
  var mode    = App.state.mode;
  var version = App.state.version;

  var items;
  if (mode === 'vocabulary') {
    items = App.Data.getVocabUpTo(version);
  } else {
    items = App.Data.getSentences(version, true);  // cumulative
  }

  if (!items || items.length === 0) {
    App.Celebration.showToast('⚠️ Keine Einträge gefunden', 'info');
    return;
  }

  // Build progress map for fast lookup
  var progressMap = {};
  var allProgress = App.Data.getAllProgress();
  var section     = (mode === 'vocabulary' ? allProgress.vocabulary : allProgress.sentences) || {};
  items.forEach(function (item) {
    progressMap[item.id] = section[item.id] || null;
  });

  App.state.session = {
    mode:        mode,
    version:     version,
    direction:   App.state.direction,
    items:       items,
    progressMap: progressMap,
    currentItem: null,
    lastItemId:  null,
    hintLevel:   0,
    streak:      0,
    bestStreak:  0,
    correct:     0,
    wrong:       0,
    partial:     0,
    xpEarned:   0,
    missedItems: [],
    // Round tracking: fixed shuffled order for first 2 rounds, weighted after
    roundsCompleted: 0,
    roundQueue:      App.Scoring.shuffle(items.slice()),
    roundIndex:      0
  };

  App.navigate('practice');
  App._showNextItem();
};

App.quitSession = function () {
  App._endSession();
};

App._endSession = function () {
  var s = App.state.session;
  if (!s) { App.navigate('home'); return; }

  // Record level BEFORE updating so we can detect a level-up
  var oldLevel = App.Data.getGlobalStats().level;

  // Update global stats
  var gs = App.Data.updateGlobalStats({
    totalXP:    s.xpEarned,
    totalCorrect: s.correct + s.partial,
    totalWrong:   s.wrong,
    streak:       s.bestStreak,
    sessionsCompleted: 1
  });

  // Check level up
  if (gs.level > oldLevel) {
    App.Celebration.onLevelUp(gs.level);
  }

  // Populate session-end screen
  el('se-correct').textContent = s.correct + (s.partial ? '+' + s.partial : '');
  el('se-wrong').textContent   = s.wrong;
  el('se-streak').textContent  = s.bestStreak;
  el('se-xp').textContent      = s.xpEarned;

  var missedSec  = el('se-missed-section');
  var missedList = el('se-missed-list');
  missedList.innerHTML = '';

  if (s.missedItems.length > 0) {
    missedSec.classList.remove('hidden');
    s.missedItems.forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML =
        '<span class="missed-jp">' + esc(item.japanese_romaji) + '</span>' +
        '<span class="missed-de">' + esc(item.german) + '</span>';
      missedList.appendChild(li);
    });
  } else {
    missedSec.classList.add('hidden');
  }

  App.navigate('session-end');
};

/* ════════════════════════════════════════════════════════════════════
   PRACTICE LOOP
═══════════════════════════════════════════════════════════════════ */
App._pickNextItem = function (s) {
  // Rounds 1 & 2: iterate through a shuffled copy of all items in fixed order
  if (s.roundsCompleted < 2) {
    if (s.roundIndex >= s.roundQueue.length) {
      // Current round exhausted — start the next one
      s.roundsCompleted++;
      if (s.roundsCompleted < 2) {
        s.roundQueue = App.Scoring.shuffle(s.items.slice());
        s.roundIndex = 0;
      }
    }
    if (s.roundsCompleted < 2) {
      return s.roundQueue[s.roundIndex++];
    }
  }
  // Round 3+: weighted random selection
  return App.Scoring.selectNext(s.items, s.progressMap, s.lastItemId);
};

App._showNextItem = function () {
  var s = App.state.session;
  var item = App._pickNextItem(s);
  if (!item) { App._endSession(); return; }

  s.currentItem = item;
  s.lastItemId  = item.id;
  s.hintLevel   = 0;

  // Update header
  el('ph-streak').textContent  = s.streak;
  el('ph-correct').textContent = s.correct;
  el('ph-total').textContent   = s.correct + s.wrong;
  el('ph-xp').textContent      = s.xpEarned;

  // Populate question card
  var isVocab = s.mode === 'vocabulary';
  var dir     = s.direction;
  var dirLabel = dir === 'de-to-jp' ? 'DE → JP' : 'JP → DE';

  el('q-direction').textContent = isVocab
    ? dirLabel
    : (dir === 'jp-to-de' ? 'JP → DE' : 'DE → JP');

  if (isVocab) {
    el('q-text').textContent = dir === 'de-to-jp'
      ? item.german
      : item.japanese_romaji;
  } else {
    // Sentences: direction depends on dir setting
    el('q-text').textContent = dir === 'jp-to-de'
      ? item.japanese_romaji
      : item.german;
  }

  el('q-hint-line').textContent = '';
  el('q-hint-line').classList.add('hidden');
  el('hint-btn').disabled = false;

  // Show correct phase
  if (isVocab) {
    showPhase('input');
    var inp = el('answer-input');
    inp.value = '';
    setTimeout(function () { inp.focus(); }, 80);
  } else {
    showPhase('sentence-input');
    var sinp = el('sentence-input');
    sinp.value = '';
    setTimeout(function () { sinp.focus(); }, 80);
  }

  // Auto-play question side only
  if (App.Audio && App.Audio.isAutoPlay()) {
    var qSide = s.direction === 'de-to-jp' ? 'de' : 'jp';
    App.Audio.playItem(item, qSide);
  }
};

/* ── Vocabulary: check answer ─────────────────────────────────── */
App.checkAnswer = function () {
  var s    = App.state.session;
  var item = s.currentItem;
  var inp  = el('answer-input');
  var raw  = inp.value;

  var result = App.Checker.check(raw, item, s.direction);

  // Update progress
  App.Data.updateWordProgress('vocabulary', item.id, result.score);
  s.progressMap[item.id] = App.Data.getWordProgress('vocabulary', item.id);

  // XP
  var xp = [0, 5, 10][result.score] + (s.streak >= 5 ? 2 : 0);
  s.xpEarned += xp;

  // Session stats
  if (result.score === 2) {
    s.correct++;
    s.streak++;
  } else if (result.score === 1) {
    s.partial++;
    s.streak++;   // partial still keeps streak
  } else {
    s.wrong++;
    if (s.missedItems.indexOf(item) === -1) s.missedItems.push(item);
    s.streak = 0;
  }
  if (s.streak > s.bestStreak) s.bestStreak = s.streak;

  // Update header
  el('ph-streak').textContent  = s.streak;
  el('ph-correct').textContent = s.correct;
  el('ph-total').textContent   = s.correct + s.wrong;
  el('ph-xp').textContent      = s.xpEarned;

  // Show feedback
  var fbResult  = el('fb-result');
  var fbCorrect = el('fb-correct');
  var fbKana    = el('fb-kana');
  var fbAlts    = el('fb-alts');

  fbResult.className = 'fb-result ' + (['wrong','partial','correct'][result.score]);
  fbResult.textContent = result.label;

  if (result.score < 2) {
    // Show the correct answer
    var correctStr = s.direction === 'de-to-jp'
      ? item.japanese_romaji
      : item.german;
    fbCorrect.textContent = '→ ' + correctStr;
  } else {
    fbCorrect.textContent = raw;
  }

  fbKana.textContent = item.japanese_kana ? '(' + item.japanese_kana + ')' : '';

  // Alternates
  var alts = (item.alternates_german || []).concat(item.german.split(',').map(function(p){return p.trim();}));
  alts = alts.filter(function(a) { return a && a !== item.german; });
  if (alts.length > 0 && result.score > 0) {
    fbAlts.textContent = 'Auch akzeptiert: ' + alts.slice(0,3).join(', ');
    fbAlts.classList.remove('hidden');
  } else {
    fbAlts.classList.add('hidden');
  }

  showPhase('feedback');

  // Play answer side once feedback is revealed
  if (App.Audio && App.Audio.isAutoPlay()) {
    var aSide = s.direction === 'de-to-jp' ? 'jp' : 'de';
    App.Audio.playItem(item, aSide);
  }

  // Streak celebrations
  App.Celebration.onStreakUpdate(s.streak);

  // Mastery check
  if (App.Scoring.isMastered(s.progressMap[item.id])) {
    App.Celebration.onWordMastered(item.japanese_romaji || item.german);
  }

  // Add shake animation on wrong answer to the card
  if (result.score === 0) {
    var card = el('question-card');
    card.classList.add('anim-shake');
    setTimeout(function() { card.classList.remove('anim-shake'); }, 500);
  }
};

App.nextWord = function () {
  App._showNextItem();
};

/* ── Sentences: reveal & self-grade ──────────────────────────── */
App.revealSentence = function () {
  var s    = App.state.session;
  var item = s.currentItem;
  var inp  = el('sentence-input');

  el('sg-attempt').textContent = inp.value.trim() || '(keine Eingabe)';

  var answerStr = s.direction === 'jp-to-de' ? item.german : item.japanese_romaji;
  el('sg-answer').textContent = answerStr;
  el('sg-kana').textContent   = item.japanese_kana ? '(' + item.japanese_kana + ')' : '';

  var alts = item.alternates_german || [];
  if (alts.length > 0) {
    el('sg-alts').textContent = 'Auch: ' + alts.join(', ');
    el('sg-alts').classList.remove('hidden');
  } else {
    el('sg-alts').classList.add('hidden');
  }

  showPhase('selfgrade');

  // Play answer side once the model answer is revealed
  if (App.Audio && App.Audio.isAutoPlay()) {
    var rSide = s.direction === 'jp-to-de' ? 'de' : 'jp';
    App.Audio.playItem(item, rSide);
  }
};

App.skipSentence = function () {
  // Treat skip as wrong
  App.selfGrade(0);
};

App.selfGrade = function (score) {
  var s    = App.state.session;
  var item = s.currentItem;

  App.Data.updateWordProgress('sentences', item.id, score);
  s.progressMap[item.id] = App.Data.getWordProgress('sentences', item.id);

  var xp = [0, 5, 10][score] + (s.streak >= 5 ? 2 : 0);
  s.xpEarned += xp;

  if (score >= 1) {
    s.correct++;
    s.streak++;
  } else {
    s.wrong++;
    if (s.missedItems.indexOf(item) === -1) s.missedItems.push(item);
    s.streak = 0;
  }
  if (s.streak > s.bestStreak) s.bestStreak = s.streak;

  el('ph-streak').textContent  = s.streak;
  el('ph-correct').textContent = s.correct;
  el('ph-total').textContent   = s.correct + s.wrong;
  el('ph-xp').textContent      = s.xpEarned;

  App.Celebration.onStreakUpdate(s.streak);
  App._showNextItem();
};

/* ── Hint ─────────────────────────────────────────────────────── */
App.showHint = function () {
  var s = App.state.session;
  if (!s || !s.currentItem) return;

  s.hintLevel = Math.min(s.hintLevel + 1, 2);
  var hint = App.Checker.getHint(s.currentItem, s.direction, s.hintLevel);

  var hintLine = el('q-hint-line');
  hintLine.textContent = hint;
  hintLine.classList.remove('hidden');

  if (s.hintLevel >= 2) el('hint-btn').disabled = true;
};

/* ── Quick-grade (no typing needed) ──────────────────────────── */
App.autoGrade = function (score) {
  // Populate the answer input with the correct answer so checkAnswer
  // can run the normal feedback/stats path without modification.
  var s    = App.state.session;
  var item = s.currentItem;
  if (!item) return;

  var correctAnswer = s.direction === 'de-to-jp'
    ? item.japanese_romaji
    : item.german;

  if (score === 2) {
    // Pretend the user typed the correct answer
    el('answer-input').value = correctAnswer;
  } else {
    // Pretend the user typed nothing (guaranteed wrong)
    el('answer-input').value = '';
  }

  App.checkAnswer();
};

/* ── Input key handler ────────────────────────────────────────── */
App.onInputKey = function (event) {
  if (event.key !== 'Enter') return;
  event.stopPropagation(); // prevent global keydown listener from also firing
  App.checkAnswer();
};

/* ════════════════════════════════════════════════════════════════════
   STATS SCREEN
═══════════════════════════════════════════════════════════════════ */
App.Stats = {

  render: function () {
    var container = el('stats-main');
    if (!container) return;

    var gs  = App.Data.getGlobalStats();
    var prg = App.Data.getAllProgress();
    var lv  = gs.level;
    var xp  = gs.totalXP;
    var xpThis = xp - App.Data.xpForLevel(lv);
    var xpNext = App.Data.xpForNextLevel(lv) - App.Data.xpForLevel(lv);
    var pct    = xpNext > 0 ? Math.min(Math.round((xpThis / xpNext) * 100), 100) : 100;

    var html =
      '<div class="stats-section-title">Gesamtübersicht</div>' +
      '<div class="stats-grid">' +
        stat('⭐', xp + ' XP', 'Gesamt-XP') +
        stat('🏅', 'Level ' + lv, 'Aktuelles Level') +
        stat('✅', gs.totalCorrect, 'Richtig') +
        stat('❌', gs.totalWrong, 'Falsch') +
        stat('🔥', gs.bestStreak, 'Bester Streak') +
        stat('📚', gs.sessionsCompleted, 'Sitzungen') +
      '</div>' +
      '<div class="xp-bar-wrap">' +
        '<div class="xp-bar-bg"><div class="xp-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="xp-bar-label">Level ' + lv + ' → Level ' + (lv+1) + ' · ' + pct + '%</div>' +
      '</div>';

    // Per-word progress for vocabulary
    var vocabSection = prg.vocabulary || {};
    var wordItems = [];
    ['v1','v2','v3','v4','v5'].forEach(function(v) {
      App.Data.getVocabulary(v).forEach(function(item) {
        if (vocabSection[item.id]) {
          wordItems.push({ item: item, prog: vocabSection[item.id] });
        }
      });
    });

    if (wordItems.length > 0) {
      wordItems.sort(function(a,b) {
        return App.Scoring.masteryPercent(a.prog) - App.Scoring.masteryPercent(b.prog);
      });

      html += '<div class="stats-section-title" style="margin-top:8px">Vokabeln nach Beherrschung</div>';
      html += '<div class="word-progress-list">';
      wordItems.forEach(function(w) {
        var pct = App.Scoring.masteryPercent(w.prog);
        var color = pct < 40 ? '#ef4444' : pct < 70 ? '#ffd166' : '#06d6a0';
        html += '<div class="word-progress-item">' +
          '<span class="wpi-jp">' + esc(w.item.japanese_romaji) + '</span>' +
          '<span class="wpi-de">' + esc(w.item.german) + '</span>' +
          '<div class="wpi-bar"><div class="wpi-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
          '<span class="wpi-pct">' + pct + '%</span>' +
          '</div>';
      });
      html += '</div>';
    }

    container.innerHTML = html;

    function stat(icon, val, lbl) {
      return '<div class="stats-card">' +
        '<span style="font-size:1.4rem">' + icon + '</span>' +
        '<span class="stats-card-val">' + val + '</span>' +
        '<span class="stats-card-lbl">' + lbl + '</span>' +
        '</div>';
    }
  },

  resetAll: function () {
    if (!confirm('Alle Lernfortschritte und Statistiken zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    App.Data.resetAllStats();
    App.Celebration.showToast('↺ Statistiken zurückgesetzt', 'info');
    App.Stats.render();
    App._initHome();
  }
};

/* ════════════════════════════════════════════════════════════════════
   REFERENCE SCREEN
═══════════════════════════════════════════════════════════════════ */
App._renderReference = function () {
  var container = el('ref-main');
  if (!container) return;

  var common = App.Data.getCommon();
  var html = '';

  html += '<div class="ref-section-title">Partikel</div><div class="ref-grid">';
  (common.particles || []).forEach(function (p) {
    html +=
      '<div class="ref-card">' +
        '<span class="ref-card-jp">' + esc(p.kana) + '</span>' +
        '<span class="ref-card-rom">' + esc(p.romaji) + '</span>' +
        '<span class="ref-card-de">' + esc(p.explanation_de) + '</span>' +
        '<span class="ref-card-use">' + esc(p.usage_de) + '</span>' +
        '<span class="ref-example">' + esc(p.example_de) + '</span>' +
      '</div>';
  });
  html += '</div>';

  html += '<div class="ref-section-title" style="margin-top:12px">Grundwörter</div><div class="ref-grid">';
  (common.words || []).forEach(function (w) {
    html +=
      '<div class="ref-card">' +
        '<span class="ref-card-jp">' + esc(w.kana) + '</span>' +
        '<span class="ref-card-rom">' + esc(w.romaji) + '</span>' +
        '<span class="ref-card-de">' + esc(w.explanation_de) + '</span>' +
        (w.usage_de ? '<span class="ref-card-use">' + esc(w.usage_de) + '</span>' : '') +
      '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
};

/* ════════════════════════════════════════════════════════════════════
   UTILITY HELPERS
═══════════════════════════════════════════════════════════════════ */

/** getElementById shortcut. */
function el(id) { return document.getElementById(id); }

/** Escape HTML for safe insertion. */
function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/** Show only the named practice phase, hide others. */
function showPhase(name) {
  ['input','feedback','selfgrade','sentence-input'].forEach(function(n) {
    var ph = el('phase-' + n);
    if (ph) {
      if (n === name) ph.classList.add('active');
      else            ph.classList.remove('active');
    }
  });
  var qgi = el('quick-grade-inline');
  if (qgi) qgi.style.display = (name === 'input') ? 'flex' : 'none';
}

/* ════════════════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  // Set default toggle states
  App.setMode('vocabulary');
  App.setDirection('de-to-jp');

  // Restore last-used version if stored
  try {
    var saved = localStorage.getItem('jp_last_version');
    if (saved) {
      App.state.version = saved;
      var sel = el('version-select');
      if (sel) sel.value = saved;
    }
  } catch(e) {}

  // Save version on change
  var sel = el('version-select');
  if (sel) {
    sel.addEventListener('change', function() {
      try { localStorage.setItem('jp_last_version', this.value); } catch(e) {}
    });
  }

  App.navigate('splash');
  App.Audio && App.Audio.init();

  // Global Enter key: advance from feedback phase without needing to click Weiter
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    var feedback = el('phase-feedback');
    if (feedback && feedback.classList.contains('active')) {
      event.preventDefault();
      App.nextWord();
    }
  });
});

window.App = App;
