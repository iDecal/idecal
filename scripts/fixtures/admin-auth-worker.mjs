// Local-only runtime fixture: fake GitHub responses, never a production entry point.
import { onRequest } from '../../functions/api/admin/[[path]].js';
const env = {
  GITHUB_CLIENT_ID: 'runtime-test-client',
  GITHUB_CLIENT_SECRET: 'runtime-test-secret',
  ADMIN_SESSION_SECRET: 'runtime-test-only-key-at-least-32-characters',
};
globalThis.fetch = async (input, init) => {
  // Construct the request in workerd before mocking the network to catch unsupported options.
  const request = new Request(input, init);
  if (request.redirect !== 'manual') throw new Error('Requests must not follow redirects');
  const url = new URL(request.url);
  if (url.origin === 'https://github.com' && url.pathname === '/login/oauth/access_token') {
    return Response.json({ access_token: 'runtime-fake-token' });
  }
  if (url.origin !== 'https://api.github.com' || request.headers.get('Authorization') !== 'Bearer runtime-fake-token') throw new Error('Unexpected test destination or credential');
  if (url.pathname === '/user') return Response.json({ login: 'runtime-editor', name: 'Runtime Editor' });
  if (url.pathname === '/repos/iDecal/idecal') return Response.json({ permissions: { push: true } });
  if (url.pathname === '/repos/iDecal/idecal/contents/src/data/products.json') {
    if (request.method === 'PUT') return Response.json({ commit: { sha: 'runtime-saved' } });
    return Response.json({ sha: 'runtime-file', encoding: 'base64', content: 'W10=' });
  }
  throw new Error('Unexpected test request');
};
export default { fetch(request) { return onRequest({ request, env }); } };
