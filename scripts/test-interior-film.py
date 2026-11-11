"""Verify imported content and service UX against built Astro preview on 4322."""
from playwright.sync_api import sync_playwright, expect
BASE='http://127.0.0.1:4322'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    # Exercise the image fallback without depending on external assets.
    context.route('https://idecal.vn/**',lambda route:route.abort())
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for width in [1440,1024,768,390,320]:
        page.set_viewport_size({'width':width,'height':900})
        response=page.goto(BASE+'/dich-vu-film-dan-noi-that/',wait_until='networkidle')
        page.add_style_tag(content='html{scroll-behavior:auto!important}')
        assert response.status==200
        assert page.locator('.interior-film-page h1').count()==1
        assert page.locator('.interior-film-pattern').count()==6
        assert page.locator('.interior-film-applications article').count()==5
        assert page.locator('.interior-film-page img').count()==18
        assert page.locator('.interior-film-material-details[open]').count()==0
        first=page.locator('.interior-film-material-details').first
        first.locator('summary').click()
        expect(first.locator('li').first).to_be_visible()
        first.locator('summary').click()
        expect(first.locator('li').first).not_to_be_visible()
        tabs=page.get_by_role('tab')
        expect(tabs).to_have_count(5)
        expect(tabs.first).to_have_text('Thang máy')
        expect(tabs.first).to_have_attribute('aria-selected','true')
        expect(page.get_by_role('tabpanel')).to_have_count(1)
        elevator=page.locator('#film-application-thang-may')
        expect(elevator).to_be_visible()
        elevator.scroll_into_view_if_needed()
        expect(elevator.locator('img')).to_be_visible()
        expect(elevator.locator('img')).to_have_js_property('complete',True)
        assert elevator.locator('img').evaluate('image=>image.naturalWidth>0')
        expect(elevator.get_by_role('link')).to_have_attribute('href','/dan-decal-thang-may/')
        for i in range(5):
            tabs.nth(i).click()
            expect(tabs.nth(i)).to_have_attribute('aria-selected','true')
            expect(page.locator('#'+tabs.nth(i).get_attribute('aria-controls'))).to_be_visible()
            expect(page.get_by_role('tabpanel')).to_have_count(1)
        tabs.last.press('ArrowRight')
        expect(tabs.first).to_be_focused()
        tabs.first.press('End')
        expect(tabs.last).to_be_focused()
        tabs.last.press('Home')
        expect(tabs.first).to_be_focused()
        tabs.first.press('ArrowLeft')
        expect(tabs.last).to_be_focused()
        assert page.locator('.interior-film-questions details').count()==5
        assert page.locator('.interior-film-questions details[open]').count()==0
        page.locator('.interior-film-questions summary').first.click()
        assert page.locator('.interior-film-questions details[open]').count()==1
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
        page.locator('.interior-film-material-picker a[href="#film-van-vai"]').click()
        expect(page.locator('[data-film-navigation] a[aria-current]')).to_have_attribute('href','#mau-film-noi-that')
        assert page.locator('#film-van-vai').bounding_box()['y']>=page.locator('.interior-film-nav-wrap').bounding_box()['y']+page.locator('.interior-film-nav-wrap').bounding_box()['height']-2
        page.locator('[data-film-navigation] a[href="#cau-hoi-film-noi-that"]').click()
        expect(page.locator('[data-film-navigation] a[aria-current]')).to_have_attribute('href','#cau-hoi-film-noi-that')
        for link in page.locator('.interior-film-pattern-copy > a').all():
            assert link.get_attribute('href').startswith('/san-pham/')
        print(width,'px: source content/images, expandable applications, keyboard tabs, FAQ, sticky anchors and width verified')
    page.locator('.interior-film-contact-actions .btn-primary-solid').click()
    page.wait_for_url('**/lien-he-idecal**')
    expect(page.locator('#booking-service')).to_have_value('thi-cong-decal')
    assert page.url.endswith('#yeu-cau')
    page.goto(BASE+'/dich-vu/film-noi-that/',wait_until='networkidle')
    assert page.locator('link[rel=canonical]').get_attribute('href')=='https://idecal.vn/dich-vu-film-dan-noi-that/'
    print('Legacy service renders imported content with original canonical')
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':320,'height':900})
    nojs.route('https://idecal.vn/**',lambda route:route.abort())
    plain=nojs.new_page()
    plain.goto(BASE+'/dich-vu-film-dan-noi-that/',wait_until='networkidle')
    assert plain.locator('[data-film-application]:visible').count()==5
    expect(plain.locator('[data-film-tabs]')).not_to_be_visible()
    plain.locator('.interior-film-material-details summary').first.click()
    expect(plain.locator('.interior-film-material-details li').first).to_be_visible()
    plain.locator('.interior-film-questions summary').first.click()
    expect(plain.locator('.interior-film-questions details').first).to_have_attribute('open','')
    assert plain.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert not errors,errors
    print('Quote preselection, no-script content and native disclosures verified; no browser script errors.')
    browser.close()
