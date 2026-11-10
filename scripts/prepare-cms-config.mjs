import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

// Derive the published selector from current categories without rewriting source configuration.
const config = JSON.parse(await readFile('public/admin/config.json', 'utf8'));
const categories = JSON.parse(await readFile('src/data/product-categories.json', 'utf8'));
assert.ok(Array.isArray(categories) && categories.length > 0);
assert.equal(new Set(categories.map(category => category.slug)).size, categories.length);
for (const category of categories) assert.ok(category.slug && category.name);
const field = config.collections.find(collection => collection.name === 'catalogue')?.fields.find(field => field.name === 'category');
assert.ok(field?.widget === 'select', 'Missing product category selector');
field.options = categories.map(category => ({ label: category.name, value: category.slug }));
await writeFile('dist/admin/config.json', JSON.stringify(config, null, 2) + '\n');
console.log('CMS: published ' + categories.length + ' product category options.');
