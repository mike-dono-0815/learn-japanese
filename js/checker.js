/**
 * checker.js — Answer validation for vocabulary mode.
 *
 * Returns { score: 0|1|2, message: string }
 *   2 = correct (full match)
 *   1 = partial  (matched one of several comma-separated meanings)
 *   0 = wrong
 *
 * Sentences use self-grading (checker not involved).
 */
var App = window.App || {};

App.Checker = (function () {

  /* ── Normalisation ────────────────────────────────────────────── */

  /** Strip diacritics, lowercase, trim — used for both romaji and german. */
  function normalizeBasic(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // remove combining diacritics
      .replace(/ō/g, 'o').replace(/ū/g, 'u').replace(/ā/g, 'a')
      .replace(/ô/g, 'o').replace(/û/g, 'u').replace(/â/g, 'a')
      .replace(/î/g, 'i').replace(/ê/g, 'e')
      .trim();
  }

  /** Extra normalisation for romaji: collapse double-vowels, remove hyphens. */
  function normalizeRomaji(str) {
    return normalizeBasic(str)
      .replace(/-/g, '')   // "shigoto-o" → "shigatoo" (edge case, harmless)
      .replace(/\s+/g, ' ');
  }

  /** Extra normalisation for German: collapse internal whitespace. */
  function normalizeGerman(str) {
    return normalizeBasic(str).replace(/\s+/g, ' ');
  }

  /* ── Candidate building ───────────────────────────────────────── */

  /**
   * Build all accepted German answer strings from one vocab item.
   * Splits comma-separated primary answer and merges alternates.
   */
  function germanCandidates(item) {
    var candidates = [];

    // Primary answer — may contain commas ("sich ausruhen, Pause machen")
    var primary = item.german || '';
    candidates.push(primary);

    // Split on commas to add each part individually
    primary.split(',').forEach(function(part) {
      candidates.push(part.trim());
    });

    // Explicit alternates array
    (item.alternates_german || []).forEach(function(alt) {
      candidates.push(alt);
    });

    return candidates.map(normalizeGerman).filter(Boolean);
  }

  /**
   * Build all accepted Romaji answer strings from one vocab item.
   */
  function romajiCandidates(item) {
    var candidates = [item.japanese_romaji || ''];
    (item.alternates_romaji || []).forEach(function(alt) {
      candidates.push(alt);
    });
    return candidates.map(normalizeRomaji).filter(Boolean);
  }

  /* ── Main check function ──────────────────────────────────────── */

  /**
   * Check a user's answer against a vocabulary item.
   *
   * @param {string} userAnswer   - what the user typed
   * @param {object} item         - vocab item from knowledge-bases.js
   * @param {string} direction    - 'de-to-jp' or 'jp-to-de'
   * @returns {{ score: 0|1|2, label: string, acceptedAs: string|null }}
   */
  function check(userAnswer, item, direction) {
    var raw = (userAnswer || '').trim();
    if (!raw) return { score: 0, label: 'Keine Antwort', acceptedAs: null };

    if (direction === 'de-to-jp') {
      return checkDeToJp(raw, item);
    } else {
      return checkJpToDe(raw, item);
    }
  }

  function checkDeToJp(raw, item) {
    var user = normalizeRomaji(raw);
    var candidates = romajiCandidates(item);

    for (var i = 0; i < candidates.length; i++) {
      if (user === candidates[i]) {
        return { score: 2, label: '✅ Richtig!', acceptedAs: null };
      }
    }

    // Check if candidate is contained in user answer (e.g. user typed extra text)
    for (var j = 0; j < candidates.length; j++) {
      if (user.indexOf(candidates[j]) !== -1 && candidates[j].length >= 3) {
        return { score: 2, label: '✅ Richtig!', acceptedAs: candidates[j] };
      }
    }

    return { score: 0, label: '❌ Falsch', acceptedAs: null };
  }

  function checkJpToDe(raw, item) {
    var user = normalizeGerman(raw);
    var candidates = germanCandidates(item);

    // Full match?
    for (var i = 0; i < candidates.length; i++) {
      if (user === candidates[i]) {
        return { score: 2, label: '✅ Richtig!', acceptedAs: null };
      }
    }

    // Partial match: user matched one of several comma-separated meanings
    var primaryParts = (item.german || '').split(',').map(function(p) { return p.trim(); });
    if (primaryParts.length > 1) {
      for (var j = 0; j < primaryParts.length; j++) {
        if (user === normalizeGerman(primaryParts[j])) {
          return {
            score: 1,
            label: '⚠️ Fast! (+½)',
            acceptedAs: primaryParts[j]
          };
        }
      }
    }

    // Alternate partial match
    for (var k = 0; k < (item.alternates_german || []).length; k++) {
      if (user === normalizeGerman(item.alternates_german[k])) {
        return { score: 2, label: '✅ Richtig!', acceptedAs: item.alternates_german[k] };
      }
    }

    return { score: 0, label: '❌ Falsch', acceptedAs: null };
  }

  /* ── Hint generation ──────────────────────────────────────────── */

  /**
   * Returns a hint string for the given hint level (1 or 2).
   * DE→JP: kana (level 1), first syllable romaji (level 2)
   * JP→DE: first letter (level 1), first 3 letters (level 2)
   */
  function getHint(item, direction, level) {
    if (direction === 'de-to-jp') {
      if (level === 1) {
        return item.japanese_kana ? '🔤 ' + item.japanese_kana : '';
      }
      // level 2: first romaji character(s)
      var rom = item.japanese_romaji || '';
      var firstSyl = rom.split(' ')[0].substring(0, 2);
      return '🔡 ' + firstSyl + '…';
    } else {
      // JP→DE
      var de = item.german || '';
      if (level === 1) {
        return '🔡 ' + de.charAt(0).toUpperCase() + '…';
      }
      return '🔡 ' + de.substring(0, 3) + '…';
    }
  }

  return {
    check:    check,
    getHint:  getHint,
    normalizeRomaji: normalizeRomaji,
    normalizeGerman: normalizeGerman
  };

}());

window.App = App;
