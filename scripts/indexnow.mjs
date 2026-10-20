// Pings IndexNow (Bing, Yandex, Naver, Seznam; not Google) with every URL in the
// live sitemap, or just the URLs given as arguments. Run after a deploy:
//   npm run indexnow                    # all sitemap URLs
//   npm run indexnow -- /car-towing-perth /tilt-tray-perth
// The key file public/<KEY>.txt must be live on the site first.
const SITE = 'https://www.towingperth.com';
const KEY = '76af43bc36c450f2283960cef63da958';

let urls = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : SITE + p));
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap-0.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (!res.ok && res.status !== 202) process.exit(1);
