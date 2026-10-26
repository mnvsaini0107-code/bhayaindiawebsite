// BHAYA INDIA — Multilingual Search Normalization Layer
// Scalable architecture supporting Indian language normalization, transliteration, and phonetic matching.

import type { SupportedSearchLanguage } from "./types";

// Common Hindi & English stop words that should not trigger false positive matches alone
const STOP_WORDS_EN = new Set([
  "a", "an", "the", "and", "or", "in", "on", "at", "for", "to", "with",
  "of", "by", "from", "is", "are", "item", "items", "product", "products",
  "buy", "online", "india", "bhaya", "best", "good", "quality"
]);

const STOP_WORDS_HI = new Set([
  "का", "की", "के", "में", "से", "को", "पर", "और", "या", "है", "हैं",
  "था", "थी", "थे", "लिए", "साथ", "द्वारा", "यह", "वह", "उत्पाद",
  "सामग्री", "भाया", "इंडिया", "ऑनलाइन", "खरीदें"
]);

// Devanagari Unicode range: \u0900 - \u097F
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// Bengali: \u0980-\u09FF, Gujarati: \u0A80-\u0AFF, Tamil: \u0B80-\u0BFF, Telugu: \u0C00-\u0C7F, Kannada: \u0C80-\u0CFF, Malayalam: \u0D00-\u0D7F, Gurmukhi: \u0A00-\u0A7F, Odia: \u0B00-\u0B7F
export function detectLanguage(text: string): SupportedSearchLanguage {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml";
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa";
  if (/[\u0B00-\u0B7F]/.test(text)) return "or";
  return "en";
}

/**
 * Standardize strings by removing diacritics, normalizing whitespace,
 * stripping punctuation, and case folding.
 */
export function normalizeString(str: string): string {
  if (!str) return "";

  return str
    .normalize("NFKC") // Standard Unicode compatibility composition
    .toLowerCase()
    .trim()
    // Remove zero-width non-joiners & joiners
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    // Remove punctuation & symbols while preserving word letters in any script
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“”।।|\\+]/g, " ")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Common transliteration and phonetic variants mapping
 * Allows finding "Karwa Chauth" when typing "karva", "karwachauth", "करवा चौथ", etc.
 */
