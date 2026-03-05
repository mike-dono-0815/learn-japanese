/**
 * scripts/download-audio.js
 *
 * Downloads ElevenLabs TTS audio for every vocabulary and sentence item in knowledge-bases.js
 * and saves it to audio/{item.id}.mp3.
 *
 * Credentials are read from .env.local (never committed to git):
 *   ELEVENLABS_API_KEY=sk_...
 *   ELEVENLABS_VOICE_ID=...
 *
 * Usage:
 *   node scripts/download-audio.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ── Load .env.local ─────────────────────────────────────────── */
const envPath = path.join(__dirname, '..', '.env.local');
const env     = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim();
  });
}

const API_KEY  = env.ELEVENLABS_API_KEY  || process.env.ELEVENLABS_API_KEY;
const VOICE_ID = env.ELEVENLABS_VOICE_ID || process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = 'eleven_multilingual_v2';

if (!API_KEY || !VOICE_ID) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
  process.exit(1);
}

/* ── Load vocabulary from knowledge-bases.js ─────────────────── */
const kbSrc = fs.readFileSync(
  path.join(__dirname, '..', 'data', 'knowledge-bases.js'),
  'utf8'
);
// knowledge-bases.js sets `var KB_DEFAULTS = {...}` — evaluate in a sandbox
const vm  = require('vm');
const ctx = {};
vm.runInNewContext(kbSrc, ctx);
const KB = ctx.KB_DEFAULTS;

const allVocab = [
  ...KB.vocabulary.v1,
  ...KB.vocabulary.v2,
  ...KB.vocabulary.v3,
  ...KB.vocabulary.v4,
  ...KB.vocabulary.v5,
];

const allSentences = [
  ...KB.sentences.v1,
  ...KB.sentences.v2,
  ...KB.sentences.v3,
  ...KB.sentences.v4,
  ...KB.sentences.v5,
];

/* ── Output directory ────────────────────────────────────────── */
const OUT_DIR = path.join(__dirname, '..', 'audio');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

/* ── Text builders ───────────────────────────────────────────── */

// Vocabulary: take only the first meaning (before any comma)
function buildVocabGermanText(item) {
  return (item.german || '').split(',')[0].trim() + '.';
}

// Sentences: use the full text as-is (already has correct punctuation)
function buildSentenceGermanText(item) {
  return (item.german || '').trim();
}

function buildJapaneseText(item) {
  // Kana only — romaji in parentheses causes the TTS to speak the word twice
  const kana = (item.japanese_kana || '').split('/')[0].trim();
  return kana ? kana + '.' : '';
}

/* ── Download one side of an item ───────────────────────────── */
async function downloadSide(id, suffix, text, language) {
  const outFile = path.join(OUT_DIR, id + suffix + '.mp3');

  if (fs.existsSync(outFile)) {
    console.log(`  skip  ${id}${suffix}  (already exists)`);
    return;
  }

  process.stdout.write(`  fetch ${id}${suffix}  "${text}" … `);

  const body = { text, model_id: MODEL_ID, output_format: 'mp3_44100_128' };
  if (language) body.language_code = language;

  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method:  'POST',
    headers: {
      'xi-api-key':   API_KEY,
      'Content-Type': 'application/json',
      'Accept':       'audio/mpeg',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const msg = await resp.text().catch(() => '');
    console.log(`FAILED (HTTP ${resp.status}: ${msg.slice(0, 120)})`);
    return;
  }

  const buf = await resp.arrayBuffer();
  fs.writeFileSync(outFile, Buffer.from(buf));
  console.log(`ok  (${(buf.byteLength / 1024).toFixed(0)} KB)`);
}

async function downloadVocabItem(item) {
  await downloadSide(item.id, '_de', buildVocabGermanText(item), 'de');
  await new Promise(r => setTimeout(r, 350));
  await downloadSide(item.id, '_jp', buildJapaneseText(item), 'ja');
}

async function downloadSentenceItem(item) {
  await downloadSide(item.id, '_de', buildSentenceGermanText(item), 'de');
  await new Promise(r => setTimeout(r, 350));
  await downloadSide(item.id, '_jp', buildJapaneseText(item), 'ja');
}

/* ── Main ────────────────────────────────────────────────────── */
async function main() {
  const total = allVocab.length + allSentences.length;
  console.log(`ElevenLabs TTS download — ${allVocab.length} vocab + ${allSentences.length} sentences (${total} total)`);
  console.log(`Voice: ${VOICE_ID}  |  Model: ${MODEL_ID}`);
  console.log(`Output: ${OUT_DIR}\n`);

  console.log('── Vocabulary ──');
  for (const item of allVocab) {
    try {
      await downloadVocabItem(item);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 350));
  }

  console.log('\n── Sentences ──');
  for (const item of allSentences) {
    try {
      await downloadSentenceItem(item);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 350));
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
