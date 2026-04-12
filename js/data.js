/**
 * data.js — Knowledge-base loading and progress persistence.
 * Reads from KB_DEFAULTS (knowledge-bases.js) and falls back to / merges
 * with any user overrides stored in localStorage.
 */
var App = window.App || {};

App.Data = (function () {

  var LS_KB  = 'jp_kb_overrides';   // user-edited knowledge bases
  var LS_PRG = 'jp_progress';        // per-word spaced-repetition state
  var LS_GLB = 'jp_global_stats';    // XP, level, session count …

  /* ── helpers ──────────────────────────────────────────────────── */

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  /* ── KNOWLEDGE-BASE ACCESS ────────────────────────────────────── */

  /**
   * Returns the vocabulary array for a given version, merging user
   * overrides on top of the defaults.
   */
  function getVocabulary(version) {
    var overrides = lsGet(LS_KB) || {};
    if (overrides.vocabulary && overrides.vocabulary[version]) {
      return overrides.vocabulary[version];
    }
    return (KB_DEFAULTS.vocabulary[version] || []).slice();
  }

  /**
   * Returns the sentences array for a given version (or all versions
   * up to and including it if cumulative=true).
   */
  function getSentences(version, cumulative) {
    var overrides = lsGet(LS_KB) || {};
    var versions  = ['v1','v2','v3','v4','v5','v6','v7','v8'];
    var idx       = versions.indexOf(version);
    if (idx === -1) idx = 0;

    if (cumulative) {
      // Sentences V2 = sentences from V1 + V2 combined
      var result = [];
      for (var i = 0; i <= idx; i++) {
        var v = versions[i];
        var src = (overrides.sentences && overrides.sentences[v])
          ? overrides.sentences[v]
          : (KB_DEFAULTS.sentences[v] || []);
        result = result.concat(src);
      }
      return result;
    }

    if (overrides.sentences && overrides.sentences[version]) {
      return overrides.sentences[version];
    }
    return (KB_DEFAULTS.sentences[version] || []).slice();
  }

  /** Cumulative vocabulary (V1..current) for sentence-mode context. */
  function getVocabUpTo(version) {
    var versions = ['v1','v2','v3','v4','v5','v6','v7','v8'];
    var idx      = versions.indexOf(version);
    var result   = [];
    for (var i = 0; i <= idx; i++) {
      result = result.concat(getVocabulary(versions[i]));
    }
    return result;
  }

  /** Common knowledge (particles + basic words). */
  function getCommon() {
    return KB_DEFAULTS.common;
  }

  /** List of available versions that have at least one entry. */
  function getAvailableVersions(type) {
    return ['v1','v2','v3','v4','v5','v6','v7','v8'].filter(function(v) {
      if (type === 'vocabulary') return getVocabulary(v).length > 0;
      if (type === 'sentences')  return getSentences(v, false).length > 0;
      return false;
    });
  }

  /* ── SAVING USER OVERRIDES ────────────────────────────────────── */

  function saveVocabularyOverride(version, items) {
    var overrides = lsGet(LS_KB) || {};
    if (!overrides.vocabulary) overrides.vocabulary = {};
    overrides.vocabulary[version] = items;
    lsSet(LS_KB, overrides);
  }

  function saveSentencesOverride(version, items) {
    var overrides = lsGet(LS_KB) || {};
    if (!overrides.sentences) overrides.sentences = {};
    overrides.sentences[version] = items;
    lsSet(LS_KB, overrides);
  }

  function resetOverride(type, version) {
    var overrides = lsGet(LS_KB) || {};
    if (overrides[type]) {
      delete overrides[type][version];
      lsSet(LS_KB, overrides);
    }
  }

  /* ── PROGRESS PERSISTENCE ─────────────────────────────────────── */

  function getProgress() {
    return lsGet(LS_PRG) || { vocabulary: {}, sentences: {} };
  }

  function getWordProgress(type, id) {
    var prog = getProgress();
    var section = prog[type] || {};
    return section[id] || { easeFactor: 1.0, correctCount: 0, wrongCount: 0, lastSeen: 0 };
  }

  function updateWordProgress(type, id, score) {
    // score: 0=wrong, 1=partial, 2=correct
    var prog    = getProgress();
    var section = prog[type] || {};
    var entry   = section[id] || { easeFactor: 1.0, correctCount: 0, wrongCount: 0, lastSeen: 0 };

    entry.lastSeen = Date.now();

    if (score === 2) {
      entry.correctCount++;
      entry.easeFactor = Math.min(entry.easeFactor * 1.2, 4.0);
    } else if (score === 1) {
      entry.correctCount += 0.5;   // partial credit
      // ease factor unchanged for partial
    } else {
      entry.wrongCount++;
      entry.easeFactor = Math.max(entry.easeFactor * 0.6, 0.15);
    }

    section[id] = entry;
    prog[type]  = section;
    lsSet(LS_PRG, prog);
  }

  function resetProgress(type, version, items) {
    var prog = getProgress();
    var section = prog[type] || {};
    (items || []).forEach(function(item) { delete section[item.id]; });
    prog[type] = section;
    lsSet(LS_PRG, prog);
  }

  function getAllProgress() {
    return getProgress();
  }

  /* ── GLOBAL STATS ─────────────────────────────────────────────── */

  function getGlobalStats() {
    return lsGet(LS_GLB) || {
      totalXP: 0, level: 1, totalCorrect: 0, totalWrong: 0,
      bestStreak: 0, sessionsCompleted: 0
    };
  }

  function updateGlobalStats(patch) {
    var stats = getGlobalStats();
    Object.keys(patch).forEach(function(k) {
      if (k === 'totalXP' || k === 'totalCorrect' || k === 'totalWrong') {
        stats[k] = (stats[k] || 0) + patch[k];
      } else {
        stats[k] = patch[k];
      }
    });
    stats.level = xpToLevel(stats.totalXP);
    if (patch.streak && patch.streak > stats.bestStreak) {
      stats.bestStreak = patch.streak;
    }
    lsSet(LS_GLB, stats);
    return stats;
  }

  function resetAllStats() {
    lsSet(LS_PRG, null);
    lsSet(LS_GLB, null);
  }

  /* ── XP / LEVEL HELPERS ───────────────────────────────────────── */
  var XP_LEVELS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000];

  function xpToLevel(xp) {
    for (var i = XP_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= XP_LEVELS[i]) return i + 1;
    }
    return 1;
  }

  function xpForLevel(level) {
    return XP_LEVELS[Math.min(level - 1, XP_LEVELS.length - 1)];
  }

  function xpForNextLevel(level) {
    return XP_LEVELS[Math.min(level, XP_LEVELS.length - 1)];
  }

  /* ── VERSION DISPLAY LABELS ───────────────────────────────────── */
  var VERSION_LABELS = {
    v1: 'V1 – Grundwortschatz',
    v2: 'V2 – Alltag',
    v3: 'V3 – Freizeit & Medien',
    v4: 'V4 – Dinge & Handlungen',
    v5: 'V5 – Personen & Berufe',
    v6: 'V6 – Mahlzeiten & Alltag',
    v7: 'V7 – Gespräche & Büro',
    v8: 'V8 – Adjektive & Kleidung'
  };

  function getVersionLabel(v) { return VERSION_LABELS[v] || v; }

  /** Count of vocabulary words in a version (cumulative). */
  function getVocabCount(version) {
    return getVocabUpTo(version).length;
  }

  /* ── PUBLIC API ───────────────────────────────────────────────── */
  return {
    getVocabulary:          getVocabulary,
    getSentences:           getSentences,
    getVocabUpTo:           getVocabUpTo,
    getCommon:              getCommon,
    getAvailableVersions:   getAvailableVersions,
    saveVocabularyOverride: saveVocabularyOverride,
    saveSentencesOverride:  saveSentencesOverride,
    resetOverride:          resetOverride,
    getWordProgress:        getWordProgress,
    updateWordProgress:     updateWordProgress,
    resetProgress:          resetProgress,
    getAllProgress:          getAllProgress,
    getGlobalStats:         getGlobalStats,
    updateGlobalStats:      updateGlobalStats,
    resetAllStats:          resetAllStats,
    xpToLevel:              xpToLevel,
    xpForLevel:             xpForLevel,
    xpForNextLevel:         xpForNextLevel,
    getVersionLabel:        getVersionLabel,
    getVocabCount:          getVocabCount
  };

}());

window.App = App;
