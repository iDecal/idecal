"""Verify Vietnamese copy, price cards, sticky navigation and quote handoff."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    # Exercise layout and image fallback independently of the image host.
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
        assert page.get_by_role('table').count()==2
        assert page.get_by_role('table').first.get_by_role('columnheader').count()==3
        assert page.locator('.sign-table-scroll tbody tr').count()==13
        assert page.locator('.signage-page a[href="tel:0866077040"]').count()==1
        wording=page.locator('.signage-page').inner_text()
        for english in ['Hours Emergency','Emergency response','one way vision','One Way Vision','Holographic','Fabric']:
            assert english not in wording,english
        for link in page.locator('.sign-jump a').all():
            assert page.locator(link.get_attribute('href')).count()==1
        page.locator('.sign-price-jump').click()
        pricing_hash='#bao-gia-dan-decal-bang-hieu-moi-nhat'
        assert page.url.endswith(pricing_hash)
        page.wait_for_function('(hash)=>document.querySelector(".sign-jump a[aria-current=location]")?.hash===hash',arg=pricing_hash)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
        assert page.locator('.sign-jump').bounding_box()['y']>=79
        assert page.locator('.sign-jump').bounding_box()['y']<=97
        assert page.locator('.sign-pricing').evaluate('node=>node.compareDocumentPosition(document.querySelector(".sign-process")) & Node.DOCUMENT_POSITION_FOLLOWING')
        assert page.locator('.sign-table-scroll').first.evaluate('node=>node.scrollWidth<=node.clientWidth')
        if width<768:
            row=page.locator('.sign-table-scroll tbody tr').first
            row.scroll_into_view_if_needed()
            assert row.locator('td').count()==3
            assert row.locator('td').nth(2).is_visible()
            for cell in row.locator('td').all():
                box=cell.bounding_box()
                assert box['x']>=20 and box['x']+box['width']<=width-20
            assert row.locator('td').nth(2).get_attribute('data-label')=='Ghi Chú'
        page.locator('.sign-price-options a').nth(1).click()
        assert page.url.endswith('#bao-gia-lam-bang-hieu-dan-decal')
        page.locator('.sign-breadcrumb a[href="/decal-quang-cao/"]').click()
        page.wait_for_url('**/decal-quang-cao/')
        assert page.locator('.signage-service-card').count()==1
        print(width,'px: Vietnamese wording, parent/child navigation, sticky shortcuts, complete prices and notes verified')
    page.set_viewport_size({'width':390,'height':900})
    page.goto('http://127.0.0.1:4321/dan-decal-bang-hieu/',wait_until='networkidle')
    page.locator('.sign-actions .btn-primary-solid').click()
    page.wait_for_url('**/lien-he-idecal/**')
    assert page.locator('#booking-service').input_value()=='thi-cong-decal'
    page.goto('http://127.0.0.1:4321/dich-vu/decal-quang-cao/',wait_until='networkidle')
    assert page.locator('.signage-service-card a[href="/dan-decal-bang-hieu/"]').count()==3
    assert not errors,errors
    # All prices, notes, translations and navigation also work without scripts.
    no_js=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
    no_js.route('https://idecal.vn/**',lambda route:route.abort())
    static=no_js.new_page()
    static.goto('http://127.0.0.1:4321/dan-decal-bang-hieu/',wait_until='networkidle')
    assert static.locator('.sign-table-scroll tbody tr').count()==13
    assert 'Emergency' not in static.locator('.signage-page').inner_text()
    static.locator('.sign-price-jump').click()
    assert static.url.endswith('#bao-gia-dan-decal-bang-hieu-moi-nhat')
    print('Quote form selects installation; prices and anchors work without JavaScript.')
    browser.close()
