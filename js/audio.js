/**
 * audio.js — Local audio playback
 * Plays pre-generated MP3 files from the audio/ folder.
 * No server, no API calls — fully standalone.
 */
var App = window.App || {};

App.Audio = (function () {

  var LS_AUTOPLAY = 'jp_audio_auto';
  var currentAudio = null;

  function isAutoPlay() {
    try { return localStorage.getItem(LS_AUTOPLAY) !== 'false'; } catch(e) { return true; }
  }
  function setAutoPlay(b) {
    try { localStorage.setItem(LS_AUTOPLAY, b ? 'true' : 'false'); } catch(e) {}
  }

  function toggleAutoPlay() {
    var next = !isAutoPlay();
    setAutoPlay(next);
    _updateToggleBtn();
    return next;
  }

  /* ── Playback ──────────────────────────────────────────────── */
  function stopCurrent() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    _setBtn('🔊', false);
  }

  /**
   * Play one side of an item.
   * @param {object} item  - vocab/sentence item with an `id` field
   * @param {string} side  - 'de' or 'jp'
   */
  function playItem(item, side) {
    if (!item || !item.id) return;

    stopCurrent();
    _setBtn('⏳', true);

    var src = 'audio/' + item.id + '_' + side + '.mp3';
    var a   = new Audio(src);

    a.addEventListener('canplay', function () {
      currentAudio = a;
      _setBtn('⏹', false);
      a.play().catch(function () { _setBtn('🔊', false); });
    }, { once: true });

    a.addEventListener('ended', function () { _setBtn('🔊', false); });
    a.addEventListener('error', function () {
      console.warn('[Audio] File not found: ' + src);
      _setBtn('🔊', false);
    }, { once: true });
  }

  function replayQuestion() {
    var s = App.state && App.state.session;
    if (!s || !s.currentItem) return;
    var side = (s.direction === 'de-to-jp') ? 'de' : 'jp';
    playItem(s.currentItem, side);
  }

  /* ── Button helpers ────────────────────────────────────────── */
  function _setBtn(icon, disabled) {
    var btn = document.getElementById('audio-play-btn');
    if (!btn) return;
    btn.textContent = icon;
    btn.disabled    = disabled;
  }

  function _updateToggleBtn() {
    var btn = document.getElementById('audio-autoplay-btn');
    if (!btn) return;
    var on = isAutoPlay();
    btn.textContent = on ? '🔊 Auto' : '🔇 Auto';
    btn.classList.toggle('active', on);
  }

  function init() {
    _updateToggleBtn();
  }

  /* ── Public API ────────────────────────────────────────────── */
  return {
    isAutoPlay:     isAutoPlay,
    toggleAutoPlay: toggleAutoPlay,
    playItem:       playItem,
    stopCurrent:    stopCurrent,
    replayQuestion: replayQuestion,
    init:           init
  };

})();

window.App = App;
