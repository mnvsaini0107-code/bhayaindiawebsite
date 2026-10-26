const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));

console.log("Current Categories in db.json:");
db.categories.forEach((c, i) => {
  console.log(`${i}. [${c.id}] ${c.name} (${c.slug}) -> ${c.image}`);
});
