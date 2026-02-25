/**
 * Default Knowledge Bases — Learn Japanese App
 * Stored as JS so the app works without a local server (no fetch needed).
 *
 * Vocabulary: new words introduced per version.
 * Sentences:  each version uses words from ALL vocab versions up to and
 *             including it, plus the common knowledge words.
 * Common:     particles + basic words that are always available.
 */
var KB_DEFAULTS = {

  /* ────────────────────────────────────────────────────────────────
     COMMON KNOWLEDGE  (particles + basic words, used in all sentences)
     Not practised as flashcards — reference only.
  ──────────────────────────────────────────────────────────────── */
  common: {
    particles: [
      { romaji:"wa",  kana:"は", explanation_de:"Satzthema-Partikel",   usage_de:"Markiert das Thema des Satzes",            example_de:"watashi WA Maria desu → Ich bin Maria." },
      { romaji:"o",   kana:"を", explanation_de:"Objektpartikel",       usage_de:"Markiert das direkte Objekt",              example_de:"sakana O kaimasu → Ich kaufe Fisch." },
      { romaji:"mo",  kana:"も", explanation_de:"Inklusivpartikel",     usage_de:"‚auch' – ersetzt wa oder o",               example_de:"watashi MO kaimasu → Ich kaufe auch." },
      { romaji:"ka",  kana:"か", explanation_de:"Fragepartikel",        usage_de:"Am Satzende → macht Aussage zur Frage",    example_de:"hon desu KA → Ist das ein Buch?" }
    ],
    words: [
      { romaji:"kore",        kana:"これ",           explanation_de:"das hier",                usage_de:"Zeigt auf etwas in Sprechernähe" },
      { romaji:"sore",        kana:"それ",           explanation_de:"das da",                  usage_de:"Zeigt auf etwas in Hörernähe" },
      { romaji:"are",         kana:"あれ",           explanation_de:"das dort drüben",         usage_de:"Zeigt auf etwas, das weit entfernt ist" },
      { romaji:"watashi",     kana:"わたし",         explanation_de:"ich",                     usage_de:"Personalpronomen 1. Person Singular" },
      { romaji:"san",         kana:"さん",           explanation_de:"Höflichkeitssuffix",      usage_de:"Herr/Frau – an Namen angehängt" },
      { romaji:"Osutoria-jin",kana:"オーストリアじん",explanation_de:"Österreicher/in",        usage_de:"Nationalitätsbezeichnung" },
      { romaji:"Doitsu-jin",  kana:"ドイツじん",     explanation_de:"Deutscher/Deutsche",      usage_de:"Nationalitätsbezeichnung" }
    ]
  },

  /* ────────────────────────────────────────────────────────────────
     VOCABULARY  (new words per version, practised as flashcards)
  ──────────────────────────────────────────────────────────────── */
  vocabulary: {

    v1: [
      { id:"vocab_v1_01", japanese_romaji:"sakana",            japanese_kana:"さかな",              german:"Fisch",                       alternates_romaji:["sakaná"],                      alternates_german:[] },
      { id:"vocab_v1_02", japanese_romaji:"yasai",             japanese_kana:"やさい",              german:"Gemüse",                      alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_03", japanese_romaji:"tamago",            japanese_kana:"たまご",              german:"Ei",                          alternates_romaji:["tamágo"],                      alternates_german:[] },
      { id:"vocab_v1_04", japanese_romaji:"pan",               japanese_kana:"ぱん / パン",         german:"Brot",                        alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_05", japanese_romaji:"koohii",            japanese_kana:"こーひー / コーヒー", german:"Kaffee",                      alternates_romaji:["kohi","kohii","kouhii","kôhî"],alternates_german:[] },
      { id:"vocab_v1_06", japanese_romaji:"kinou",             japanese_kana:"きのう",              german:"gestern",                     alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_07", japanese_romaji:"konban",            japanese_kana:"こんばん",            german:"heute Abend",                 alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_08", japanese_romaji:"itsumo",            japanese_kana:"いつも",              german:"immer",                       alternates_romaji:["itsúmo"],                      alternates_german:[] },
      { id:"vocab_v1_09", japanese_romaji:"taitei",            japanese_kana:"たいてい",            german:"meistens",                    alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_10", japanese_romaji:"nani",              japanese_kana:"なに",                german:"was",                         alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_11", japanese_romaji:"kaimasu",           japanese_kana:"かいます",            german:"kaufen",                      alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_12", japanese_romaji:"yasumimasu",        japanese_kana:"やすみます",          german:"sich ausruhen, Pause machen", alternates_romaji:[],                              alternates_german:["sich ausruhen","ausruhen","Pause machen"] },
      { id:"vocab_v1_13", japanese_romaji:"shimasu",           japanese_kana:"します",              german:"tun, machen",                 alternates_romaji:[],                              alternates_german:["tun","machen"] },
      { id:"vocab_v1_14", japanese_romaji:"shigoto o shimasu", japanese_kana:"しごとをします",      german:"arbeiten",                    alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_15", japanese_romaji:"fuku",              japanese_kana:"ふく",                german:"Kleidung, Kleider",           alternates_romaji:[],                              alternates_german:["Kleidung","Kleider"] },
      { id:"vocab_v1_16", japanese_romaji:"hon",               japanese_kana:"ほん",                german:"Buch",                        alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_17", japanese_romaji:"zasshi",            japanese_kana:"ざっし",              german:"Zeitschrift",                 alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_18", japanese_romaji:"shigoto",           japanese_kana:"しごと",              german:"Arbeit",                      alternates_romaji:[],                              alternates_german:[] },
      { id:"vocab_v1_19", japanese_romaji:"sumimasen",         japanese_kana:"すみません",          german:"Verzeihung, Entschuldigung",  alternates_romaji:[],                              alternates_german:["Verzeihung","Entschuldigung"] }
    ],

    v2: [
      { id:"vocab_v2_01", japanese_romaji:"hai",          japanese_kana:"はい",    german:"ja",                          alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_02", japanese_romaji:"iie",          japanese_kana:"いいえ",  german:"nein",                        alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_03", japanese_romaji:"douzo",        japanese_kana:"どうぞ",  german:"bitte (beim Anbieten)",       alternates_romaji:["dōzo"],   alternates_german:["bitte"] },
      { id:"vocab_v2_04", japanese_romaji:"doumo",        japanese_kana:"どうも",  german:"danke",                       alternates_romaji:["dōmo"],   alternates_german:["Danke"] },
      { id:"vocab_v2_05", japanese_romaji:"kyou",         japanese_kana:"きょう",  german:"heute",                       alternates_romaji:["kyō"],    alternates_german:[] },
      { id:"vocab_v2_06", japanese_romaji:"ashita",       japanese_kana:"あした",  german:"morgen",                      alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_07", japanese_romaji:"asatte",       japanese_kana:"あさって", german:"übermorgen",                  alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_08", japanese_romaji:"tabemasu",     japanese_kana:"たべます", german:"essen",                       alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_09", japanese_romaji:"nomimasu",     japanese_kana:"のみます", german:"trinken",                     alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_10", japanese_romaji:"hanashimasu",  japanese_kana:"はなします",german:"reden, sprechen",            alternates_romaji:[],         alternates_german:["reden","sprechen"] },
      { id:"vocab_v2_11", japanese_romaji:"machimasu",    japanese_kana:"まちます", german:"warten",                      alternates_romaji:[],         alternates_german:[] },
      { id:"vocab_v2_12", japanese_romaji:"asobimasu",    japanese_kana:"あそびます",german:"spielen, sich vergnügen",   alternates_romaji:[],         alternates_german:["spielen","sich vergnügen","vergnügen"] }
    ],

    v3: [
      { id:"vocab_v3_01", japanese_romaji:"eiga",        japanese_kana:"えいが",         german:"Spielfilm, Film",             alternates_romaji:[],        alternates_german:["Film","Spielfilm"] },
      { id:"vocab_v3_02", japanese_romaji:"ongaku",      japanese_kana:"おんがく",       german:"Musik",                       alternates_romaji:[],        alternates_german:[] },
      { id:"vocab_v3_03", japanese_romaji:"shinbun",     japanese_kana:"しんぶん",       german:"Zeitung",                     alternates_romaji:[],        alternates_german:[] },
      { id:"vocab_v3_04", japanese_romaji:"terebi",      japanese_kana:"てれび / テレビ",german:"Fernseher, Fernsehen",        alternates_romaji:[],        alternates_german:["Fernseher","Fernsehen","TV"] },
      { id:"vocab_v3_05", japanese_romaji:"rajio",       japanese_kana:"らじお / ラジオ",german:"Radio",                       alternates_romaji:[],        alternates_german:[] },
      { id:"vocab_v3_06", japanese_romaji:"watashi",     japanese_kana:"わたし",         german:"ich",                         alternates_romaji:[],        alternates_german:[] },
      { id:"vocab_v3_07", japanese_romaji:"o-kashi",     japanese_kana:"おかし",         german:"Süßigkeiten, Gebäck",         alternates_romaji:["okashi"],alternates_german:["Süßigkeiten","Gebäck"] },
      { id:"vocab_v3_08", japanese_romaji:"o-sake",      japanese_kana:"おさけ",         german:"Reiswein, Alkohol",           alternates_romaji:["osake"], alternates_german:["Reiswein","Alkohol"] },
      { id:"vocab_v3_09", japanese_romaji:"kikimasu",    japanese_kana:"ききます",       german:"hören, fragen",               alternates_romaji:[],        alternates_german:["hören","anhören","zuhören","fragen"] },
      { id:"vocab_v3_10", japanese_romaji:"mimasu",      japanese_kana:"みます",         german:"sehen, anschauen",            alternates_romaji:[],        alternates_german:["sehen","anschauen","ansehen","zuschauen"] },
      { id:"vocab_v3_11", japanese_romaji:"tsukurimasu", japanese_kana:"つくります",     german:"herstellen, zubereiten",      alternates_romaji:[],        alternates_german:["herstellen","zubereiten","machen","kochen"] },
      { id:"vocab_v3_12", japanese_romaji:"yomimasu",    japanese_kana:"よみます",       german:"lesen",                       alternates_romaji:[],        alternates_german:[] },
      { id:"vocab_v3_13", japanese_romaji:"yoku",        japanese_kana:"よく",           german:"oft, häufig",                 alternates_romaji:[],        alternates_german:["oft","häufig"] },
      { id:"vocab_v3_14", japanese_romaji:"amari",       japanese_kana:"あまり",         german:"selten, kaum (+ Verneinung)",alternates_romaji:[],        alternates_german:["selten","kaum"] },
      { id:"vocab_v3_15", japanese_romaji:"zenzen",      japanese_kana:"ぜんぜん",       german:"gar nicht, nie (+ Verneinung)",alternates_romaji:[],      alternates_german:["gar nicht","nie"] }
    ],

    v4: [
      { id:"vocab_v4_01", japanese_romaji:"chizu",       japanese_kana:"ちず",     german:"Karte, Plan",              alternates_romaji:[],   alternates_german:["Karte","Landkarte","Plan"] },
      { id:"vocab_v4_02", japanese_romaji:"kami",        japanese_kana:"かみ",     german:"Papier",                   alternates_romaji:[],   alternates_german:[] },
      { id:"vocab_v4_03", japanese_romaji:"jisho",       japanese_kana:"じしょ",   german:"Wörterbuch",               alternates_romaji:[],   alternates_german:[] },
      { id:"vocab_v4_04", japanese_romaji:"hagaki",      japanese_kana:"はがき",   german:"Postkarte",                alternates_romaji:[],   alternates_german:[] },
      { id:"vocab_v4_05", japanese_romaji:"shashin",     japanese_kana:"しゃしん", german:"Foto",                     alternates_romaji:[],   alternates_german:[] },
      { id:"vocab_v4_06", japanese_romaji:"enpitsu",     japanese_kana:"えんぴつ", german:"Bleistift",                alternates_romaji:[],   alternates_german:[] },
      { id:"vocab_v4_07", japanese_romaji:"mizu",        japanese_kana:"みず",     german:"Wasser",                   alternates_romaji:[],   alternates_german:[] },
      { id:"vocab_v4_08", japanese_romaji:"a",           japanese_kana:"あ",       german:"Ach!, Oh! (Überraschung)", alternates_romaji:[],   alternates_german:["Ach","Oh","Ach so"] },
      { id:"vocab_v4_09", japanese_romaji:"kochira",     japanese_kana:"こちら",   german:"diese Person hier, hier",  alternates_romaji:[],   alternates_german:["diese Person","hier","diese Seite"] },
      { id:"vocab_v4_10", japanese_romaji:"tomodachi",   japanese_kana:"ともだち", german:"Freund/in",                alternates_romaji:[],   alternates_german:["Freund","Freundin"] },
      { id:"vocab_v4_11", japanese_romaji:"o-cha",       japanese_kana:"おちゃ",   german:"Tee",                      alternates_romaji:["ocha"], alternates_german:[] },
      { id:"vocab_v4_12", japanese_romaji:"chigaimasu",  japanese_kana:"ちがいます",german:"anders sein, falsch sein", alternates_romaji:[],   alternates_german:["anders sein","nicht stimmen","falsch sein"] },
      { id:"vocab_v4_13", japanese_romaji:"wakarimasu",  japanese_kana:"わかります",german:"verstehen, wissen",        alternates_romaji:[],   alternates_german:["verstehen","wissen"] },
      { id:"vocab_v4_14", japanese_romaji:"kakimasu",    japanese_kana:"かきます",  german:"schreiben, zeichnen",      alternates_romaji:[],   alternates_german:["schreiben","zeichnen"] }
    ],

    v5: [
      { id:"vocab_v5_01", japanese_romaji:"anata",              japanese_kana:"あなた",           german:"Sie, du",                  alternates_romaji:[],  alternates_german:["Sie","du"] },
      { id:"vocab_v5_02", japanese_romaji:"dare",               japanese_kana:"だれ",             german:"wer",                      alternates_romaji:[],  alternates_german:[] },
      { id:"vocab_v5_03", japanese_romaji:"hito",               japanese_kana:"ひと",             german:"Person, Mensch, Leute",    alternates_romaji:[],  alternates_german:["Person","Mensch","Leute"] },
      { id:"vocab_v5_04", japanese_romaji:"kata",               japanese_kana:"かた",             german:"Person (höflich)",         alternates_romaji:[],  alternates_german:["Person"] },
      { id:"vocab_v5_05", japanese_romaji:"kaisha-in",          japanese_kana:"かいしゃいん",     german:"Angestellte/r",            alternates_romaji:["kaishain"], alternates_german:["Angestellter","Angestellte"] },
      { id:"vocab_v5_06", japanese_romaji:"isha",               japanese_kana:"いしゃ",           german:"Arzt, Ärztin",             alternates_romaji:[],  alternates_german:["Arzt","Ärztin"] },
      { id:"vocab_v5_07", japanese_romaji:"gakusei",            japanese_kana:"がくせい",         german:"Schüler/in, Student/in",   alternates_romaji:[],  alternates_german:["Schüler","Schülerin","Student","Studentin"] },
      { id:"vocab_v5_08", japanese_romaji:"sensei",             japanese_kana:"せんせい",         german:"Lehrer/in",                alternates_romaji:[],  alternates_german:["Lehrer","Lehrerin"] },
      { id:"vocab_v5_09", japanese_romaji:"enjinia",            japanese_kana:"エンジニア",       german:"Ingenieur/in",             alternates_romaji:[],  alternates_german:["Ingenieur","Ingenieurin"] },
      { id:"vocab_v5_10", japanese_romaji:"Nihon",              japanese_kana:"にほん",           german:"Japan",                    alternates_romaji:["nihon"], alternates_german:[] },
      { id:"vocab_v5_11", japanese_romaji:"tokei",              japanese_kana:"とけい",           german:"Uhr",                      alternates_romaji:[],  alternates_german:[] },
      { id:"vocab_v5_12", japanese_romaji:"kasa",               japanese_kana:"かさ",             german:"Schirm, Regenschirm",      alternates_romaji:[],  alternates_german:["Schirm","Regenschirm"] },
      { id:"vocab_v5_13", japanese_romaji:"gomen nasai",        japanese_kana:"ごめんなさい",     german:"Es tut mir leid",          alternates_romaji:["gomennasai"], alternates_german:["tut mir leid","Entschuldigung"] },
      { id:"vocab_v5_14", japanese_romaji:"arigatou gozaimasu", japanese_kana:"ありがとうございます",german:"Vielen Dank",            alternates_romaji:["arigatou","arigato gozaimasu","arigatoo gozaimasu"], alternates_german:["vielen Dank","Danke sehr","Dankeschön"] },
      { id:"vocab_v5_15", japanese_romaji:"saa",                japanese_kana:"さあ",             german:"Hm, Nun ja ...",           alternates_romaji:["saa ...","sā"], alternates_german:["Hm","Nun ja","Tja"] }
    ]
  },

  /* ────────────────────────────────────────────────────────────────
     SENTENCES
     V1  = V1 vocab + common
     V2  = V1+V2 vocab + common  (new sentences, richer variety)
     V3  = V1+V2+V3 vocab + common
     V4  = V1–V4 vocab + common
     V5  = all vocab + common
     Self-grading: the app shows model answer; user rates themselves.
  ──────────────────────────────────────────────────────────────── */
  sentences: {

    v1: [
      { id:"sent_v1_01", japanese_romaji:"watashi wa Doitsu-jin desu",      japanese_kana:"わたしはドイツじんです",       german:"Ich bin Deutsch(e/r).",            alternates_german:["Ich bin Deutscher.","Ich bin Deutsche."] },
      { id:"sent_v1_02", japanese_romaji:"kore wa hon desu ka",             japanese_kana:"これはほんですか",             german:"Ist das ein Buch?",               alternates_german:["Ist das hier ein Buch?"] },
      { id:"sent_v1_03", japanese_romaji:"sore wa zasshi desu",             japanese_kana:"それはざっしです",             german:"Das ist eine Zeitschrift.",       alternates_german:["Das da ist eine Zeitschrift."] },
      { id:"sent_v1_04", japanese_romaji:"are wa nani desu ka",             japanese_kana:"あれはなにですか",             german:"Was ist das dort?",               alternates_german:["Was ist das dort drüben?","Was ist das?"] },
      { id:"sent_v1_05", japanese_romaji:"watashi wa sakana o kaimasu",     japanese_kana:"わたしはさかなをかいます",     german:"Ich kaufe Fisch.",                alternates_german:["Ich kaufe einen Fisch."] },
      { id:"sent_v1_06", japanese_romaji:"sumimasen, nani o shimasu ka",    japanese_kana:"すみません、なにをしますか",   german:"Entschuldigung, was machen Sie?", alternates_german:["Verzeihung, was machen Sie?","Entschuldigung, was tun Sie?"] },
      { id:"sent_v1_07", japanese_romaji:"kinou shigoto o shimashita",      japanese_kana:"きのうしごとをしました",       german:"Gestern habe ich gearbeitet.",    alternates_german:["Ich habe gestern gearbeitet."] },
      { id:"sent_v1_08", japanese_romaji:"konban yasumimasu",               japanese_kana:"こんばんやすみます",           german:"Heute Abend ruhe ich mich aus.",  alternates_german:["Heute Abend mache ich Pause."] },
      { id:"sent_v1_09", japanese_romaji:"watashi mo yasai o kaimasu",      japanese_kana:"わたしもやさいをかいます",     german:"Ich kaufe auch Gemüse.",          alternates_german:[] },
      { id:"sent_v1_10", japanese_romaji:"kore wa fuku desu",               japanese_kana:"これはふくです",               german:"Das ist Kleidung.",               alternates_german:["Das sind Kleider."] },
      { id:"sent_v1_11", japanese_romaji:"taitei shigoto o shimasu",        japanese_kana:"たいていしごとをします",       german:"Ich arbeite meistens.",           alternates_german:["Meistens arbeite ich."] },
      { id:"sent_v1_12", japanese_romaji:"watashi wa Osutoria-jin desu",    japanese_kana:"わたしはオーストリアじんです", german:"Ich bin Österreicher/in.",        alternates_german:["Ich bin Österreicher.","Ich bin Österreicherin."] },
      { id:"sent_v1_13", japanese_romaji:"nani o kaimasu ka",               japanese_kana:"なにをかいますか",             german:"Was kaufen Sie?",                 alternates_german:["Was kaufst du?"] },
      { id:"sent_v1_14", japanese_romaji:"hon mo zasshi mo kaimasu",        japanese_kana:"ほんもざっしもかいます",       german:"Ich kaufe Bücher und Zeitschriften.", alternates_german:["Ich kaufe sowohl Bücher als auch Zeitschriften."] },
      { id:"sent_v1_15", japanese_romaji:"itsumo yasumimasu ka",            japanese_kana:"いつもやすみますか",           german:"Ruhen Sie sich immer aus?",       alternates_german:["Machen Sie immer Pause?","Ruhst du dich immer aus?"] }
    ],

    v2: [
      { id:"sent_v2_01", japanese_romaji:"kyou nani o tabemasu ka",              japanese_kana:"きょうなにをたべますか",         german:"Was essen Sie heute?",                 alternates_german:["Was isst du heute?"] },
      { id:"sent_v2_02", japanese_romaji:"ashita pan o kaimasu",                 japanese_kana:"あしたぱんをかいます",           german:"Morgen kaufe ich Brot.",               alternates_german:["Ich kaufe morgen Brot."] },
      { id:"sent_v2_03", japanese_romaji:"watashi wa tamago o tabemasu",         japanese_kana:"わたしはたまごをたべます",       german:"Ich esse Eier.",                       alternates_german:["Ich esse ein Ei."] },
      { id:"sent_v2_04", japanese_romaji:"konban koohii o nomimasu",             japanese_kana:"こんばんこーひーをのみます",     german:"Heute Abend trinke ich Kaffee.",       alternates_german:["Ich trinke heute Abend Kaffee."] },
      { id:"sent_v2_05", japanese_romaji:"hai, shimasu",                         japanese_kana:"はい、します",                   german:"Ja, ich mache das.",                   alternates_german:["Ja, ich tue das.","Ja."] },
      { id:"sent_v2_06", japanese_romaji:"iie, yasumimasu",                      japanese_kana:"いいえ、やすみます",             german:"Nein, ich ruhe mich aus.",             alternates_german:["Nein, ich mache Pause."] },
      { id:"sent_v2_07", japanese_romaji:"doumo, tabemasu",                      japanese_kana:"どうも、たべます",               german:"Danke, ich esse.",                     alternates_german:[] },
      { id:"sent_v2_08", japanese_romaji:"ashita nani o shimasu ka",             japanese_kana:"あしたなにをしますか",           german:"Was machen Sie morgen?",               alternates_german:["Was machst du morgen?"] },
      { id:"sent_v2_09", japanese_romaji:"taitei nani o tabemasu ka",            japanese_kana:"たいていなにをたべますか",       german:"Was essen Sie meistens?",              alternates_german:["Was isst du meistens?"] },
      { id:"sent_v2_10", japanese_romaji:"konban asobimasu",                     japanese_kana:"こんばんあそびます",             german:"Heute Abend spiele ich.",              alternates_german:["Heute Abend vergnüge ich mich."] },
      { id:"sent_v2_11", japanese_romaji:"watashi mo tabemasu",                  japanese_kana:"わたしもたべます",               german:"Ich esse auch.",                       alternates_german:[] },
      { id:"sent_v2_12", japanese_romaji:"kyou hanashimasu ka",                  japanese_kana:"きょうはなしますか",             german:"Reden Sie heute?",                     alternates_german:["Sprichst du heute?"] },
      { id:"sent_v2_13", japanese_romaji:"asatte nani o shimasu ka",             japanese_kana:"あさってなにをしますか",         german:"Was machen Sie übermorgen?",           alternates_german:["Was machst du übermorgen?"] },
      { id:"sent_v2_14", japanese_romaji:"watashi wa itsumo koohii o nomimasu",  japanese_kana:"わたしはいつもこーひーをのみます",german:"Ich trinke immer Kaffee.",             alternates_german:[] },
      { id:"sent_v2_15", japanese_romaji:"douzo, yasai o tabemasu",              japanese_kana:"どうぞ、やさいをたべます",       german:"Bitte, essen Sie das Gemüse.",         alternates_german:["Hier, essen Sie Gemüse."] }
    ],

    v3: [
      { id:"sent_v3_01", japanese_romaji:"watashi wa eiga o mimasu",             japanese_kana:"わたしはえいがをみます",         german:"Ich sehe einen Film.",                 alternates_german:["Ich schaue einen Film.","Ich schaue mir einen Film an."] },
      { id:"sent_v3_02", japanese_romaji:"kyou ongaku o kikimasu",               japanese_kana:"きょうおんがくをききます",       german:"Heute höre ich Musik.",                alternates_german:["Ich höre heute Musik."] },
      { id:"sent_v3_03", japanese_romaji:"taitei shinbun o yomimasu",            japanese_kana:"たいていしんぶんをよみます",     german:"Ich lese meistens Zeitung.",           alternates_german:["Meistens lese ich Zeitung."] },
      { id:"sent_v3_04", japanese_romaji:"watashi wa terebi o amari mimasen",    japanese_kana:"わたしはてれびをあまりみません", german:"Ich sehe selten fern.",                alternates_german:["Ich schaue selten fern.","Ich schaue kaum fern."] },
      { id:"sent_v3_05", japanese_romaji:"koohii o tsukurimasu",                 japanese_kana:"こーひーをつくります",           german:"Ich mache Kaffee.",                    alternates_german:["Ich bereite Kaffee zu."] },
      { id:"sent_v3_06", japanese_romaji:"hon o yomimasu ka",                    japanese_kana:"ほんをよみますか",               german:"Lesen Sie ein Buch?",                  alternates_german:["Liest du ein Buch?"] },
      { id:"sent_v3_07", japanese_romaji:"watashi wa zenzen rajio o kikimasen",  japanese_kana:"わたしはぜんぜんらじおをききません",german:"Ich höre gar kein Radio.",            alternates_german:["Ich höre überhaupt kein Radio."] },
      { id:"sent_v3_08", japanese_romaji:"o-sake o nomimasu",                    japanese_kana:"おさけをのみます",               german:"Ich trinke Reiswein.",                 alternates_german:["Ich trinke Alkohol."] },
      { id:"sent_v3_09", japanese_romaji:"yoku eiga o mimasu",                   japanese_kana:"よくえいがをみます",             german:"Ich sehe oft Filme.",                  alternates_german:["Ich schaue oft Filme."] },
      { id:"sent_v3_10", japanese_romaji:"o-kashi o kaimasu",                    japanese_kana:"おかしをかいます",               german:"Ich kaufe Süßigkeiten.",               alternates_german:["Ich kaufe Gebäck."] },
      { id:"sent_v3_11", japanese_romaji:"kinou shinbun o yomimashita",          japanese_kana:"きのうしんぶんをよみました",     german:"Gestern habe ich die Zeitung gelesen.", alternates_german:["Ich habe gestern Zeitung gelesen."] },
      { id:"sent_v3_12", japanese_romaji:"ongaku o kikimasu ka",                 japanese_kana:"おんがくをききますか",           german:"Hören Sie Musik?",                     alternates_german:["Hörst du Musik?"] },
      { id:"sent_v3_13", japanese_romaji:"konban eiga o mimasu",                 japanese_kana:"こんばんえいがをみます",         german:"Heute Abend sehe ich einen Film.",     alternates_german:["Heute Abend schaue ich einen Film."] },
      { id:"sent_v3_14", japanese_romaji:"watashi wa amari asobimassen",         japanese_kana:"わたしはあまりあそびません",     german:"Ich spiele selten.",                   alternates_german:["Ich vergnüge mich selten."] },
      { id:"sent_v3_15", japanese_romaji:"terebi mo rajio mo kikimasu",          japanese_kana:"てれびもらじおもききます",       german:"Ich sehe fern und höre Radio.",        alternates_german:["Ich höre sowohl Fernsehen als auch Radio."] }
    ],

    v4: [
      { id:"sent_v4_01", japanese_romaji:"watashi wa jisho o kaimasu",           japanese_kana:"わたしはじしょをかいます",       german:"Ich kaufe ein Wörterbuch.",            alternates_german:[] },
      { id:"sent_v4_02", japanese_romaji:"tomodachi wa eiga o mimasu",           japanese_kana:"ともだちはえいがをみます",       german:"Mein Freund sieht einen Film.",        alternates_german:["Meine Freundin sieht einen Film.","Der Freund schaut einen Film."] },
      { id:"sent_v4_03", japanese_romaji:"o-cha o nomimasu ka",                  japanese_kana:"おちゃをのみますか",             german:"Trinken Sie Tee?",                     alternates_german:["Trinkst du Tee?"] },
      { id:"sent_v4_04", japanese_romaji:"watashi wa shashin o tsukurimasu",     japanese_kana:"わたしはしゃしんをつくります",   german:"Ich mache ein Foto.",                  alternates_german:["Ich erstelle ein Foto."] },
      { id:"sent_v4_05", japanese_romaji:"enpitsu de kakimasu",                  japanese_kana:"えんぴつでかきます",             german:"Ich schreibe mit dem Bleistift.",      alternates_german:["Ich schreibe mit Bleistift."] },
      { id:"sent_v4_06", japanese_romaji:"mizu o nomimasu",                      japanese_kana:"みずをのみます",                 german:"Ich trinke Wasser.",                   alternates_german:[] },
      { id:"sent_v4_07", japanese_romaji:"a, wakarimasu",                        japanese_kana:"あ、わかります",                 german:"Ach, ich verstehe.",                   alternates_german:["Oh, ich verstehe.","Ach so, ich verstehe."] },
      { id:"sent_v4_08", japanese_romaji:"kochira wa tomodachi desu",            japanese_kana:"こちらはともだちです",           german:"Das ist mein Freund / meine Freundin.", alternates_german:["Das hier ist mein Freund.","Das ist meine Freundin."] },
      { id:"sent_v4_09", japanese_romaji:"chigaimasu, kore wa kami desu",        japanese_kana:"ちがいます、これはかみです",     german:"Nein, das ist Papier.",                alternates_german:["Das stimmt nicht, das ist Papier."] },
      { id:"sent_v4_10", japanese_romaji:"tomodachi ni hagaki o kakimasu",       japanese_kana:"ともだちにはがきをかきます",     german:"Ich schreibe meinem Freund eine Postkarte.", alternates_german:["Ich schreibe meiner Freundin eine Postkarte."] },
      { id:"sent_v4_11", japanese_romaji:"chizu o kaimasu",                      japanese_kana:"ちずをかいます",                 german:"Ich kaufe eine Karte.",                alternates_german:["Ich kaufe einen Plan.","Ich kaufe eine Landkarte."] },
      { id:"sent_v4_12", japanese_romaji:"wakarimasu ka",                        japanese_kana:"わかりますか",                   german:"Verstehen Sie?",                       alternates_german:["Verstehst du?","Wissen Sie das?"] },
      { id:"sent_v4_13", japanese_romaji:"tomodachi to asobimasu",               japanese_kana:"ともだちとあそびます",           german:"Ich spiele mit meinem Freund.",        alternates_german:["Ich vergnüge mich mit meiner Freundin."] },
      { id:"sent_v4_14", japanese_romaji:"shashin o mimasu",                     japanese_kana:"しゃしんをみます",               german:"Ich schaue mir das Foto an.",          alternates_german:["Ich sehe mir ein Foto an."] },
      { id:"sent_v4_15", japanese_romaji:"jisho mo kami mo kaimasu",             japanese_kana:"じしょもかみもかいます",         german:"Ich kaufe sowohl ein Wörterbuch als auch Papier.", alternates_german:["Ich kaufe ein Wörterbuch und Papier."] }
    ],

    v5: [
      { id:"sent_v5_01", japanese_romaji:"anata wa gakusei desu ka",             japanese_kana:"あなたはがくせいですか",         german:"Sind Sie Student/in?",                 alternates_german:["Sind Sie Schüler/in?","Bist du Student?"] },
      { id:"sent_v5_02", japanese_romaji:"watashi wa sensei desu",               japanese_kana:"わたしはせんせいです",           german:"Ich bin Lehrer/in.",                   alternates_german:["Ich bin Lehrer.","Ich bin Lehrerin."] },
      { id:"sent_v5_03", japanese_romaji:"kochira wa isha no kata desu",         japanese_kana:"こちらはいしゃのかたです",       german:"Das ist ein Arzt / eine Ärztin.",      alternates_german:["Das hier ist ein Arzt.","Das ist eine Ärztin."] },
      { id:"sent_v5_04", japanese_romaji:"dare ga Nihon-jin desu ka",            japanese_kana:"だれがにほんじんですか",         german:"Wer ist Japaner/in?",                  alternates_german:["Wer ist Japaner?","Wer ist Japanerin?"] },
      { id:"sent_v5_05", japanese_romaji:"arigatou gozaimasu, wakarimashita",    japanese_kana:"ありがとうございます、わかりました",german:"Vielen Dank, ich habe verstanden.",   alternates_german:["Danke sehr, ich habe verstanden."] },
      { id:"sent_v5_06", japanese_romaji:"gomen nasai, chigaimasu",              japanese_kana:"ごめんなさい、ちがいます",       german:"Es tut mir leid, das stimmt nicht.",   alternates_german:["Entschuldigung, das ist falsch."] },
      { id:"sent_v5_07", japanese_romaji:"kasa o kaimasu",                       japanese_kana:"かさをかいます",                 german:"Ich kaufe einen Schirm.",              alternates_german:["Ich kaufe einen Regenschirm."] },
      { id:"sent_v5_08", japanese_romaji:"tokei o mimasu",                       japanese_kana:"とけいをみます",                 german:"Ich schaue auf die Uhr.",              alternates_german:["Ich sehe auf die Uhr."] },
      { id:"sent_v5_09", japanese_romaji:"anata wa enjinia desu ka",             japanese_kana:"あなたはエンジニアですか",       german:"Sind Sie Ingenieur/in?",               alternates_german:["Bist du Ingenieur?","Bist du Ingenieurin?"] },
      { id:"sent_v5_10", japanese_romaji:"watashi wa kaisha-in desu",            japanese_kana:"わたしはかいしゃいんです",       german:"Ich bin Angestellte/r.",               alternates_german:["Ich bin Angestellter.","Ich bin Angestellte."] },
      { id:"sent_v5_11", japanese_romaji:"saa, wakarimassen",                    japanese_kana:"さあ、わかりません",             german:"Hm, ich weiß es nicht.",               alternates_german:["Nun ja, ich verstehe nicht.","Tja, ich weiß nicht."] },
      { id:"sent_v5_12", japanese_romaji:"dare no kasa desu ka",                 japanese_kana:"だれのかさですか",               german:"Wessen Schirm ist das?",               alternates_german:["Wessen Regenschirm ist das?"] },
      { id:"sent_v5_13", japanese_romaji:"anata mo Nihon-jin desu ka",           japanese_kana:"あなたもにほんじんですか",       german:"Sind Sie auch Japaner/in?",            alternates_german:["Bist du auch Japaner/in?"] },
      { id:"sent_v5_14", japanese_romaji:"tomodachi wa isha desu",               japanese_kana:"ともだちはいしゃです",           german:"Mein Freund ist Arzt.",                alternates_german:["Meine Freundin ist Ärztin.","Der Freund ist Arzt."] },
      { id:"sent_v5_15", japanese_romaji:"hito wa dare desu ka",                 japanese_kana:"ひとはだれですか",               german:"Wer ist diese Person?",                alternates_german:["Wer ist das?"] }
    ]
  }
};
