"""Exercise the new elevator service, local photos and its advertising parents."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    context.route('https://idecal.vn/**',lambda route:route.abort())
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for width in [1440,820,390,320]:
        page.set_viewport_size({'width':width,'height':900})
        response=page.goto('http://127.0.0.1:4321/decal-quang-cao/',wait_until='networkidle')
        assert response.status==200
        page.locator('.elevator-service-card .btn-idecal-bold').click()
        page.wait_for_url('**/dan-decal-thang-may/')
        assert page.locator('.elevator-page h1').inner_text()=='Dịch vụ dán decal thang máy'
        assert page.locator('.elevator-solutions article').count()==2
        assert page.locator('.elevator-process li').count()==5
        assert page.locator('.elevator-faq details').count()==4
        assert page.locator('.elevator-faq details[open]').count()==0
        page.locator('.elevator-faq summary').first.click()
        assert page.locator('.elevator-faq details[open]').count()==1
        page.locator('.elevator-faq summary').first.press('Enter')
        assert page.locator('.elevator-faq details[open]').count()==0
        for link in page.locator('.elevator-jump a').all():
            assert page.locator(link.get_attribute('href')).count()==1
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        gallery=page.locator('#anh-dan-thang-may')
        assert gallery.locator('[data-upload-photo]').count()==2
        for image in gallery.locator('.upload-gallery-grid img').all():
            image.scroll_into_view_if_needed()
            assert image.evaluate('image=>image.decode().then(()=>image.naturalWidth>0)')
        opener=gallery.locator('[data-upload-photo]').last
        opener.click()
        assert gallery.locator('dialog').is_visible()
        assert gallery.locator('dialog img').evaluate('image=>image.decode().then(()=>image.naturalWidth>0)')
        page.keyboard.press('Escape')
        assert not gallery.locator('dialog').is_visible()
        assert opener.evaluate('node=>node===document.activeElement')
        page.locator('.elevator-breadcrumb a[href="/decal-quang-cao/"]').click()
        page.wait_for_url('**/decal-quang-cao/')
        assert page.locator('.elevator-service-card').count()==1
        assert page.locator('.signage-service-card').count()==1
        print(width,'px: two service types, local photos, FAQ keyboard interaction, gallery and parent navigation verified')
    page.goto('http://127.0.0.1:4321/dan-decal-thang-may/',wait_until='networkidle')
    page.locator('.elevator-hero .btn-primary-solid').click()
    page.wait_for_url('**/lien-he-idecal/**')
    assert page.locator('#booking-service').input_value()=='thi-cong-decal'
    page.goto('http://127.0.0.1:4321/dich-vu/decal-quang-cao/',wait_until='networkidle')
    assert page.locator('.elevator-service-card').count()==1
    assert not errors,errors
    static_context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
    static=static_context.new_page()
    static.goto('http://127.0.0.1:4321/dan-decal-thang-may/',wait_until='networkidle')
    assert static.locator('.elevator-solutions article').count()==2
    static.locator('.elevator-faq summary').first.click()
    assert static.locator('.elevator-faq details[open]').count()==1
    assert static.locator('#anh-dan-thang-may [data-upload-photo]').first.get_attribute('href').startswith('/images/')
    print('Quote action selects installation; content and native FAQs work without JavaScript.')
    browser.close()
