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
        expect(page.locator('[data-film-group]')).to_have_count(8)
        page.get_by_role('button',name='Phản gương',exact=True).click()
        expect(page.locator('[data-film-group]:visible')).to_have_count(3)
        page.get_by_role('button',name='Tất cả (8)',exact=True).click()
        expect(page.locator('[data-film-group]:visible')).to_have_count(8)
        page.locator('.jump a[href="#bao-gia"]').click()
        expect(page.locator('#total')).to_have_text('3.750.000 đ – 5.700.000 đ')
        page.locator('#area').fill('10')
        expect(page.locator('#total')).to_have_text('2.500.000 đ – 3.800.000 đ')
        page.locator('.tier').last.click()
        expect(page.locator('#total')).to_have_text('Từ 4.200.000 đ')
        page.locator('#area').fill('151')
        expect(page.locator('#total')).to_have_text('Nhập diện tích từ 2 đến 150 m².')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        page.locator('.faq summary').first.click()
        expect(page.locator('.faq details[open]')).to_have_count(1)
        page.locator('.faq summary').first.click()
        expect(page.locator('.faq details[open]')).to_have_count(0)
        photo=page.locator('.gallery [data-upload-photo]').first
        photo.click()
        expect(page.locator('.gallery dialog')).to_be_visible()
        page.keyboard.press('Escape')
        expect(photo).to_be_focused()
        print(width,'px: one service, 8 film models, filtering, estimate, FAQ, gallery and responsive width verified')
    page.locator('.product .text-button').first.click()
    page.wait_for_url('**/lien-he-idecal**')
    expect(page.locator('#booking-service')).to_have_value('thi-cong-decal')
    expect(page.locator('#booking-notes')).to_have_value('Quan tâm mã phim: Medium Black 18')
    for alias in ('/phim-cach-nhiet/','/dich-vu/phim-cach-nhiet/'):
        page.goto(BASE+alias,wait_until='networkidle')
        expect(page.locator('link[rel=canonical]')).to_have_attribute('href','https://idecal.vn'+PATH)
        expect(page.locator('[data-thermal-service] h1')).to_have_count(1)
    plain=browser.new_context(java_script_enabled=False,viewport={'width':320,'height':1000})
    plain.route('https://idecal.vn/**',lambda route:route.abort())
    fallback=plain.new_page()
    fallback.goto(BASE+PATH,wait_until='networkidle')
    expect(fallback.locator('[data-thermal-service] [data-film-group]:visible')).to_have_count(8)
    fallback.locator('.faq summary').first.click()
    expect(fallback.locator('.faq details[open]')).to_have_count(1)
    assert fallback.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert not errors,errors
    print('Quote preselection, legacy fallback canonical and no-script access verified; redirects checked separately in check-thermal-service.mjs.')
    browser.close()
