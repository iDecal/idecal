"""Verify consolidated service and products via built Astro preview on port 4322."""
from playwright.sync_api import sync_playwright,expect
BASE='http://127.0.0.1:4322'
PATH='/phim-cach-nhiet-nha-kinh/'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context()
    context.route('https://idecal.vn/**',lambda route:route.abort())
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for width in (1440,1024,768,390,320):
        page.set_viewport_size({'width':width,'height':1000})
        response=page.goto(BASE+PATH,wait_until='networkidle')
        page.add_style_tag(content='html{scroll-behavior:auto!important}')
        assert response.status==200
        expect(page.locator('[data-thermal-service] h1')).to_have_count(1)
        expect(page.locator('[data-catalog] [data-product-id]')).to_have_count(8)
        expect(page.locator('.thermal-support-products [data-product-id]')).to_have_count(2)
        assert page.locator('[data-thermal-service] [data-product-id]').evaluate_all('cards=>new Set(cards.map(card=>card.dataset.productId)).size===cards.length')
        page.locator('.thermal-jump a[href="#bao-gia-phim-cach-nhiet"]').click()
        expect(page.locator('.thermal-price-table')).to_be_visible()
        assert page.locator('.thermal-price-table tbody tr').count()==3
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        page.locator('.thermal-faq summary').first.click()
        expect(page.locator('.thermal-faq details[open]')).to_have_count(1)
        page.locator('.thermal-faq summary').first.click()
        expect(page.locator('.thermal-faq details[open]')).to_have_count(0)
        photo=page.locator('.thermal-gallery [data-upload-photo]').first
        photo.click()
        expect(page.locator('.thermal-gallery dialog')).to_be_visible()
        page.keyboard.press('Escape')
        expect(photo).to_be_focused()
        print(width,'px: one service, 8 films + 2 support products, prices, FAQ, gallery and responsive width verified')
    page.locator('.thermal-quote-box .btn-primary-solid').click()
    page.wait_for_url('**/lien-he-idecal**')
    expect(page.locator('#booking-service')).to_have_value('thi-cong-decal')
    for alias in ('/phim-cach-nhiet/','/dich-vu/phim-cach-nhiet/'):
        page.goto(BASE+alias,wait_until='networkidle')
        expect(page.locator('link[rel=canonical]')).to_have_attribute('href','https://idecal.vn'+PATH)
        expect(page.locator('[data-thermal-service] h1')).to_have_count(1)
    plain=browser.new_context(java_script_enabled=False,viewport={'width':320,'height':1000})
    plain.route('https://idecal.vn/**',lambda route:route.abort())
    fallback=plain.new_page()
    fallback.goto(BASE+PATH,wait_until='networkidle')
    expect(fallback.locator('[data-thermal-service] [data-product-id]:visible')).to_have_count(10)
    fallback.locator('.thermal-faq summary').first.click()
    expect(fallback.locator('.thermal-faq details[open]')).to_have_count(1)
    assert fallback.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert not errors,errors
    print('Quote preselection, legacy fallback canonical and no-script access verified; redirects checked separately in check-thermal-service.mjs.')
    browser.close()
