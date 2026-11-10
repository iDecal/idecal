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
  globalThis.fetch = async (url, init = {}) => {
    if (url === 'https://github.com/login/oauth/access_token') {
      exchangeCount++;
      assert.ok(init.body.get('code_verifier'));
      assert.equal(init.body.get('client_secret'), env.GITHUB_CLIENT_SECRET);
      return reply({ access_token: 'fake-oauth-token' });
    }
    assert.equal(init.headers.Authorization, 'Bearer fake-oauth-token');
    if (url === 'https://api.github.com/user') return reply({ login: 'editor', name: 'Test Editor' });
    if (url === 'https://api.github.com/repos/iDecal/idecal') return reply({ permissions: { push: allowed } });
    if (url === 'https://api.github.com' + file && init.method === 'PUT') { writeCount++; return reply({ commit: { sha: 'saved' }, token: 'must-not-leak' }); }
    if (url === 'https://api.github.com' + file + '?ref=main') return reply({ sha: 'file-sha', encoding: 'base64', content: 'W10=', token: 'must-not-leak' });
    throw new Error('Unexpected outbound destination');
  };
  try {
    assert.deepEqual(await (await run('session', {}, {})).json(), { authenticated: false, configured: false });
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
