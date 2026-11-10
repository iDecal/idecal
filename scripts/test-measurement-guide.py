"""Browser checks for the glass measurement guide; requires Astro dev on port 4321."""
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:4321'
SLUG = 'decal-mo-o-vuong'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    context.grant_permissions(['clipboard-read', 'clipboard-write'], origin=BASE)
    page = context.new_page()
    page.route('**/api/admin/session', lambda route: route.fulfill(json={'authenticated': False, 'configured': True}))
    for width in [1440, 390]:
        page.set_viewport_size({'width': width, 'height': 900 if width == 1440 else 844})
        for slug in [SLUG, 'decal-trang']:
            page.goto(BASE + '/san-pham/' + slug, wait_until='networkidle')
            trigger = page.locator('[data-measurement-open]')
            assert parse_qs(urlparse(trigger.get_attribute('href')).query)['san-pham'] == [slug]
            trigger.click()
            dialog = page.locator('#glass-measurement-dialog')
            assert dialog.is_visible()
            assert '4,32 m²' in dialog.inner_text()
            assert dialog.locator('svg[role=img]').count() == 1
            assert parse_qs(urlparse(dialog.locator('a[href*="lien-he"]').get_attribute('href')).query)['san-pham'] == [slug]
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.keyboard.press('Escape')
            assert not dialog.is_visible()
            assert trigger.evaluate('(el) => document.activeElement === el')
            trigger.click()
            page.locator('[data-measurement-close]').click()
            assert not dialog.is_visible()
        page.goto(BASE + '/huong-dan-do-kinh/?san-pham=' + SLUG, wait_until='networkidle')
        assert page.locator('.glass-guide h1').count() == 1
        assert '5,92 m²' in page.locator('tfoot').inner_text()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert parse_qs(urlparse(page.locator('[data-measurement-contact]').get_attribute('href')).query)['san-pham'] == [SLUG]
    page.locator('[data-copy-measurements]').click()
    page.wait_for_function("document.querySelector('[data-copy-status]').textContent.includes('Đã sao chép')")
    copied = page.evaluate('navigator.clipboard.readText()')
    assert 'Ô A1: ngang' in copied and 'Địa chỉ công trình:' in copied
    page.add_init_script("Object.defineProperty(navigator, 'clipboard', {value: {writeText: async () => {throw new Error('not permitted')}}})")
    page.reload(wait_until='networkidle')
    page.locator('[data-copy-measurements]').click()
    assert 'Đã chọn mẫu thông tin' in page.locator('[data-copy-status]').inner_text()
    assert 'Địa chỉ công trình:' in page.evaluate('window.getSelection().toString()')
    nojs = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    static = nojs.new_page()
    static.goto(BASE + '/san-pham/' + SLUG, wait_until='load')
    static.locator('[data-measurement-open]').click()
    static.wait_for_url('**/huong-dan-do-kinh/**')
    assert 'Hướng dẫn đo kính' in static.locator('.glass-guide h1').inner_text()
    nojs.close()
    context.close()
    browser.close()
print('Passed: desktop/mobile product popup, close/Escape/focus, PVC product, measurement examples, product-aware quote link, clipboard/fallback and no-JavaScript navigation.')
