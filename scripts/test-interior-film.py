"""Verify imported film service layout with Astro dev on port 4321."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    # Exercise the image fallback without depending on external assets.
    context.route('https://idecal.vn/**',lambda route:route.abort())
    page=context.new_page()
    for width in [1440,390,320]:
        page.set_viewport_size({'width':width,'height':900})
        response=page.goto('http://127.0.0.1:4321/dich-vu-film-dan-noi-that/',wait_until='networkidle')
        assert response.status==200
        assert page.locator('.interior-film-page h1').count()==1
        assert page.locator('.interior-film-pattern').count()==6
        assert page.locator('.interior-film-applications article').count()==4
        assert page.locator('.interior-film-page img').count()==17
        assert page.locator('.interior-film-questions details').count()==5
        assert page.locator('.interior-film-questions details[open]').count()==0
        page.locator('.interior-film-questions summary').first.click()
        assert page.locator('.interior-film-questions details[open]').count()==1
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
        for link in page.locator('.interior-film-pattern-copy > a').all():
            assert link.get_attribute('href').startswith('/san-pham/')
        print(width,'px: source groups/images, FAQ interaction and responsive width verified')
    page.goto('http://127.0.0.1:4321/dich-vu/film-noi-that/',wait_until='networkidle')
    assert page.locator('link[rel=canonical]').get_attribute('href')=='https://idecal.vn/dich-vu-film-dan-noi-that/'
    print('Legacy service renders imported content with original canonical')
    browser.close()
