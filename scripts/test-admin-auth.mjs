import assert from 'node:assert/strict';
import { test } from 'node:test';
import { onRequest } from '../functions/api/admin/[[path]].js';
const env = { GITHUB_CLIENT_ID: 'test-client', GITHUB_CLIENT_SECRET: 'test-secret', ADMIN_SESSION_SECRET: 'test-only-secret-at-least-32-characters-long' };
const origin = 'https://idecal.pages.dev';
const file = '/repos/iDecal/idecal/contents/src/data/products.json';
const run = (path, init = {}, settings = env) => onRequest({ request: new Request(origin + '/api/admin/' + path, init), env: settings });
const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
test('OAuth session, permissions, CSRF, proxy restrictions and logout', async () => {
  const realFetch = globalThis.fetch;
  let allowed = true;
  let exchangeCount = 0;
  let writeCount = 0;
  let categoryRecords = [{slug:'original',name:'Original',service:'decal-dan-kinh-van-phong',image:'/images/test.jpg'}];
  globalThis.fetch = async (url, init = {}) => {
    assert.equal(init.redirect, 'manual', 'Cloudflare does not support redirect:error');
    if (url === 'https://github.com/login/oauth/access_token') {
      exchangeCount++;
      assert.ok(init.body.get('code_verifier'));
      assert.equal(init.body.get('client_secret'), env.GITHUB_CLIENT_SECRET);
      return reply({ access_token: 'fake-oauth-token' });
    }
    if (url.startsWith('https://api.github.com/repos/iDecal/idecal/contents/public/images/uploads/')) {
      assert.equal(init.method, 'PUT');
      assert.match(url, /\/[a-z0-9-]+\.png$/);
      assert.equal(JSON.parse(init.body).branch, 'main');
      return reply({ content: { sha: 'uploaded' } }, 201);
    }
    assert.equal(init.headers.Authorization, 'Bearer fake-oauth-token');
    if (url.startsWith('https://api.github.com/repos/iDecal/idecal/contents/src/data/product-categories.json')) {
      if (init.method === 'PUT') {
        const payload=JSON.parse(init.body);
        assert.equal(payload.sha,'category-sha');
        categoryRecords=JSON.parse(Buffer.from(payload.content,'base64').toString('utf8'));
        return reply({commit:{sha:'category-saved'}});
      }
      return reply({sha:'category-sha',content:Buffer.from(JSON.stringify(categoryRecords)).toString('base64')});
    }
    if (url === 'https://api.github.com/user') return reply({ login: 'editor', name: 'Test Editor' });
    if (url === 'https://api.github.com/repos/iDecal/idecal') return reply({ permissions: { push: allowed } });
    if (url === 'https://api.github.com' + file && init.method === 'PUT') { writeCount++; return reply({ commit: { sha: 'saved' }, token: 'must-not-leak' }); }
    if (url === 'https://api.github.com' + file + '?ref=main') return reply({ sha: 'file-sha', encoding: 'base64', content: 'W10=', token: 'must-not-leak' });
    throw new Error('Unexpected outbound destination');
  };
  try {
    const missing = await (await run('session', {}, {})).json();
    assert.equal(missing.configured, false);
    assert.deepEqual(missing.issues, ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'ADMIN_SESSION_SECRET'].map(name => ({ name, reason: 'missing' })));
    const short = await (await run('session', {}, { ...env, ADMIN_SESSION_SECRET: 'short-test-key' })).json();
    assert.deepEqual(short.issues, [{ name: 'ADMIN_SESSION_SECRET', reason: 'too_short' }]);
    assert.ok(!JSON.stringify(short).includes('short-test-key'));
    assert.ok(!JSON.stringify(short).includes(env.GITHUB_CLIENT_SECRET));
    assert.equal((await run('github?path=' + encodeURIComponent(file + '?ref=main'))).status, 401);
    const auth = await run('auth');
    const target = new URL(auth.headers.get('Location'));
    assert.equal(target.origin, 'https://github.com');
    assert.equal(target.searchParams.get('redirect_uri'), origin + '/api/admin/callback');
    assert.equal(target.searchParams.get('code_challenge_method'), 'S256');
    const stateCookie = auth.headers.getSetCookie()[0].split(';')[0];
    assert.match(auth.headers.getSetCookie()[0], /HttpOnly; Secure; SameSite=Lax/);
    assert.equal((await run('callback?code=fake&state=bad', { headers: { Cookie: stateCookie } })).headers.get('Location'), '/admin/?error=authentication');
    assert.equal(exchangeCount, 0);
    const callbackPath = 'callback?code=fake&state=' + target.searchParams.get('state');
    const normalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new TypeError('private upstream details must not appear'); };
    const unavailable = await run(callbackPath, { headers: { Cookie: stateCookie } });
    assert.equal(unavailable.status, 302);
    assert.equal(unavailable.headers.get('Location'), '/admin/?error=service&stage=oauth_exchange&failure=network');
    assert.ok(!unavailable.headers.get('Location').includes('private'));
    globalThis.fetch = async (url, init) => url === 'https://github.com/login/oauth/access_token' ? reply({ error: 'incorrect_client_credentials' }) : normalFetch(url, init);
    const badCredentials = await run(callbackPath, { headers: { Cookie: stateCookie } });
    assert.equal(badCredentials.headers.get('Location'), '/admin/?error=oauth_credentials');
    globalThis.fetch = async (url, init) => url === 'https://github.com/login/oauth/access_token' ? new Response('<html>not JSON</html>') : normalFetch(url, init);
    const invalidResponse = await run(callbackPath, { headers: { Cookie: stateCookie } });
    assert.equal(invalidResponse.headers.get('Location'), '/admin/?error=service&stage=oauth_exchange&failure=response');
    globalThis.fetch = normalFetch;
    const callback = await run(callbackPath, { headers: { Cookie: stateCookie } });
    assert.equal(callback.headers.get('Location'), '/admin/');
    const cookies = callback.headers.getSetCookie();
    const session = cookies.find(value => value.startsWith('__Host-idecal-admin=')).split(';')[0];
    assert.ok(!session.includes('fake-oauth-token'));
    assert.ok(!cookies.join('').includes(env.GITHUB_CLIENT_SECRET));
    const headers = { Cookie: session, Origin: origin };
    const status = await (await run('session', { headers })).json();
    assert.equal(status.authenticated, true);
    assert.equal(status.user.login, 'editor');
    assert.ok(!JSON.stringify(status).includes('token'));
    const tampered = await (await run('session', { headers: { Cookie: session + 'tampered' } })).json();
    assert.equal(tampered.authenticated, false);
    const csrf = await run('github?path=' + encodeURIComponent(file), { method: 'PUT', headers: { Cookie: session, Origin: 'https://attacker.example' }, body: '{}' });
    assert.equal(csrf.status, 403);
    assert.equal((await run('github?path=' + encodeURIComponent('/repos/another/repo'), { headers })).status, 403);
    assert.equal((await run('github?path=' + encodeURIComponent(file) , { method: 'DELETE', headers })).status, 403);
    const categories = await (await run('categories', { headers })).json();
    assert.equal(categories.categories.length,1);
    const newCategory = {name:'Danh mục mới',slug:'danh-muc-moi',sourceCategory:'original'};
    const created = await run('categories', {method:'POST',headers,body:JSON.stringify(newCategory)});
    assert.equal(created.status,201);
    assert.equal((await created.json()).category.slug,'danh-muc-moi');
    assert.equal(categoryRecords.length,2);
    assert.equal(categoryRecords[0].slug,'original');
    assert.equal(categoryRecords[1].editorCreated,true);
    assert.equal((await run('categories',{method:'POST',headers,body:JSON.stringify(newCategory)})).status,200);
    assert.equal(categoryRecords.length,2);
    assert.equal((await run('categories',{method:'POST',headers,body:JSON.stringify({...newCategory,name:'Other',slug:'../unsafe'})})).status,400);
    assert.equal((await run('categories',{method:'POST',headers,body:JSON.stringify({...newCategory,name:'Other',slug:'danh-muc-moi'})})).status,409);
    const upload = await run('upload', { method: 'POST', headers, body: JSON.stringify({ name: '../../ảnh test.svg', content: btoa(String.fromCharCode(137,80,78,71,13,10,26,10)) }) });
    assert.equal(upload.status, 201);
    const uploaded = await upload.json();
    assert.match(uploaded.url, /^\/images\/uploads\/[a-z0-9-]+\.png$/);
    const unsafeImage = await run('upload', { method: 'POST', headers, body: JSON.stringify({ name: 'script.svg', content: btoa('<svg onload="alert(1)"></svg>') }) });
    assert.equal(unsafeImage.status, 400);
    const anonymousUpload = await run('upload', { method: 'POST', headers: { Origin: origin }, body: '{}' });
    assert.equal(anonymousUpload.status, 401);
    const read = await (await run('github?path=' + encodeURIComponent(file + '?ref=main'), { headers })).json();
    assert.deepEqual(Object.keys(read).sort(), ['content', 'encoding', 'sha']);
    const payload = { branch: 'main', sha: 'file-sha', content: 'W10=', message: 'Test save' };
    const saved = await (await run('github?path=' + encodeURIComponent(file), { method: 'PUT', headers, body: JSON.stringify(payload) })).json();
    assert.deepEqual(saved, { commit: { sha: 'saved' } });
    assert.equal(writeCount, 1);
    allowed = false;
    assert.equal((await run('github?path=' + encodeURIComponent(file), { method: 'PUT', headers, body: JSON.stringify(payload) })).status, 403);
    assert.equal(writeCount, 1);
    assert.equal((await run(callbackPath, { headers: { Cookie: stateCookie } })).headers.get('Location'), '/admin/?error=permission');
    const loggedOut = await run('logout', { method: 'POST', headers });
    assert.equal(loggedOut.status, 204);
    assert.match(loggedOut.headers.get('Set-Cookie'), /Max-Age=0/);
  } finally { globalThis.fetch = realFetch; }
});
