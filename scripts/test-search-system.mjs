// Automated Test Suite for BHAYA INDIA Search System
// Validates all test cases in Requirement 25 & Requirement 4, 5, 6, 7, 8, 9, 10

import { analyzeSearchIntent, executeSearch } from "../src/lib/search/engine.js";
import { generateSearchSuggestions } from "../src/lib/search/suggestions.js";
import { normalizeString } from "../src/lib/search/normalization.js";

const TEST_QUERIES = [
  // Festival cluster
  { query: "Festival", expectedCat: "festival", lang: "en" },
  { query: "त्योहार", expectedCat: "festival", lang: "hi" },

  // Karwa Chauth cluster
  { query: "Karwa Chauth", expectedCat: "festival", expectedSubcat: "karwa-chauth", lang: "en" },
  { query: "करवा चौथ", expectedCat: "festival", expectedSubcat: "karwa-chauth", lang: "hi" },
  { query: "Karva Chauth", expectedCat: "festival", expectedSubcat: "karwa-chauth", lang: "en" },

  // Diwali cluster
  { query: "Diwali", expectedCat: "festival", expectedSubcat: "diwali", lang: "en" },
  { query: "दिवाली", expectedCat: "festival", expectedSubcat: "diwali", lang: "hi" },
  { query: "दीपावली", expectedCat: "festival", expectedSubcat: "diwali", lang: "hi" },

  // Holi cluster
  { query: "Holi", expectedCat: "festival", expectedSubcat: "holi", lang: "en" },
  { query: "होली", expectedCat: "festival", expectedSubcat: "holi", lang: "hi" },

  // Ganesh Puja / Ganpati cluster
  { query: "Ganesh Puja", expectedCat: "festival", expectedSubcat: "ganesh-puja", lang: "en" },
  { query: "गणेश पूजा", expectedCat: "festival", expectedSubcat: "ganesh-puja", lang: "hi" },
  { query: "Ganpati", expectedCat: "festival", expectedSubcat: "ganesh-puja", lang: "en" },
  { query: "गणपति", expectedCat: "festival", expectedSubcat: "ganesh-puja", lang: "hi" },

  // Navratri cluster
  { query: "Navratri", expectedCat: "festival", expectedSubcat: "navratri", lang: "en" },
  { query: "नवरात्र", expectedCat: "festival", expectedSubcat: "navratri", lang: "hi" },
  { query: "नवरात्रि", expectedCat: "festival", expectedSubcat: "navratri", lang: "hi" },

  // Wedding cluster
  { query: "Wedding", expectedCat: "festival", expectedSubcat: "wedding-marriage-items", lang: "en" },
  { query: "शादी", expectedCat: "festival", expectedSubcat: "wedding-marriage-items", lang: "hi" },
  { query: "विवाह", expectedCat: "festival", expectedSubcat: "wedding-marriage-items", lang: "hi" },

  // Gift cluster
  { query: "Gift", expectedCat: "festival", expectedSubcat: "gift-items", lang: "en" },
  { query: "गिफ्ट", expectedCat: "festival", expectedSubcat: "gift-items", lang: "hi" },
  { query: "उपहार", expectedCat: "festival", expectedSubcat: "gift-items", lang: "hi" },

  // Puja cluster
  { query: "Puja", expectedCat: "festival", expectedSubcat: "puja-items", lang: "en" },
  { query: "पूजा", expectedCat: "festival", expectedSubcat: "puja-items", lang: "hi" },
  { query: "Puja Samagri", expectedCat: "festival", expectedSubcat: "puja-items", lang: "en" },
  { query: "पूजा सामग्री", expectedCat: "festival", expectedSubcat: "puja-items", lang: "hi" },

  // Packaging cluster
  { query: "Packaging", expectedCat: "packaging", lang: "en" },
  { query: "पैकेजिंग", expectedCat: "packaging", lang: "hi" },

  // Paper products cluster
  { query: "Paper Products", expectedCat: "packaging", expectedSubcat: "paper-products", lang: "en" },
  { query: "पेपर उत्पाद", expectedCat: "packaging", expectedSubcat: "paper-products", lang: "hi" },
];

console.log("==================================================");
console.log("BHAYA INDIA — SEARCH SYSTEM COMPREHENSIVE TEST");
console.log("==================================================\n");

let passedCount = 0;
let totalTests = TEST_QUERIES.length;

for (const t of TEST_QUERIES) {
  const analysis = analyzeSearchIntent(t.query);
  const matchedCatSlug = analysis.matchedCategory?.slug;
  const matchedSubcatSlugs = analysis.matchedSubcategories.map((s) => s.slug);

  const catMatch = matchedCatSlug === t.expectedCat;
  const subcatMatch = !t.expectedSubcat || matchedSubcatSlugs.includes(t.expectedSubcat);

  const status = catMatch && subcatMatch ? "✅ PASS" : "❌ FAIL";
  if (catMatch && subcatMatch) passedCount++;

  console.log(`${status} Query: "${t.query}"`);
  console.log(`   Detected Lang   : ${analysis.detectedLanguage}`);
  console.log(`   Category Match  : ${analysis.matchedCategory ? `${analysis.matchedCategory.name_en} / ${analysis.matchedCategory.name_hi} (${matchedCatSlug})` : "NONE"}`);
  console.log(`   Subcats Matched : ${analysis.matchedSubcategories.slice(0, 4).map((s) => `${s.name_en} (${s.slug})`).join(", ")}`);
  console.log(`   Related Terms   : ${analysis.relatedSearches.slice(0, 4).join(", ")}`);
  console.log("--------------------------------------------------");
}

console.log("\n==================================================");
console.log("SUGGESTIONS & AUTOCOMPLETE TEST");
console.log("==================================================");

const suggestionTests = ["Karwa", "करवा", "Fest", "त्योहार", "Puja", "पूजा", "Pack"];
for (const term of suggestionTests) {
  const suggestions = generateSearchSuggestions(term, [], "en");
  console.log(`Suggestions for "${term}":`);
  suggestions.slice(0, 5).forEach((s) => {
    console.log(`   • [${s.type}] ${s.title} (${s.categoryTag || "General"}) -> ${s.url}`);
  });
  console.log("");
}

console.log("==================================================");
console.log(`FINAL RESULT: ${passedCount} / ${totalTests} TEST CASES PASSED (${Math.round((passedCount / totalTests) * 100)}%)`);
console.log("==================================================");

if (passedCount !== totalTests) {
  process.exit(1);
}
