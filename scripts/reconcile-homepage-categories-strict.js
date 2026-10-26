const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Reconcile Categories
db.categories = db.categories.map((c) => {
  if (c.slug === 'household-products' || c.id === 'cat-household') {
    return { ...c, image: '/assets/products/natural-bamboo-soop.jpg' };
  }
  if (c.slug === 'textiles-fabrics' || c.id === 'cat-1') {
    return { ...c, image: '/assets/placeholder-textiles.svg' };
  }
  if (c.slug === 'stationery-office' || c.id === 'cat-2') {
    return { ...c, image: '/assets/placeholder-stationery.svg' };
  }
  if (c.slug === 'gift-hampers' || c.id === 'cat-3') {
    return { ...c, image: '/assets/placeholder-gift-hampers.svg' };
  }
  if (c.slug === 'home-living' || c.id === 'cat-4') {
    return { ...c, image: '/assets/products/auspicious-moti-kalash.jpg' };
  }
  if (c.slug === 'other-categories' || c.id === 'cat-other') {
    return { ...c, image: '/assets/bhaya-india-logo.png' };
  }
  if (c.slug === 'wholesale-bulk' || c.id === 'cat-5') {
    return { ...c, image: '/assets/products/shubh-vivah-soop-okhali-set.jpg' };
  }
  if (c.slug === 'puja-samagri' || c.id === 'cat-puja') {
    return { ...c, image: '/assets/products/puja-kalash-and-thali-ensemble.jpg' };
  }
  if (c.slug === 'festival-decoration' || c.id === 'cat-fest-decor') {
    return { ...c, image: '/assets/products/large-flower-garland-grand-tiered-festive.jpg' };
  }
  if (c.slug === 'wedding-marriage-items' || c.id === 'cat-wedding') {
    return { ...c, image: '/assets/products/traditional-vivah-soop-collection.jpg' };
  }
  if (c.slug === 'handicraft' || c.id === 'cat-handicraft') {
    return { ...c, image: '/assets/products/handpainted-wooden-okhali.jpg' };
  }
  if (c.slug === 'gift-items' || c.id === 'cat-gifts') {
    return { ...c, image: '/assets/products/heart-rose-floral-frame.jpg' };
  }
  if (c.slug === 'home-decoration' || c.id === 'cat-home-decor') {
    return { ...c, image: '/assets/products/auspicious-moti-kalash.jpg' };
  }
  return c;
});

// 2. Reconcile Media in db if present
if (Array.isArray(db.media)) {
  db.media = db.media.map((m) => {
    if (m.filename === 'hero-editorial.jpg' || m.url === '/assets/hero-editorial.jpg') {
      return {
        ...m,
        filename: 'shubh-vivah-soop-okhali-set.jpg',
        url: '/assets/products/shubh-vivah-soop-okhali-set.jpg',
        altEn: 'Traditional Shubh Vivah Soop & Okhali Wedding Ensemble',
        altHi: 'पारंपरिक शुभ विवाह सूप एवं ओखली वैवाहिक सेट',
      };
    }
    if (m.filename === 'category-textiles.jpg' || m.url === '/assets/category-textiles.jpg') {
      return {
        ...m,
        filename: 'traditional-vivah-soop-collection.jpg',
        url: '/assets/products/traditional-vivah-soop-collection.jpg',
        altEn: 'Authentic Heritage Vivah Soop Collection from Bhaya India',
        altHi: 'भाया इंडिया प्रामाणिक विवाह सूप संग्रह',
      };
    }
    if (m.filename === 'category-stationery.jpg' || m.url === '/assets/category-stationery.jpg') {
      return {
        ...m,
        filename: 'handpainted-wooden-okhali.jpg',
        url: '/assets/products/handpainted-wooden-okhali.jpg',
        altEn: 'Handpainted Wooden Vivah Okhali & Musal',
        altHi: 'हस्तनिर्मित काष्ठ विवाह ओखली व मूसल',
      };
    }
    return m;
  });
}

// 3. Reconcile Services in db if present
if (Array.isArray(db.services)) {
  db.services = db.services.map((s) => {
    if (s.image === '/assets/category-textiles.jpg' || s.image === '/assets/hero-editorial.jpg' || s.image === '/assets/category-stationery.jpg') {
      return { ...s, image: '/assets/products/traditional-vivah-soop-collection.jpg' };
    }
    return s;
  });
}

// 4. Reconcile SEO
if (db.seoSettings) {
  if (db.seoSettings.defaultOgImage === '/assets/hero-editorial.jpg') {
    db.seoSettings.defaultOgImage = '/assets/bhaya-india-logo.png';
  }
  if (db.seoSettings.defaultTwitterImage === '/assets/hero-editorial.jpg') {
    db.seoSettings.defaultTwitterImage = '/assets/bhaya-india-logo.png';
  }
}

if (db.seoPages) {
  Object.keys(db.seoPages).forEach((k) => {
    if (db.seoPages[k].ogImage === '/assets/hero-editorial.jpg' || db.seoPages[k].ogImage === '/assets/category-textiles.jpg') {
      db.seoPages[k].ogImage = '/assets/bhaya-india-logo.png';
    }
    if (db.seoPages[k].twitterImage === '/assets/hero-editorial.jpg' || db.seoPages[k].twitterImage === '/assets/category-textiles.jpg') {
      db.seoPages[k].twitterImage = '/assets/bhaya-india-logo.png';
    }
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Strict Category Reconcile in db.json completed!');
