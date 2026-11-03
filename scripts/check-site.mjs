import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Validate generated output, including dynamic content links and local image references.
const root = path.resolve('dist');
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }));
  return files.flat();
}
async function exists(file) {
  return stat(file).then(value => value.isFile()).catch(() => false);
}
const files = (await walk(root)).filter(file => file.endsWith('.html'));
assert.ok(files.length > 0, 'Build must produce HTML pages');
for (const [collection, route] of [['blog', 'blog'], ['projects', 'du-an']]) {
  const entries = (await walk(path.resolve('src/content', collection))).filter(file => file.endsWith('.md'));
  assert.ok(entries.length > 0, `${collection} must contain entries`);
  for (const entry of entries) {
    const id = path.basename(entry, '.md').toLowerCase();
    assert.ok(await exists(path.join(root, route, id, 'index.html')), `Missing content page: ${route}/${id}`);
  }
}
const home = await readFile(path.join(root, 'index.html'), 'utf8');
const projectIndex = await readFile(path.join(root, 'du-an/index.html'), 'utf8');
const projectFiles = (await walk(path.resolve('src/content/projects'))).filter(file => file.endsWith('.md'));
const indexProjects = projectIndex.match(/class="project-card\b/g) ?? [];
assert.equal(indexProjects.length, projectFiles.length, 'Project index must display every project');
assert.ok(home.includes('href="/du-an"'), 'Home must link to the full project index');
// The latest requested homepage reproduces the supplied public WordPress content,
// which replaces the previous three-project homepage section.
const sourceAudit = JSON.parse(await readFile('src/content/homepage/source-audit.json', 'utf8'));
const sourceMain = home.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
const decodeText = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#039;/g, "'").replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_,code) => String.fromCodePoint(Number(code))).replace(/&#x([0-9a-f]+);/gi, (_,code) => String.fromCodePoint(parseInt(code,16)));
const normalizeText = value => value.replace(/\s+/g, ' ').trim();
const actualHomeText = normalizeText(decodeText(sourceMain.replace(/<[^>]*>/g, ' ')));
assert.equal(actualHomeText, normalizeText(sourceAudit.mainText), 'Homepage must preserve approved content, including requested service and CTA revisions');
for (const id of sourceAudit.sections) assert.ok(home.includes(`id="${id}"`), `Missing source homepage section: ${id}`);
assert.ok(!home.includes('id="wpadminbar"'), 'WordPress administration must not be published');
assert.ok(!home.includes('google_gtagjs-js'), 'Saved administration/tracking scripts must not be imported');


const regionSlugs = ['tp-hcm', 'vung-tau', 'dong-nai', 'nha-trang', 'quy-nhon', 'binh-duong', 'da-nang', 'ha-noi'];
const regionIndex = await readFile(path.join(root, 'khu-vuc/index.html'), 'utf8');
const regionDescriptions = new Set();
for (const slug of regionSlugs) {
  const file = path.join(root, 'khu-vuc', slug, 'index.html');
  assert.ok(await exists(file), `Missing regional page: ${slug}`);
  assert.ok(regionIndex.includes(`href="/khu-vuc/${slug}"`), `Region index must link to ${slug}`);
  const html = await readFile(file, 'utf8');
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(description, `${slug} must have a description`);
  regionDescriptions.add(description);
  assert.ok(html.includes('href="/khu-vuc"'), `${slug} must link back to the regional index`);
}
assert.equal(regionDescriptions.size, regionSlugs.length, 'Regional descriptions must be distinct');

const catalogueProducts = JSON.parse(await readFile('src/data/products.json', 'utf8'));
const catalogueCategories = JSON.parse(await readFile('src/data/product-categories.json', 'utf8'));
assert.equal(new Set(catalogueProducts.map(product => product.slug)).size, catalogueProducts.length, 'Product slugs must be unique');
const catalogueIndex = await readFile(path.join(root, 'san-pham/index.html'), 'utf8');
const legacyRedirects = await readFile('public/_redirects', 'utf8');
for (const category of catalogueCategories) {
  const categoryPage = path.join(root, 'danh-muc-san-pham', category.slug, 'index.html');
  assert.ok(await exists(categoryPage), `Missing product category: ${category.slug}`);
  const html = await readFile(categoryPage, 'utf8');
  const expected = catalogueProducts.filter(product => product.category === category.slug).length;
  if (category.slug !== 'decal-mo-dan-kinh') assert.equal((html.match(/class="catalogue-card\b/g) ?? []).length, expected, `Legacy category count mismatch: ${category.slug}`);
}
// New navigation groups may overlap by application while preserving original product URLs.
const landingSamples = [
  ['decal-mo-dan-kinh', 'decal-mo-in-logo-thuong-hieu'],
  ['phim-cach-nhiet-nha-kinh', 'phim-cach-nhiet-rs20'],
  ['film-dan-noi-that', 'film-dan-noi-that-van-go'],
  ['decal-dan-kinh-van-phong', 'decal-mo-cat-logo-thuong-hieu'],
  ['film-bao-ve-noi-that', 'phim-ppf-tph'],
  ['film-trang-tri-kinh', 'decal-mo-3d-van-song'],
  ['decal-quang-cao', 'decal-trong-dan-kinh-quang-cao'],
];
for (const [slug, sample] of landingSamples) {
  const html = await readFile(path.join(root, 'danh-muc-san-pham', slug, 'index.html'), 'utf8');
  assert.ok(catalogueIndex.includes(`href="/danh-muc-san-pham/${slug}"`), `Product index must link to landing ${slug}`);
  assert.ok(html.includes(`data-product-id="${sample}"`), `Landing ${slug} must show relevant sample ${sample}`);
  assert.ok(html.includes('id="mau-san-pham"'), `Landing ${slug} must contain a product catalogue`);
  if (slug === 'film-bao-ve-noi-that') assert.ok(!html.includes('data-product-id="phim-bao-ve-kinh-safety-4ml"'), 'Glass safety film must not be classified as interior protection');
}
const serviceIndex = await readFile(path.join(root, 'dich-vu/index.html'), 'utf8');
for (const slug of ['thiet-ke','in-decal','cat-decal','thi-cong-decal','dich-vu-tron-goi']) {
  assert.ok(await exists(path.join(root, 'dich-vu', slug, 'index.html')), `Missing service offering ${slug}`);
  assert.ok(serviceIndex.includes(`href="/dich-vu/${slug}"`), `Service index must link to ${slug}`);
}
for (const product of catalogueProducts) {
  assert.ok(catalogueCategories.some(category => category.slug === product.category), `Unknown category for ${product.slug}`);
  const productPage = path.join(root, 'san-pham', product.slug, 'index.html');
  assert.ok(await exists(productPage), `Missing product page: ${product.slug}`);
  const html = await readFile(productPage, 'utf8');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}');
  assert.equal(schema['@type'], 'Product', `Missing Product structured data: ${product.slug}`);
  assert.equal(schema.name, product.name, `Product schema mismatch: ${product.slug}`);
  assert.ok(legacyRedirects.includes(`/${product.slug} /san-pham/${product.slug}/ 301`), `Missing legacy redirect: ${product.slug}`);
}
assert.equal((catalogueIndex.match(/class="catalogue-card\b/g) ?? []).length, catalogueProducts.length, 'Catalogue must include every product');

let references = 0;
const failures = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = '/' + path.relative(root, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  const check = (condition, message) => { if (!condition) failures.push(`${route}: ${message}`); };
  check(/<title>[^<]+<\/title>/.test(html), 'missing title');
  check((html.match(/<h1\b/g) ?? []).length === 1, 'expected exactly one h1');
  check((html.match(/<main\b/g) ?? []).length === 1, 'expected exactly one main landmark');
  check(/rel="canonical" href="https:\/\/idecal\.vn\//.test(html), 'invalid canonical URL');
  for (const match of html.matchAll(/<(?:a|img|script|link|button)\b[^>]*>/g)) {
    const tag = match[0];
    if (tag.startsWith('<img')) check(/\balt="[^"]+"/.test(tag), 'image missing alt text');
    for (const attribute of tag.matchAll(/\b(?:href|src|data-src)="([^"]*)"/g)) {
      const value = attribute[1].replaceAll('&amp;', '&');
      check(!value.includes('undefined'), `undefined reference: ${value}`);
      if (!value || /^(?:https?:|tel:|mailto:|data:)/.test(value)) continue;
      check(value !== '#', 'placeholder anchor');
      const url = new URL(value, `https://idecal.vn${route}`);
      const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = path.join(root, pathname);
      const resolved = await exists(target) ? target : path.join(target, 'index.html');
      check(await exists(resolved), `missing local reference: ${value}`);
      if (url.hash && resolved.endsWith('.html') && await exists(resolved)) {
        const destination = await readFile(resolved, 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        check(destination.includes(`id="${id}"`), `missing anchor: ${value}`);
      }
      references++;
    }
  }
}
assert.deepEqual(failures, [], failures.join('\n'));
console.log(`Passed: ${files.length} pages, ${references} local references; titles, headings, metadata, images and anchors verified.`);
