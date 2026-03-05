/**
 * scoring.js — Weighted random word selection (spaced repetition).
 *
 * Words you struggle with get a lower ease-factor → higher weight →
 * appear more often.  Words you know well fade into the background.
 * A "recency boost" ensures unseen words eventually resurface.
 */
var App = window.App || {};

App.Scoring = (function () {

  /**
   * Pick the next item from the list, weighted by difficulty.
   * Never repeats the immediately previous item.
   *
   * @param {Array}  items      - full list of vocab/sentence objects (each has .id)
   * @param {Object} progressMap - { id → {easeFactor, correctCount, wrongCount, lastSeen} }
   * @param {string} lastId     - id of the item shown most recently (to avoid repeats)
   * @returns item object
   */
  function selectNext(items, progressMap, lastId) {
    if (!items || items.length === 0) return null;

    // Filter out lastId if there's more than one item
    var pool = items.length > 1
      ? items.filter(function(it) { return it.id !== lastId; })
      : items;

    var weights = pool.map(function(item) {
      return computeWeight(progressMap[item.id]);
    });

    var total = weights.reduce(function(s, w) { return s + w; }, 0);
    var r = Math.random() * total;
    var cumulative = 0;

    for (var i = 0; i < pool.length; i++) {
      cumulative += weights[i];
      if (r <= cumulative) return pool[i];
    }
    return pool[pool.length - 1];
  }

  /**
   * Compute selection weight for one word.
   * Higher weight → more likely to be shown.
   */
  function computeWeight(prog) {
    if (!prog) {
      // Never seen → highest priority
      return 3.0;
    }

    var total   = prog.correctCount + prog.wrongCount;
    var mastery = total > 0 ? prog.correctCount / total : 0;
    // mastery: 0 = always wrong, 1 = always correct

    var base = Math.max(1 - mastery, 0.05);  // floor 0.05 so mastered words can still appear

    // Recency boost: if not seen for a while, nudge weight up
    var daysSince = prog.lastSeen
      ? (Date.now() - prog.lastSeen) / 86400000
      : 30;  // treat "never seen" as 30 days ago
    var recency = Math.min(1 + daysSince * 0.15, 2.5);

    // Extra boost for high wrong count (struggling words)
    var wrongBoost = prog.wrongCount > 0
      ? 1 + Math.min(prog.wrongCount * 0.1, 0.8)
      : 1;

    return base * recency * wrongBoost;
  }

  /**
   * Returns mastery percentage (0–100) for display purposes.
   */
  function masteryPercent(prog) {
    if (!prog) return 0;
    var total = prog.correctCount + prog.wrongCount;
    if (total === 0) return 0;
    return Math.round((prog.correctCount / total) * 100);
  }

  /**
   * True if a word is "mastered" (high correct rate + seen enough times).
   */
  function isMastered(prog) {
    if (!prog) return false;
    var total = prog.correctCount + prog.wrongCount;
    return total >= 5 && (prog.correctCount / total) >= 0.85;
  }

  /** Fisher-Yates shuffle — returns the array in-place. */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  return {
    selectNext:      selectNext,
    computeWeight:   computeWeight,
    masteryPercent:  masteryPercent,
    isMastered:      isMastered,
    shuffle:         shuffle
  };

}());

window.App = App;
