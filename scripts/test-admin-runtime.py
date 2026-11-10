"""Run against the local-only admin-auth-worker.mjs fixture on port 8791."""
import json
import base64
import urllib.error
import urllib.parse
import urllib.request

BASE = 'http://127.0.0.1:8791'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

opener = urllib.request.build_opener(NoRedirect)
def request(path, method='GET', cookie='', body=None, origin=BASE):
    headers = {'Origin': origin}
    if cookie:
        headers['Cookie'] = cookie
    if body is not None:
        body = json.dumps(body).encode()
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(BASE + '/api/admin/' + path, method=method, headers=headers, data=body)
    try:
        return opener.open(req, timeout=10)
    except urllib.error.HTTPError as error:
        return error

auth = request('auth')
assert auth.status == 302
location = urllib.parse.urlparse(auth.headers['Location'])
assert location.netloc == 'github.com'
state = urllib.parse.parse_qs(location.query)['state'][0]
state_cookie = auth.headers.get_all('Set-Cookie')[0].split(';')[0]
callback = request('callback?code=fake-runtime-code&state=' + state, cookie=state_cookie)
assert callback.status == 302, callback.read().decode()
assert callback.headers['Location'] == '/admin/', callback.headers['Location']
cookies = callback.headers.get_all('Set-Cookie')
session_cookie = next(value.split(';')[0] for value in cookies if value.startswith('__Host-idecal-admin='))
assert 'runtime-fake-token' not in session_cookie
session = json.load(request('session', cookie=session_cookie))
assert session['authenticated'] and session['user']['login'] == 'runtime-editor'
assert 'token' not in json.dumps(session)
file = '/repos/iDecal/idecal/contents/src/data/products.json'
data = json.load(request('github?path=' + urllib.parse.quote(file + '?ref=main', safe=''), cookie=session_cookie))
assert data == {'sha': 'runtime-file', 'encoding': 'base64', 'content': 'W10='}
payload = {'sha': data['sha'], 'content': data['content'], 'branch': 'main', 'message': 'Mock runtime save'}
write_path = 'github?path=' + urllib.parse.quote(file, safe='')
saved = request(write_path, method='PUT', cookie=session_cookie, body=payload)
assert saved.status == 200, saved.read().decode()
assert json.load(saved)['commit']['sha'] == 'runtime-saved'
assert request(write_path, method='PUT', cookie=session_cookie, body=payload, origin='https://attacker.example').status == 403
png = base64.b64encode(bytes([137, 80, 78, 71, 13, 10, 26, 10])).decode()
uploaded = request('upload', method='POST', cookie=session_cookie, body={'name':'ảnh thử.png','content':png})
assert uploaded.status == 201, uploaded.read().decode()
assert json.load(uploaded)['url'].startswith('/images/uploads/')
logout = request('logout', method='POST', cookie=session_cookie)
assert logout.status == 204 and 'Max-Age=0' in logout.headers['Set-Cookie']
print('Cloudflare workerd passed: OAuth exchange, encrypted cookie, authenticated session, GitHub read/save and CSRF. GitHub mocked; no real writes.')
