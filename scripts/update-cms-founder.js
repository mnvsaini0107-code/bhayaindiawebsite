const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!db.content) db.content = {};

db.content.founder = {
  heading: "संस्थापक के बारे में",
  name: "राम जी भाया",
  title: "Founder & Visionary — Bhaya India",
  tagline: "“जहाँ भाया, वहाँ भरोसा।”",
  intro: "राम जी भाया, बलरामपुर, उत्तर प्रदेश से जुड़े एक उद्यमी हैं। उन्होंने मेहनत, विश्वास, गुणवत्ता और जिम्मेदार व्यापार को अपनी सोच का आधार बनाया है। उनका vision Bhaya India को Festival, Retail, Agro, Manufacturing, Logistics और Exports जैसे क्षेत्रों में विकसित करना है।",
  portraitUrl: "/ram-ji-bhaya-founder.jpg",
  closingMotto: "छोटी शुरुआत • बड़ी सोच • मजबूत विश्वास • लंबा सफर"
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("Successfully updated db.json with content.founder!");
