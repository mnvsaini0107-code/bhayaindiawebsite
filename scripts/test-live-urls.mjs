const urls = ['/', '/collections', '/collections/all', '/search', '/cart', '/pages/wholesale', '/404'];

async function test() {
  for (const u of urls) {
    try {
      const r = await fetch('https://a3g0h2-ss.myshopify.com' + u);
      const text = await r.text();
      const timing = r.headers.get('server-timing') || '';
      const pageTypeMatch = timing.match(/pageType;desc="([^"]+)"/);
      const pageType = pageTypeMatch ? pageTypeMatch[1] : 'unknown';
      const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : 'no title';
      console.log(`${u.padEnd(20)} -> Status: ${r.status} | pageType: ${pageType.padEnd(10)} | Title: ${title}`);
    } catch (e) {
      console.error(u, e.message);
    }
  }
}

test();
