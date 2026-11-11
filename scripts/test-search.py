"""Run against built Astro preview on port 4322 to verify the static 404/index."""
from playwright.sync_api import sync_playwright, expect
BASE='http://127.0.0.1:4322'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    for width in [1440,820,390,320]:
        page.set_viewport_size({'width':width,'height':900})
        response=page.goto(BASE+'/noi-dung-khong-ton-tai/duong-dan-sai/',wait_until='networkidle')
        assert response.status==404
        expect(page.locator('.recovery-page h1')).to_have_text('Không tìm thấy trang này')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        field=page.get_by_role('searchbox')
        field.fill('thang may')
        page.get_by_role('button',name='Tìm kiếm',exact=True).click()
        page.wait_for_url('**/tim-kiem/**')
        expect(page.locator('[data-search-status]')).to_contain_text('kết quả cho “thang may”')
        assert page.locator('.search-results a[href="/dan-decal-thang-may/"]').count()==1
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        page.get_by_role('searchbox').fill('idc008')
        page.get_by_role('button',name='Tìm kiếm',exact=True).click()
        expect(page.locator('.search-results a').first).to_have_attribute('href','/san-pham/decal-mo-o-vuong/')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        print(width,'px: unknown URLs return 404; search form finds elevator service and model code without overflow')
    field=page.get_by_role('searchbox')
    field.fill('decal zxqvnonexistent')
    page.get_by_role('button',name='Tìm kiếm',exact=True).click()
    expect(page.locator('[data-search-empty]')).to_be_visible()
    assert page.locator('.search-results li').count()==0
    field.fill('')
    expect(page.locator('[data-search-status]')).to_have_text('Nhập từ khóa để bắt đầu tìm kiếm.')
    assert '?q=' not in page.url
    attack='<img src=x onerror=window.searchInjected=1>'
    field.fill(attack)
    page.get_by_role('button',name='Tìm kiếm',exact=True).click()
    expect(page.locator('[data-search-status]')).to_contain_text(attack)
    assert page.locator('[data-search-status] img').count()==0
    assert page.evaluate('window.searchInjected===undefined')
    field.fill('decal')
    page.get_by_role('button',name='Tìm kiếm',exact=True).click()
    expect(page.locator('.search-results li')).to_have_count(12)
    page.locator('[data-search-more]').click()
    expect(page.locator('.search-results li')).to_have_count(24)
    assert page.locator('.search-results li:nth-child(13) a').evaluate('node=>node===document.activeElement')
    field.fill('thang máy')
    page.get_by_role('button',name='Tìm kiếm',exact=True).click()
    expect(page.locator('[data-search-status]')).to_contain_text('thang máy')
    page.go_back()
    expect(page.get_by_role('searchbox')).to_have_value('decal')
    expect(page.locator('.search-results li')).to_have_count(12)
    # A failed download can be retried without refreshing the page.
    failed=browser.new_context(viewport={'width':390,'height':900})
    failed.route('**/search-index.json',lambda route:route.abort())
    retry=failed.new_page()
    retry.goto(BASE+'/tim-kiem/?q=thang+may',wait_until='networkidle')
    expect(retry.locator('[data-search-status]')).to_contain_text('Chưa tải được kết quả')
    failed.unroute('**/search-index.json')
    retry.get_by_role('button',name='Tìm kiếm',exact=True).click()
    expect(retry.locator('[data-search-status]')).to_contain_text('kết quả cho')
    assert retry.locator('.search-results a[href="/dan-decal-thang-may/"]').count()==1
    static_context=browser.new_context(java_script_enabled=False)
    static=static_context.new_page()
    response=static.goto(BASE+'/mot-trang-khong-co/',wait_until='networkidle')
    assert response.status==404
    assert static.locator('.recovery-links a').count()==3
    static.get_by_role('searchbox').fill('decal')
    static.get_by_role('button',name='Tìm kiếm',exact=True).click()
    static.wait_for_url('**/tim-kiem/**')
    assert static.locator('noscript').inner_text()
    assert not errors,errors
    print('No results, clearing, safe query rendering, pagination, history, retry and no-script navigation verified.')
    browser.close()
