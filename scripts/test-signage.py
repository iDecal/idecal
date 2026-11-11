"""Verify parent navigation, source tables and responsive service layout."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    # Exercise the existing image fallback without relying on remote image access.
    context.route('https://idecal.vn/**',lambda route:route.abort())
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for width in [1440,820,390,320]:
        page.set_viewport_size({'width':width,'height':900})
        response=page.goto('http://127.0.0.1:4321/decal-quang-cao/',wait_until='networkidle')
        assert response.status==200
        page.locator('.signage-service-card .btn-idecal-bold').click()
        page.wait_for_url('**/dan-decal-bang-hieu/')
        assert page.locator('.signage-page h1').count()==1
        assert page.locator('.sign-material').count()==5
        assert page.locator('.sign-benefit-grid article').count()==4
        assert page.locator('.sign-process>li').count()==5
        assert page.locator('.signage-page img').count()==6
        assert page.locator('.sign-table-scroll').count()==2
        assert page.locator('.sign-table-scroll tbody tr').count()==13
        assert page.locator('.signage-page a[href="tel:0866077040"]').count()==2
        for link in page.locator('.sign-jump a').all():
            assert page.locator(link.get_attribute('href')).count()==1
        page.locator('.sign-price-jump').click()
        assert page.url.endswith('#bao-gia-dan-decal-bang-hieu-moi-nhat')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
        if width<768:
            table=page.locator('.sign-table-scroll').first
            assert table.evaluate('node=>node.scrollWidth>node.clientWidth')
            table.focus()
            table.press('ArrowRight')
            page.wait_for_function('document.activeElement.scrollLeft>0')
        page.locator('.sign-breadcrumb a[href="/decal-quang-cao/"]').click()
        page.wait_for_url('**/decal-quang-cao/')
        assert page.locator('.signage-service-card').count()==1
        print(width,'px: advertising parent/child links, six images, source price rows, anchors and responsive tables verified')
    page.goto('http://127.0.0.1:4321/dich-vu/decal-quang-cao/',wait_until='networkidle')
    assert page.locator('.signage-service-card a[href="/dan-decal-bang-hieu/"]').count()==3
    assert not errors,errors
    browser.close()
