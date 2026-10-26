const fs = require('fs');

const en = JSON.parse(fs.readFileSync('shopify-theme/locales/en.default.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('shopify-theme/locales/hi.json', 'utf8'));

if (!en.sections) en.sections = {};
if (!en.sections.categories) en.sections.categories = {};
en.sections.categories.view_complete_catalogue = "View Complete Catalogue";

if (!hi.sections) hi.sections = {};
if (!hi.sections.categories) hi.sections.categories = {};
hi.sections.categories.view_complete_catalogue = "संपूर्ण कैटलॉग देखें";

fs.writeFileSync('shopify-theme/locales/en.default.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('shopify-theme/locales/hi.json', JSON.stringify(hi, null, 2), 'utf8');
console.log('Added view_complete_catalogue to both locales!');
