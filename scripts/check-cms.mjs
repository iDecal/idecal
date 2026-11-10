import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';

const config = JSON.parse(await readFile('public/admin/config.json', 'utf8'));
assert.deepEqual(config.backend, { name: 'github', repo: 'iDecal/idecal', branch: 'main', auth_methods: ['token'] });
assert.equal(config.output.omit_empty_optional_fields, true);
assert.equal(config.output.yaml.quote, 'double');
assert.equal(config.media_folder, 'public/images/uploads');
assert.equal(config.public_folder, '/images/uploads');
assert.equal(new Set(config.collections.map(collection => collection.name)).size, config.collections.length);
const catalogue = config.collections.find(collection => collection.name === 'catalogue');
assert.equal(catalogue.file, 'src/data/products.json', 'Products must be individual CMS entries');
assert.equal(catalogue.files, undefined, 'Do not wrap the product list in one editor');
assert.equal(catalogue.preview_path, 'san-pham/{{fields.slug}}/');
assert.ok(catalogue.fields.find(field => field.name === 'installationImages').fields.some(field => field.name === 'src'));


// Ensure required fields fit the existing content, especially root JSON arrays and merged areas.
let records = 0;
function checkFields(fields, data, location) {
  for (const field of fields) {
    const value = field.root ? data : data[field.name];
    const at = `${location}.${field.name}`;
    if (value === undefined || value === null) {
      assert.equal(field.required, false, `Required CMS field missing: ${at}`);
      continue;
    }
    if (field.widget === 'list') {
      assert.ok(Array.isArray(value), `Expected array: ${at}`);
      for (const [index, item] of value.entries()) {
        if (field.fields) checkFields(field.fields, item, `${at}[${index}]`);
      }
    } else if (field.widget === 'object') {
      assert.equal(typeof value, 'object', `Expected object: ${at}`);
      checkFields(field.fields, value, at);
    } else if (field.widget === 'select') {
      assert.ok(field.options.some(option => (typeof option === 'string' ? option : option.value) === value), `Invalid select value: ${at}`);
    }
  }
  records++;
}
for (const collection of config.collections) {
  if (collection.folder) {
    assert.equal(collection.delete, false, 'Existing content must not be deleted accidentally');
    for (const name of await readdir(collection.folder)) {
      if (!name.endsWith('.md')) continue;
      const source = await readFile(`${collection.folder}/${name}`, 'utf8');
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      assert.ok(match, `Missing front matter: ${name}`);
      checkFields(collection.fields, { ...parse(match[1]), body: match[2] }, name);
    }
  } else if (collection.file) {
    const entries = JSON.parse(await readFile(collection.file, 'utf8'));
    assert.ok(Array.isArray(entries) && entries.length > 0);
    assert.ok(['name', 'title'].includes(collection.identifier_field));
    assert.equal(collection.delete, false);
    const identity = collection.name === 'catalogue' ? 'slug' : 'src';
    assert.equal(collection.fields.find(field => field.name === identity).readonly, true);
    assert.equal(new Set(entries.map(entry => entry[identity])).size, entries.length);
    for (const entry of entries) checkFields(collection.fields, entry, entry.slug);
  } else {
    for (const file of collection.files) {
      const data = JSON.parse(await readFile(file.file, 'utf8'));
      checkFields(file.fields, data, file.file);
      if (Array.isArray(data)) {
        assert.equal(file.fields.length, 1, 'Root arrays require one field');
        const list = file.fields[0];
        assert.equal(list.root, true);
        assert.equal(list.allow_remove, false);
        assert.equal(list.fields.find(field => field.name === 'slug').readonly, true);
      }
    }
  }
}
const login = await readFile('dist/admin/index.html', 'utf8');
assert.match(login, /Đăng nhập bằng GitHub/);
assert.doesNotMatch(login, /sveltia-cms\.js/);
assert.match(login, /noindex, nofollow/);
const admin = await readFile('dist/admin/cms.html', 'utf8');
assert.match(admin, /name="robots" content="noindex, nofollow"/);
assert.match(admin, /@sveltia\/cms@0\.261\.0\/dist\/sveltia-cms\.js/);
assert.match(admin, /integrity="sha384-[A-Za-z0-9+/=]+"/);
assert.match(admin, /href="\/admin\/config.json" type="application\/json" rel="cms-config-url"/);
const guide = await readFile('dist/quan-ly-noi-dung/index.html', 'utf8');
assert.match(guide, /name="robots" content="noindex/);
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.doesNotMatch(sitemap, /<loc>[^<]*(?:\/admin\/|\/quan-ly-noi-dung)/);
const contexts = JSON.parse(await readFile('src/data/region-context.json', 'utf8'));
assert.equal(Object.keys(contexts).length, 8);
for (const [slug, paragraph] of Object.entries(contexts)) {
  const html = await readFile(`dist/khu-vuc/${slug}/index.html`, 'utf8');
  assert.ok(html.includes(paragraph), `CMS context is not rendered: ${slug}`);
}
console.log(`CMS passed: ${config.collections.length} collections, ${records} content records, root JSON arrays, metadata, admin noindex and all 8 city contexts.`);
