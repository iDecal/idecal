const REPO = '/repos/iDecal/idecal';
const FILE = REPO + '/contents/src/data/products.json';
const SESSION = '__Host-idecal-admin';
const STATE = '__Host-idecal-oauth';
const ttl = 28800;
const encoder = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
const unb64 = value => Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
const configurationIssues = env => [
  ...['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'].filter(name => typeof env[name] !== 'string' || !env[name].trim()).map(name => ({ name, reason: 'missing' })),
  ...(typeof env.ADMIN_SESSION_SECRET !== 'string' || !env.ADMIN_SESSION_SECRET.trim()
    ? [{ name: 'ADMIN_SESSION_SECRET', reason: 'missing' }]
    : env.ADMIN_SESSION_SECRET.length < 32 ? [{ name: 'ADMIN_SESSION_SECRET', reason: 'too_short' }] : []),
];
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const cookie = (name, value, age) => name + '=' + value + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + age;
const readCookie = (request, name) => (request.headers.get('Cookie') ?? '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '='))?.slice(name.length + 1);
async function key(env) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(env.ADMIN_SESSION_SECRET));
  return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
async function seal(env, value, purpose) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const payload = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(purpose) }, await key(env), encoder.encode(JSON.stringify(value)));
  return b64(iv) + '.' + b64(new Uint8Array(payload));
}
async function unseal(env, value, purpose) {
  try {
    const [iv, data] = value.split('.');
    const result = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv), additionalData: encoder.encode(purpose) }, await key(env), unb64(data))));
    return Number.isFinite(result.expires) && result.expires > Date.now() ? result : null;
  } catch { return null; }
}
const redirect = (url, cookies = []) => {
  const headers = new Headers({ Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  for (const value of cookies) headers.append('Set-Cookie', value);
  return new Response(null, { status: 302, headers });
};
const clearState = () => cookie(STATE, '', 0);
const clearSession = () => cookie(SESSION, '', 0);
// Workers supports manual/follow only. Never forward credentials across redirects.
async function github(token, route, init = {}) {
  return fetch('https://api.github.com' + route, { ...init, redirect: 'manual', headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token, 'User-Agent': 'iDecal-Admin', 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) } });
}
async function profile(token) {
  const [a, b] = await Promise.all([github(token, '/user'), github(token, REPO)]);
  if (!a.ok || !b.ok) return null;
  const user = await a.json();
  const repo = await b.json();
  return repo.permissions?.push === true ? { login: user.login, name: user.name || user.login } : null;
}
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const route = url.pathname.replace(/^\/api\/admin\/?/, '').replace(/\/$/, '');
  const method = request.method;
  if (method !== 'GET' && request.headers.get('Origin') !== url.origin) return json({ error: 'origin' }, 403);
  let stage = 'configuration';
  try {
    if (route === 'logout' && method === 'POST') return new Response(null, { status: 204, headers: { 'Set-Cookie': clearSession(), 'Cache-Control': 'no-store' } });
    const issues = configurationIssues(env);
    if (issues.length) {
      if (route === 'session') return json({ authenticated: false, configured: false, issues });
      if (route === 'auth' || route === 'callback') return redirect('/admin/?error=configuration');
      return json({ error: 'configuration' }, 503);
    }
    if (route === 'auth' && method === 'GET') {
      stage = 'oauth_start';
      const state = b64(crypto.getRandomValues(new Uint8Array(32)));
      const verifier = b64(crypto.getRandomValues(new Uint8Array(32)));
      const challenge = b64(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(verifier))));
      const target = new URL('https://github.com/login/oauth/authorize');
      target.search = new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, redirect_uri: url.origin + '/api/admin/callback', scope: 'repo', state, code_challenge: challenge, code_challenge_method: 'S256' }).toString();
      return redirect(target.href, [cookie(STATE, await seal(env, { state, verifier, expires: Date.now() + 600000 }, 'oauth'), 600)]);
    }
    if (route === 'callback' && method === 'GET') {
      stage = 'oauth_state';
      const state = await unseal(env, readCookie(request, STATE) ?? '', 'oauth');
      if (!state || state.state !== url.searchParams.get('state') || !url.searchParams.get('code') || url.searchParams.has('error')) return redirect('/admin/?error=authentication', [clearState()]);
      stage = 'oauth_exchange';
      const exchange = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', redirect: 'manual', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'iDecal-Admin' }, body: new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code: url.searchParams.get('code'), redirect_uri: url.origin + '/api/admin/callback', code_verifier: state.verifier }) });
      const result = exchange.ok ? await exchange.json() : {};
      if (typeof result.access_token !== 'string') {
        const failures = { incorrect_client_credentials: 'oauth_credentials', bad_verification_code: 'oauth_code', redirect_uri_mismatch: 'oauth_callback' };
        return redirect('/admin/?error=' + (failures[result.error] || 'authentication'), [clearState()]);
      }
      stage = 'github_permissions';
      const user = await profile(result.access_token);
      if (!user) return redirect('/admin/?error=permission', [clearState()]);
      stage = 'session_create';
      const session = await seal(env, { token: result.access_token, user, expires: Date.now() + ttl * 1000 }, 'session');
      if (session.length > 3800) return redirect('/admin/?error=authentication', [clearState()]);
      return redirect('/admin/', [clearState(), cookie(SESSION, session, ttl)]);
    }
    stage = 'session_read';
    const session = await unseal(env, readCookie(request, SESSION) ?? '', 'session');
    if (route === 'session' && method === 'GET') {
      if (!session) return json({ authenticated: false, configured: true });
      stage = 'session_permissions';
      const user = await profile(session.token);
      return user ? json({ authenticated: true, configured: true, user }) : new Response(JSON.stringify({ authenticated: false, configured: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSession(), 'Cache-Control': 'no-store' } });
    }
    if (!session) return json({ error: 'authentication' }, 401);
    if (route === 'categories' && (method === 'GET' || method === 'POST')) {
      stage = 'github_permissions';
      if (!(await profile(session.token))) return json({ error: 'permission' }, 403);
      const target = REPO + '/contents/src/data/product-categories.json';
      const read = await github(session.token, target + '?ref=main');
      if (!read.ok) return json({ error: 'github' }, read.status);
      const file = await read.json();
      const categories = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g, '')), char => char.charCodeAt(0))));
      if (!Array.isArray(categories)) return json({ error: 'data' }, 502);
      if (method === 'GET') return json({ categories });
      const raw = await request.text();
      if (raw.length > 4000) return json({ error: 'size' }, 413);
      let payload;
      try { payload = JSON.parse(raw); } catch { return json({ error: 'payload' }, 400); }
      const name = typeof payload.name === 'string' ? payload.name.trim() : '';
      const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';
      if (!name || name.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) return json({ error: 'category' }, 400);
      const duplicate = categories.find(category => category.name.trim().toLocaleLowerCase('vi-VN') === name.toLocaleLowerCase('vi-VN'));
      if (duplicate) return json({ category: duplicate }, 200);
      const reserved = ['decal-mo-dan-kinh','decal-pvc','phim-cach-nhiet-nha-kinh','film-dan-noi-that','decal-dan-kinh-van-phong','film-bao-ve-noi-that','film-trang-tri-kinh','decal-quang-cao'];
      if (categories.some(category => category.slug === slug) || reserved.includes(slug)) return json({ error: 'duplicate_slug' }, 409);
      const source = categories.find(category => category.slug === payload.sourceCategory);
      if (!source) return json({ error: 'source_category' }, 400);
      const category = { slug, name, headline: name, description: 'Khám phá mẫu ' + name + ' tại iDecal. Xem hình ảnh, thông tin vật liệu và liên hệ tư vấn theo nhu cầu.', benefits: [], priceTitle: 'Báo giá ' + name, priceNote: 'Liên hệ để trao đổi mã vật liệu, quy cách và khối lượng.', prices: [], faqs: [], service: source.service, image: source.image, needs: [], editorCreated: true };
      const bytes = new TextEncoder().encode(JSON.stringify([...categories, category], null, 2) + '\n');
      let binary = '';
      for (const byte of bytes) binary += String.fromCharCode(byte);
      const save = await github(session.token, target, { method: 'PUT', body: JSON.stringify({ branch: 'main', sha: file.sha, message: 'Add product category ' + slug, content: btoa(binary) }) });
      if (!save.ok) return json({ error: 'github' }, save.status);
      return json({ category }, 201);
    }
    if (route === 'upload' && method === 'POST') {
      stage = 'github_permissions';
      if (!(await profile(session.token))) return json({ error: 'permission' }, 403);
      if (Number(request.headers.get('Content-Length') || 0) > 7100000) return json({ error: 'size' }, 413);
      const raw = await request.text();
      if (raw.length > 7100000) return json({ error: 'size' }, 413);
      let payload;
      try { payload = JSON.parse(raw); } catch { return json({ error: 'payload' }, 400); }
      if (typeof payload.content !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(payload.content)) return json({ error: 'image' }, 400);
      let bytes;
      try { bytes = Uint8Array.from(atob(payload.content), char => char.charCodeAt(0)); } catch { return json({ error: 'image' }, 400); }
      if (!bytes.length || bytes.length > 5 * 1024 * 1024) return json({ error: 'size' }, 413);
      const starts = (...magic) => magic.every((value, index) => bytes[index] === value);
      const text = (start, length) => new TextDecoder().decode(bytes.slice(start, start + length));
      const extension = starts(255, 216, 255) ? 'jpg'
        : starts(137, 80, 78, 71, 13, 10, 26, 10) ? 'png'
        : text(0, 4) === 'RIFF' && text(8, 4) === 'WEBP' ? 'webp'
        : ['GIF87a', 'GIF89a'].includes(text(0, 6)) ? 'gif'
        : text(4, 4) === 'ftyp' && ['avif', 'avis'].some(brand => text(8, 24).includes(brand)) ? 'avif' : null;
      if (!extension) return json({ error: 'image' }, 400);
      const name = typeof payload.name === 'string' ? payload.name : 'product';
      const stem = name.replace(/\.[^.]*$/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'product';
      const filename = stem + '-' + crypto.randomUUID() + '.' + extension;
      stage = 'github_request';
      const response = await github(session.token, REPO + '/contents/public/images/uploads/' + filename, { method: 'PUT', body: JSON.stringify({ branch: 'main', message: 'Upload product image', content: payload.content }) });
      if (!response.ok) return json({ error: 'github' }, response.status);
      return json({ url: '/images/uploads/' + filename }, 201);
    }
    if (route !== 'github') return json({ error: 'not_found' }, 404);
    const destination = url.searchParams.get('path');
    const getAllowed = method === 'GET' && ['/user', REPO, FILE + '?ref=main'].includes(destination);
    const putAllowed = method === 'PUT' && destination === FILE;
    if (!getAllowed && !putAllowed) return json({ error: 'forbidden' }, 403);
    stage = 'github_permissions';
    if (!(await profile(session.token))) return json({ error: 'permission' }, 403);
    let body;
    if (putAllowed) {
      if (Number(request.headers.get('Content-Length') || 0) > 2000000) return json({ error: 'size' }, 413);
      const raw = await request.text();
      if (raw.length > 2000000) return json({ error: 'size' }, 413);
      const payload = JSON.parse(raw);
      if (payload.branch !== 'main' || typeof payload.sha !== 'string' || typeof payload.content !== 'string' || typeof payload.message !== 'string') return json({ error: 'payload' }, 400);
      body = JSON.stringify({ branch: 'main', sha: payload.sha, content: payload.content, message: payload.message.slice(0, 250) });
    }
    stage = 'github_request';
    const response = await github(session.token, destination, { method, ...(body ? { body } : {}) });
    if (!response.ok) return json({ error: 'github' }, response.status);
    const data = await response.json();
    if (putAllowed) return json({ commit: { sha: data.commit?.sha } });
    if (destination === FILE + '?ref=main') return json({ sha: data.sha, encoding: data.encoding, content: data.content });
    if (destination === '/user') return json({ login: data.login });
    return json({ permissions: { push: data.permissions?.push === true } });
  } catch (error) {
    // Expose only fixed stage identifiers, never upstream bodies, codes or credentials.
    const failure = error?.name === 'SyntaxError' ? 'response' : error?.name === 'TypeError' ? 'network' : 'runtime';
    if (method === 'GET' && (route === 'auth' || route === 'callback')) {
      return redirect('/admin/?error=service&stage=' + stage + '&failure=' + failure, [clearState()]);
    }
    return json({ error: 'service_unavailable', stage, failure }, 502);
  }
}