export const PHONETIC_TRANSLITERATION_MAP: Record<string, string[]> = {
  // Karwa / Karva / Karwachauth
  "karwa": ["karva", "करवा"],
  "karva": ["karwa", "करवा"],
  "karwa chauth": ["karva chauth", "karwachauth", "करवा चौथ", "करवा"],
  "karva chauth": ["karwa chauth", "karwachauth", "करवा चौथ", "करवा"],
  "karwachauth": ["karwa chauth", "karva chauth", "करवा चौथ"],
  "करवा चौथ": ["karwa chauth", "karva chauth", "करवा", "karwa"],
  "करवा": ["karwa", "karva", "करवा चौथ", "karwa chauth"],

  // Diwali / Deepavali / Deepawali
  "diwali": ["deepavali", "deepawali", "दिवाली", "दीपावली", "दीपक"],
  "deepavali": ["diwali", "deepawali", "दीपावली", "दिवाली"],
  "deepawali": ["diwali", "deepavali", "दीपावली", "दिवाली"],
  "दिवाली": ["diwali", "दीपावली", "deepavali", "दीपक"],
  "दीपावली": ["diwali", "दिवाली", "deepawali", "दीपक"],

  // Holi
  "holi": ["holy", "होली", "गुलाल", "रंग"],
  "होली": ["holi", "गुलाल", "रंग"],

  // Ganesh / Ganpati / Vinayaka
  "ganesh": ["ganpati", "ganesha", "गणेश", "गणपति"],
  "ganpati": ["ganesh", "ganesha", "गणपति", "गणेश"],
  "ganesh puja": ["ganpati", "ganesh utsav", "गणेश पूजा", "गणपति"],
  "गणेश": ["ganesh", "ganpati", "गणेश पूजा", "गणपति"],
  "गणपति": ["ganpati", "ganesh", "गणेश पूजा", "गणपति बप्पा"],
  "गणेश पूजा": ["ganesh puja", "ganpati", "ganesh", "गणपति"],

  // Navratri / Navratra / Durga Puja
  "navratri": ["navratra", "navaratri", "नवरात्र", "नवरात्रि", "दुर्गा पूजा"],
  "navratra": ["navratri", "नवरात्र", "नवरात्रि"],
  "नवरात्र": ["navratri", "navratra", "नवरात्रि", "durga puja"],
  "नवरात्रि": ["navratri", "नवरात्र", "durga puja"],

  // Wedding / Shaadi / Vivah
  "wedding": ["shaadi", "shadi", "vivaah", "vivah", "marriage", "शादी", "विवाह"],
  "shaadi": ["wedding", "shadi", "शादी", "विवाह"],
  "shadi": ["wedding", "shaadi", "शादी", "विवाह"],
  "शादी": ["wedding", "shaadi", "विवाह", "marriage"],
  "विवाह": ["wedding", "shaadi", "शादी", "vivaah"],

  // Gift / Uphar
  "gift": ["gifts", "uphar", "उपहार", "गिफ्ट"],
  "gifts": ["gift", "उपहार", "गिफ्ट"],
  "गिफ्ट": ["gift", "gifts", "उपहार"],
  "उपहार": ["gift", "gifts", "गिफ्ट"],

  // Puja / Pooja / Puja Samagri
  "puja": ["pooja", "puja samagri", "पूजा", "पूजा सामग्री"],
  "pooja": ["puja", "pooja samagri", "पूजा", "पूजा सामग्री"],
  "puja samagri": ["pooja samagri", "puja items", "पूजा सामग्री", "पूजा"],
  "पूजा": ["puja", "pooja", "पूजा सामग्री", "puja samagri"],
  "पूजा सामग्री": ["puja samagri", "pooja samagri", "puja items", "पूजा"],

  // Packaging / Paper Products
  "packaging": ["packaging boxes", "paper products", "पैकेजिंग", "डिब्बे"],
  "पैकेजिंग": ["packaging", "paper products", "पेपर उत्पाद", "कागज़ के उत्पाद"],
  "paper products": ["packaging", "paper bags", "पेपर उत्पाद", "कागज़ के उत्पाद"],
  "पेपर उत्पाद": ["paper products", "packaging", "कागज़ के उत्पाद", "पेपर बैग"],
  "कागज़ के उत्पाद": ["paper products", "packaging", "पेपर उत्पाद"],

  // Festival / Tyohar / Utsav
  "festival": ["festivals", "festive", "त्योहार", "त्यौहार", "उत्सव", "पर्व", "tyohar", "utsav"],
  "त्योहार": ["festival", "festivals", "उत्सव", "पर्व", "त्यौहार"],
  "उत्सव": ["festival", "त्योहार", "utsav", "पर्व"],
};

/**
 * Expand query tokens with transliterations & synonyms
 */
export function getExpandedTokens(query: string): string[] {
  const norm = normalizeString(query);
  if (!norm) return [];

  const tokens = new Set<string>();
  tokens.add(norm);

  // Check full query in phonetic map
  if (PHONETIC_TRANSLITERATION_MAP[norm]) {
    for (const v of PHONETIC_TRANSLITERATION_MAP[norm]) {
      tokens.add(normalizeString(v));
    }
  }

  // Tokenize individual words
  const words = norm.split(" ").filter((w) => w.length > 1 && !STOP_WORDS_EN.has(w) && !STOP_WORDS_HI.has(w));
  for (const word of words) {
    tokens.add(word);
    if (PHONETIC_TRANSLITERATION_MAP[word]) {
      for (const v of PHONETIC_TRANSLITERATION_MAP[word]) {
        tokens.add(normalizeString(v));
      }
    }
  }

  return Array.from(tokens);
}

/**
 * Filter meaningful tokens by removing language-specific stop words
 */
export function extractMeaningfulTokens(query: string): string[] {
  const norm = normalizeString(query);
  if (!norm) return [];

  return norm
    .split(" ")
    .filter((w) => w.length > 1 && !STOP_WORDS_EN.has(w) && !STOP_WORDS_HI.has(w));
}
