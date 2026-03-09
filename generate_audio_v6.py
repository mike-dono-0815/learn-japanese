"""
Generate ElevenLabs audio for V6 vocabulary and sentences.
Outputs: audio/vocab_v6_NN_de.mp3 / _jp.mp3
         audio/sent_v6_NN_de.mp3  / _jp.mp3
"""
import os
import time
import requests

API_KEY  = "sk_df32fcd724fbb2f946d1a30edbe4160fb7c7a9f836d46183"
VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"
MODEL    = "eleven_multilingual_v2"
OUT_DIR  = os.path.join(os.path.dirname(__file__), "audio")

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# ── Data ──────────────────────────────────────────────────────────────────────

VOCAB_V6 = [
    ("vocab_v6_01", "あさ",         "Morgen, morgens"),
    ("vocab_v6_02", "ひる",         "Mittag, mittags"),
    ("vocab_v6_03", "ばん",         "Abend, abends"),
    ("vocab_v6_04", "りょうり",     "Gericht, Speise"),
    ("vocab_v6_05", "ごはん",       "gekochter Reis; Essen"),
    ("vocab_v6_06", "あさごはん",   "Frühstück"),
    ("vocab_v6_07", "ひるごはん",   "Mittagessen"),
    ("vocab_v6_08", "ばんごはん",   "Abendessen"),
    ("vocab_v6_09", "みそしる",     "Miso-Suppe"),
    ("vocab_v6_10", "さしみ",       "roher Fisch in Scheiben"),
    ("vocab_v6_11", "それから",     "dann, danach"),
    ("vocab_v6_12", "じゃあ",       "tja, also"),
    ("vocab_v6_13", "あいます",     "(sich) treffen; begegnen"),
    ("vocab_v6_14", "みょうじ",     "Familienname"),
    ("vocab_v6_15", "だんなさん",   "Ehemann (höflich)"),
    ("vocab_v6_16", "かいもの",     "Einkäufe"),
    ("vocab_v6_17", "くるま",       "Auto, Wagen"),
    ("vocab_v6_18", "ちょっと",     "ein wenig, ein bisschen"),
]

SENT_V6 = [
    ("sent_v6_01", "あさごはんをたべます",             "Ich esse Frühstück."),
    ("sent_v6_02", "ひるごはんをたべます",             "Ich esse Mittagessen."),
    ("sent_v6_03", "ばんごはんをつくります",           "Ich mache das Abendessen."),
    ("sent_v6_04", "みそしるをのみます",               "Ich trinke Miso-Suppe."),
    ("sent_v6_05", "きょうさしみをたべます",           "Heute esse ich Sashimi."),
    ("sent_v6_06", "わたしはりょうりをつくります",     "Ich bereite ein Gericht zu."),
    ("sent_v6_07", "それからばんごはんをたべます",     "Dann esse ich Abendessen."),
    ("sent_v6_08", "ともだちとあいます",               "Ich treffe meinen Freund."),
    ("sent_v6_09", "だんなさんはいしゃです",           "Mein Mann ist Arzt."),
    ("sent_v6_10", "かいものをします",                 "Ich gehe einkaufen."),
    ("sent_v6_11", "くるまでかいものをします",         "Ich gehe mit dem Auto einkaufen."),
    ("sent_v6_12", "ちょっとやすみます",               "Ich ruhe mich kurz aus."),
    ("sent_v6_13", "あさはごはんをたべます",           "Morgens esse ich Reis."),
    ("sent_v6_14", "あなたのみょうじはなんですか",     "Wie ist Ihr Familienname?"),
    ("sent_v6_15", "じゃあ、かいものをします",         "Also, ich gehe einkaufen."),
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def tts(text: str, out_path: str) -> bool:
    """Call ElevenLabs TTS and save MP3. Returns True on success."""
    if os.path.exists(out_path):
        print(f"  [skip] {os.path.basename(out_path)} already exists")
        return True

    url  = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    body = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }
    r = requests.post(url, headers=HEADERS, json=body, timeout=60)
    if r.status_code == 200:
        with open(out_path, "wb") as f:
            f.write(r.content)
        print(f"  [ok]   {os.path.basename(out_path)}")
        return True
    else:
        print(f"  [err]  {os.path.basename(out_path)} → HTTP {r.status_code}: {r.text[:120]}")
        return False


def generate_all(items, label: str):
    print(f"\n== {label} ==")
    for item_id, jp_text, de_text in items:
        jp_path = os.path.join(OUT_DIR, f"{item_id}_jp.mp3")
        de_path = os.path.join(OUT_DIR, f"{item_id}_de.mp3")
        tts(jp_text, jp_path)
        time.sleep(0.4)          # stay within rate limits
        tts(de_text, de_path)
        time.sleep(0.4)


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    generate_all(VOCAB_V6, "Vocabulary V6")
    generate_all(SENT_V6,  "Sentences V6")
    print("\nDone.")
