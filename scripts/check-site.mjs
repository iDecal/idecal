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
const homeProjects = home.match(/class="project-card\b/g) ?? [];
const indexProjects = projectIndex.match(/class="project-card\b/g) ?? [];
assert.equal(homeProjects.length, Math.min(3, projectFiles.length), 'Home must display up to three projects');
assert.equal(indexProjects.length, projectFiles.length, 'Project index must display every project');
assert.ok(home.includes('href="/du-an"'), 'Home must link to the full project index');

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
  assert.ok(catalogueIndex.includes(`href="/danh-muc-san-pham/${category.slug}"`), `Catalogue must link to ${category.slug}`);
  const html = await readFile(categoryPage, 'utf8');
  const expected = catalogueProducts.filter(product => product.category === category.slug).length;
  assert.equal((html.match(/class="catalogue-card\b/g) ?? []).length, expected, `Category count mismatch: ${category.slug}`);
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
