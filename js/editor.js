/**
 * editor.js — In-app knowledge-base editor.
 * Supports viewing, adding, editing, deleting entries,
 * importing from JSON file, and exporting to JSON file.
 */
var App = window.App || {};

App.Editor = (function () {

  var _tab     = 'vocabulary';   // 'vocabulary' | 'sentences'
  var _version = 'v1';
  var _editId  = null;           // null = new entry, string = editing existing

  /* ── INIT (called when editor screen is shown) ──────────────────── */

  function init() {
    _tab     = 'vocabulary';
    _version = App.state ? App.state.version : 'v1';
    // Sync version dropdown
    var vSel = document.getElementById('editor-version');
    if (vSel) vSel.value = _version;

    setActiveTab(_tab);
    renderTable();
  }

  /* ── TABS ────────────────────────────────────────────────────────── */

  function switchTab(tab) {
    _tab = tab;
    setActiveTab(tab);
    renderTable();
  }

  function setActiveTab(tab) {
    document.querySelectorAll('.editor-tabs .tab').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
  }

  /* ── VERSION ─────────────────────────────────────────────────────── */

  function setVersion(v) {
    _version = v;
    renderTable();
  }

  /* ── TABLE RENDERING ─────────────────────────────────────────────── */

  function renderTable() {
    var items = getItems();
    var thead = document.getElementById('editor-thead');
    var tbody = document.getElementById('editor-tbody');
    var empty = document.getElementById('editor-empty');
    if (!thead || !tbody) return;

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (items.length === 0) {
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');

    // Build header
    var tr = document.createElement('tr');
    var cols = getColumns();
    cols.forEach(function(col) {
      var th = document.createElement('th');
      th.textContent = col.label;
      if (col.width) th.style.width = col.width;
      tr.appendChild(th);
    });
    var thAct = document.createElement('th');
    thAct.textContent = 'Aktionen';
    thAct.style.width = '16%';
    tr.appendChild(thAct);
    thead.appendChild(tr);

    // Build rows
    items.forEach(function(item, idx) {
      var row = document.createElement('tr');
      cols.forEach(function(col) {
        var td = document.createElement('td');
        td.textContent = (item[col.key] || '');
        row.appendChild(td);
      });

      // Actions cell
      var tdAct = document.createElement('td');
      tdAct.className = 'td-actions';
      tdAct.innerHTML =
        '<div class="col-actions">' +
        '<button class="btn-edit" onclick="App.Editor.showEditForm(' + idx + ')">✏️</button>' +
        '<button class="btn-del"  onclick="App.Editor.deleteEntry(' + idx + ')">🗑</button>' +
        '</div>';
      row.appendChild(tdAct);
      tbody.appendChild(row);
    });
  }

  function getColumns() {
    if (_tab === 'vocabulary') {
      return [
        { key: 'japanese_romaji',   label: 'Romaji',      width: '22%' },
        { key: 'japanese_kana',     label: 'Kana',        width: '16%' },
        { key: 'german',            label: 'Deutsch',     width: '26%' },
        { key: 'alternates_german', label: 'Alternative', width: '20%' }
      ];
    } else {
      return [
        { key: 'japanese_romaji',   label: 'JP Romaji',   width: '28%' },
        { key: 'japanese_kana',     label: 'JP Kana',     width: '18%' },
        { key: 'german',            label: 'Deutsch',     width: '30%' },
        { key: 'alternates_german', label: 'Alternative', width: '16%' }
      ];
    }
  }

  function getItems() {
    if (_tab === 'vocabulary') return App.Data.getVocabulary(_version);
    return App.Data.getSentences(_version, false);
  }

  /* ── MODAL: ADD ─────────────────────────────────────────────────── */

  function showAddForm() {
    _editId = null;
    document.getElementById('modal-title').textContent = 'Neuer Eintrag';
    buildForm(null);
    document.getElementById('editor-modal').classList.remove('hidden');
  }

  /* ── MODAL: EDIT ────────────────────────────────────────────────── */

  function showEditForm(idx) {
    var items = getItems();
    var item  = items[idx];
    if (!item) return;
    _editId = item.id || ('__idx__' + idx);
    document.getElementById('modal-title').textContent = 'Eintrag bearbeiten';
    buildForm(item);
    document.getElementById('editor-modal').classList.remove('hidden');
  }

  function buildForm(item) {
    var form = document.getElementById('modal-form');
    form.innerHTML = '';

    var fields = getFormFields();
    fields.forEach(function(f) {
      var div = document.createElement('div');
      div.className = 'modal-field';

      var lbl = document.createElement('label');
      lbl.textContent = f.label;
      lbl.setAttribute('for', 'mf-' + f.key);

      var inp = document.createElement('input');
      inp.type = 'text';
      inp.id   = 'mf-' + f.key;
      inp.name = f.key;
      inp.placeholder = f.placeholder || '';
      if (item) {
        var val = item[f.key];
        if (Array.isArray(val)) val = val.join(', ');
        inp.value = val || '';
      }

      div.appendChild(lbl);
      div.appendChild(inp);
      form.appendChild(div);
    });
  }

  function getFormFields() {
    if (_tab === 'vocabulary') {
      return [
        { key: 'japanese_romaji',   label: 'Romaji',               placeholder: 'z.B. sakana' },
        { key: 'japanese_kana',     label: 'Kana',                 placeholder: 'z.B. さかな' },
        { key: 'german',            label: 'Deutsch',              placeholder: 'z.B. Fisch' },
        { key: 'alternates_romaji', label: 'Romaji-Alternativen',  placeholder: 'komma-getrennt' },
        { key: 'alternates_german', label: 'Deutsch-Alternativen', placeholder: 'komma-getrennt' }
      ];
    } else {
      return [
        { key: 'japanese_romaji',   label: 'JP Romaji',            placeholder: 'z.B. watashi wa …' },
        { key: 'japanese_kana',     label: 'JP Kana',              placeholder: 'z.B. わたしは…' },
        { key: 'german',            label: 'Deutsche Übersetzung', placeholder: 'z.B. Ich bin …' },
        { key: 'alternates_german', label: 'Alternative DE',       placeholder: 'komma-getrennt' }
      ];
    }
  }

  /* ── MODAL: SAVE ────────────────────────────────────────────────── */

  function saveEntry() {
    var fields  = getFormFields();
    var newItem = {};

    var valid = true;
    fields.forEach(function(f) {
      var inp = document.getElementById('mf-' + f.key);
      if (!inp) return;
      var val = inp.value.trim();

      if (f.key === 'alternates_romaji' || f.key === 'alternates_german') {
        newItem[f.key] = val
          ? val.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
          : [];
      } else {
        newItem[f.key] = val;
      }
    });

    // Validate required fields
    if (!newItem.japanese_romaji || !newItem.german) {
      App.Celebration.showToast('⚠️ Romaji und Deutsch sind Pflichtfelder', 'info');
      valid = false;
    }
    if (!valid) return;

    var items = getItems().slice();   // copy

    if (_editId !== null) {
      // Find by id or index marker
      var found = false;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === _editId || ('__idx__' + i) === _editId) {
          newItem.id = items[i].id || generateId();
          items[i]   = newItem;
          found = true;
          break;
        }
      }
      if (!found) items.push(Object.assign({ id: generateId() }, newItem));
    } else {
      newItem.id = generateId();
      items.push(newItem);
    }

    saveItems(items);
    closeModal();
    renderTable();
    App.Celebration.showToast('✅ Gespeichert', 'success');
  }

  /* ── DELETE ─────────────────────────────────────────────────────── */

  function deleteEntry(idx) {
    if (!confirm('Diesen Eintrag wirklich löschen?')) return;
    var items = getItems().slice();
    items.splice(idx, 1);
    saveItems(items);
    renderTable();
  }

  /* ── RESET ───────────────────────────────────────────────────────── */

  function resetToDefaults() {
    if (!confirm('Diese Version auf die Original-Daten zurücksetzen? Alle eigenen Änderungen gehen verloren.')) return;
    App.Data.resetOverride(_tab, _version);
    renderTable();
    App.Celebration.showToast('↺ Zurückgesetzt', 'info');
  }

  /* ── FILE IMPORT ─────────────────────────────────────────────────── */

  function loadFromFile(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var parsed = JSON.parse(e.target.result);
        // Accept both raw arrays and wrapped { vocabulary:[...] } / { sentences:[...] } objects
        var arr = Array.isArray(parsed) ? parsed
          : (parsed.vocabulary || parsed.sentences || parsed.words || null);

        if (!arr || !Array.isArray(arr)) {
          alert('Ungültiges Format. Erwartet wird ein JSON-Array oder ein Objekt mit einem "vocabulary"- oder "sentences"-Schlüssel.');
          return;
        }

        // Normalise field names (handle V2/V3 format with "romaji"/"hiragana")
        arr = arr.map(function(item, i) {
          return normaliseItem(item, i);
        });

        var msg = 'Datei enthält ' + arr.length + ' Einträge.\n' +
          'Vorhandene Daten für ' + _tab + ' ' + _version.toUpperCase() + ' ersetzen?';
        if (!confirm(msg)) return;

        saveItems(arr);
        renderTable();
        App.Celebration.showToast('📂 ' + arr.length + ' Einträge geladen', 'success');
      } catch(err) {
        alert('Fehler beim Lesen der Datei: ' + err.message);
      }
      // Reset file input so the same file can be re-loaded
      event.target.value = '';
    };
    reader.readAsText(file);
  }

  /** Normalise a single item from any source format to our internal format. */
  function normaliseItem(item, idx) {
    var out = {};
    // Romaji field
    out.japanese_romaji = item.japanese_romaji || item.romaji || '';
    // Kana field
    out.japanese_kana   = item.japanese_kana   || item.hiragana || item.kana || '';
    // German
    out.german          = item.german || '';
    // Alternates
    out.alternates_romaji = toArray(item.alternates_romaji || item.romaji_alt);
    out.alternates_german = toArray(item.alternates_german || item.german_alt);
    // ID
    out.id = item.id || generateId(idx);
    return out;
  }

  function toArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  }

  /* ── FILE EXPORT ─────────────────────────────────────────────────── */

  function exportCurrent() {
    var items = getItems();
    var json  = JSON.stringify(items, null, 2);
    var blob  = new Blob([json], { type: 'application/json' });
    var url   = URL.createObjectURL(blob);
    var a     = document.createElement('a');
    a.href    = url;
    a.download = _tab + '_' + _version + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ── HELPERS ─────────────────────────────────────────────────────── */

  function saveItems(items) {
    if (_tab === 'vocabulary') {
      App.Data.saveVocabularyOverride(_version, items);
    } else {
      App.Data.saveSentencesOverride(_version, items);
    }
  }

  function generateId(idx) {
    return _tab.charAt(0) + '_' + _version + '_' +
      (idx !== undefined ? idx : Date.now().toString(36));
  }

  function closeModal() {
    document.getElementById('editor-modal').classList.add('hidden');
    _editId = null;
  }

  /* ── PUBLIC API ──────────────────────────────────────────────────── */
  return {
    init:           init,
    switchTab:      switchTab,
    setVersion:     setVersion,
    showAddForm:    showAddForm,
    showEditForm:   showEditForm,
    saveEntry:      saveEntry,
    deleteEntry:    deleteEntry,
    resetToDefaults:resetToDefaults,
    loadFromFile:   loadFromFile,
    exportCurrent:  exportCurrent,
    closeModal:     closeModal
  };

}());

window.App = App;
