from playwright.sync_api import sync_playwright
from pathlib import Path
import json,base64,copy
from urllib.parse import urlparse,parse_qs
original=json.loads((Path(__file__).resolve().parents[1] / 'src/data/products.json').read_text());slug='decal-mo-o-vuong';idx=next(i for i,x in enumerate(original) if x['slug']==slug)
state={'products':copy.deepcopy(original),'sha':'first','writes':[],'allow':True,'race':False,'reject':False,'auth':False}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000})
 def api(route):
  req=route.request;url=req.url
  if '/api/admin/session' in url:
   route.fulfill(json={'authenticated':state['auth'] and state['allow'],'configured':True,'user':{'login':'editor','name':'Editor'}});return
  if '/api/admin/logout' in url:
   state['auth']=False;route.fulfill(status=204);return
  url=parse_qs(urlparse(url).query)['path'][0]
  if '/contents/' in url:
   if req.method=='PUT':
    payload=req.post_data_json
    if state['reject']:route.fulfill(status=409,json={'message':'Conflict'});return
    assert payload['sha']==state['sha'];assert payload['branch']=='main'
    data=json.loads(base64.b64decode(payload['content']).decode())
    for i,x in enumerate(data):
     if i!=idx:assert x==original[i],f'Unrelated product modified {i}'
    state['writes'].append(payload);state['products']=data;state['sha']='saved';route.fulfill(json={'commit':{'sha':'mock-commit'}})
   else:
    data=copy.deepcopy(state['products'])
    if state['race']:data[idx]['description']='Changed concurrently'
    route.fulfill(json={'sha':state['sha'],'encoding':'base64','content':base64.b64encode(json.dumps(data,ensure_ascii=False).encode()).decode()})
  elif url.endswith('/user'):route.fulfill(json={'login':'test-editor'})
  else:route.fulfill(json={'permissions':{'push':state['allow']}})
 page.route('**/api/admin/**',api)
 page.goto('http://127.0.0.1:4321/san-pham/'+slug,wait_until='networkidle')
 assert page.locator('[data-editor-open]').is_hidden()
 assert page.locator('[data-editor-login]').get_attribute('href')=='/admin/'
 state['auth']=True
 page.reload(wait_until='networkidle')
 page.locator('[data-editor-open]').wait_for(state='visible');page.locator('[data-editor-open]').click();page.locator('[data-editor-form]').wait_for(state='visible')
 page.locator('[name=name]').fill('Decal ô vuông – chỉnh sửa thử tiếng Việt')
 page.locator('[name=price]').fill('89000')
 page.locator('[data-editor-form] button[type=submit]').click()
 page.wait_for_function("document.querySelector('[data-editor-status]').textContent.includes('Đã lưu sản phẩm')")
 assert len(state['writes'])==1
 edited=state['products'][idx]
 assert edited['name']=='Decal ô vuông – chỉnh sửa thử tiếng Việt' and edited['price']==89000
 for key in ['slug','attributes','uses','installationImages','catalogue']:
  assert edited.get(key)==original[idx].get(key),key
 # Race: preserve editor input and avoid PUT when selected product changes remotely.
 state['race']=True
 page.locator('[name=price]').fill('99000');page.locator('[data-editor-form] button[type=submit]').click()
 page.wait_for_function("document.querySelector('[data-editor-status]').textContent.includes('người khác')")
 assert len(state['writes'])==1
 assert page.locator('[name=price]').input_value()=='99000'
 # Invalid image URL cannot be saved.
 state['race']=False
 page.locator('[name=images]').fill('javascript:alert(1)');page.locator('[data-editor-form] button[type=submit]').click()
 page.wait_for_function("document.querySelector('[data-editor-status]').textContent.includes('URL HTTPS')")
 assert len(state['writes'])==1
 page.locator('[name=images]').fill(original[idx]['images'][0])
 state['reject']=True
 page.locator('[data-editor-form] button[type=submit]').click()
 page.wait_for_function("document.querySelector('[data-editor-status]').textContent.includes('GitHub từ chối')")
 assert len(state['writes'])==1
 # Mobile: dialog scroll and width; Escape dismisses; logout clears session.
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.keyboard.press('Escape');page.locator('[data-editor-logout]').click()
 assert state['auth']==False
 page.locator('[data-editor-open]').wait_for(state='hidden')
 state['allow']=False
 state['auth']=True
 page.reload(wait_until='networkidle')
 assert page.locator('[data-editor-open]').is_hidden();assert len(state['writes'])==1
 # A CMS sign-in in another tab becomes visible on focus; sign-out hides the editor.
 state['allow']=True
 state['auth']=True
 page.evaluate("window.dispatchEvent(new Event('focus'))")
 page.locator('[data-editor-open]').wait_for(state='visible')
 state['auth']=False
 page.evaluate("window.dispatchEvent(new Event('focus'))")
 page.locator('[data-editor-open]').wait_for(state='hidden')
 assert page.locator('[data-editor-login]').is_visible()
 b.close()
print('Passed: verified login, write-permission denial, UTF-8 save, sibling/metadata preservation, concurrent-edit protection, unsafe-image rejection, GitHub conflict, mobile dialog and logout. GitHub calls mocked; no real repository writes.')
