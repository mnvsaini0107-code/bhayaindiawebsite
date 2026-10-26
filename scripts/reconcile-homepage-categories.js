const fs = require('fs');

const dbPath = 'data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Approved mapping of categories to authentic user-supplied product assets
const approvedCategoryImages = {
  "puja-samagri": "/assets/products/puja-kalash-and-thali-ensemble.jpg",
  "festival-decoration": "/assets/products/large-flower-garland-grand-tiered-festive.jpg",
  "wedding-marriage-items": "/assets/products/traditional-vivah-soop-collection.jpg",
  "handicraft": "/assets/products/handpainted-wooden-okhali.jpg",
  "home-decoration": "/assets/products/auspicious-moti-kalash.jpg",
  "gift-items": "/assets/products/heart-rose-floral-frame.jpg",
  "household-products": "/assets/products/natural-bamboo-soop.jpg",
  "puja-mala": "/assets/products/puja-mala-rose-yellow-pink.jpg",
  "bhagwan-jaymala": "/assets/products/bhagwan-jaymala-marigold-maroon.jpg",
  "large-flower-garlands": "/assets/products/large-flower-garland-grand-multicolour.jpg",
  "moti-mala": "/assets/products/moti-mala-emerald-green-crystal-pearl.jpg",
  "sherwani-mala": "/assets/products/sherwani-mala-peacock-brooch-detail.jpg",
  "groom-garland": "/assets/products/dulha-haar-kundan-floral-brooch.jpg",
  "wholesale-bulk": "/assets/products/shubh-vivah-soop-okhali-set.jpg",
  "other-categories": "/assets/bhaya-india-logo.png" // Category-neutral brand insignia
};

let updatedCount = 0;
db.categories = db.categories.map(cat => {
  if (approvedCategoryImages[cat.slug]) {
    const oldImg = cat.image;
    cat.image = approvedCategoryImages[cat.slug];
    if (oldImg !== cat.image) {
      console.log(`Updated [${cat.slug}]: ${oldImg} -> ${cat.image}`);
      updatedCount++;
    }
  }
  return cat;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Reconciled db.json categories. Total updated: ${updatedCount}`);
