"""Exercise the imported service at desktop, tablet and mobile widths."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    # Verify layout and image fallback independently of external image availability.
    context.route('https://idecal.vn/**',lambda route:route.abort())
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for width in [1440,820,390,320]:
        page.set_viewport_size({'width':width,'height':900})
        response=page.goto('http://127.0.0.1:4321/decal-dan-kinh-3d-van-song/',wait_until='networkidle')
        assert response.status==200
        assert page.locator('.wave-glass-page h1').count()==1
        assert page.locator('.wave-model').count()==3
        assert page.locator('.wave-price').all_text_contents()==['Giá từ 280.000đ/m2']*3
        assert page.locator('.wave-glass-page img').count()==6
        assert page.locator('.wave-questions details').count()==5
        assert page.locator('.wave-questions details[open]').count()==0
        page.locator('.wave-questions summary').first.click()
        assert page.locator('.wave-questions details[open]').count()==1
        page.locator('.wave-questions summary').first.press('Enter')
        assert page.locator('.wave-questions details[open]').count()==0
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
        for link in page.locator('.wave-jump a').all():
            target=link.get_attribute('href')
            assert page.locator(target).count()==1
        page.locator('.wave-jump a').first.click()
        assert page.url.endswith('#mau-decal-van-song')
        page.locator('.wave-gallery').scroll_into_view_if_needed()
        assert page.locator('.wave-glass-page [data-film-image-fallback]:visible').count()==6
        print(width,'px: models/prices, image fallback, anchors, keyboard FAQ and no overflow verified')
    assert not errors,errors
    page.goto('http://127.0.0.1:4321/dich-vu/decal-mo-3d-van-song/',wait_until='networkidle')
    assert page.locator('link[rel=canonical]').get_attribute('href')=='https://idecal.vn/decal-dan-kinh-3d-van-song/'
    browser.close()
