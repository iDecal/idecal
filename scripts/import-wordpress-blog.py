#!/usr/bin/env python3
"""Import published WXR posts only. Preserve text and dates; localize referenced images.
Dependencies: beautifulsoup4, markdownify, Pillow. Run from repository root.
"""
import argparse, collections, concurrent.futures, hashlib, html, io, json, re, time
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, quote, unquote
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup, Comment
from markdownify import MarkdownConverter
from PIL import Image

class ContentConverter(MarkdownConverter):
 def convert_img(self,el,text,parent_tags):
  attrs={'src':el.get('src',''),'alt':el.get('alt',''),'loading':'lazy','decoding':'async'}
  for key in ('width','height'):
   if str(el.get(key,'')).isdigit():attrs[key]=el[key]
  return '\n\n<img '+' '.join(key+'="'+html.escape(str(value),quote=True)+'"' for key,value in attrs.items())+' />\n\n'
 def convert_span(self,el,text,parent_tags):
  anchor=el.get('id')
  return ('\n<span id="'+html.escape(anchor,quote=True)+'"></span>\n' if anchor else '')+text

parser=argparse.ArgumentParser();parser.add_argument('xml');parser.add_argument('--retry-images',action='store_true');args=parser.parse_args()
ns={'w':'http://wordpress.org/export/1.2/','c':'http://purl.org/rss/1.0/modules/content/','e':'http://wordpress.org/export/1.2/excerpt/'}
root=ET.parse(args.xml).getroot();items=root.findall('./channel/item')
def field(item,key): return item.findtext(key,'',ns)
def meta(item,key): return next((field(m,'w:meta_value') for m in item.findall('w:postmeta',ns) if field(m,'w:meta_key')==key),'')
posts=[i for i in items if field(i,'w:post_type')=='post' and field(i,'w:status')=='publish']
attachments={field(i,'w:post_id'):field(i,'w:attachment_url') for i in items if field(i,'w:post_type')=='attachment'}
slugs={field(i,'w:post_name'):i for i in posts}
assert len(slugs)==len(posts),'Duplicate WordPress slugs'
out=Path('public/images/blog-wordpress');out.mkdir(parents=True,exist_ok=True)
asset_urls=set();soups={};featured={}
previous_failures={}
if not args.retry_images and Path('/tmp/wp-image-results.json').exists():
 previous_failures={f['url']:f['error'] for f in json.loads(Path('/tmp/wp-image-results.json').read_text()).get('failures',[])}
for item in posts:
 slug=field(item,'w:post_name');assert re.fullmatch(r'[a-z0-9-]+',slug),f'Unsafe slug: {slug}'
 soup=BeautifulSoup(field(item,'c:encoded'),'html.parser');soups[slug]=soup
 for im in soup.find_all('img'):
  src=html.unescape(im.get('src') or im.get('data-src') or '')
  if src.startswith('//'):src='https:'+src
  if src.startswith('/') :src='https://idecal.vn'+src
  im['src']=src
  if src.startswith(('https://','http://')):asset_urls.add(src)
 thumb=attachments.get(meta(item,'_thumbnail_id'),'')
 if thumb:featured[slug]=thumb;asset_urls.add(thumb)

def fetch(url):
 if url in previous_failures:return url,None,previous_failures[url]
 filename=hashlib.sha256(url.encode()).hexdigest()[:20]
 for existing in out.glob(filename+'.*'):
  return url,'/images/blog-wordpress/'+existing.name,None
 candidates=[url]
 original=re.sub(r'-\d+x\d+(?=\.[a-zA-Z]+(?:\?|$))','',url)
 if original!=url:candidates.append(original)
 errors=[]
 for candidate in candidates:
  try:
   parts=urlsplit(candidate);safe=urlunsplit((parts.scheme,parts.netloc,quote(unquote(parts.path),safe='/@:+'),parts.query,''))
   req=Request(safe,headers={'User-Agent':'Mozilla/5.0','Referer':'https://idecal.vn/'})
   with urlopen(req,timeout=25) as response:data=response.read(24*1024*1024)
   with Image.open(io.BytesIO(data)) as image:
    kind=image.format;image.verify()
   suffix={'JPEG':'.jpg','PNG':'.png','WEBP':'.webp','AVIF':'.avif','GIF':'.gif'}.get(kind)
   if not suffix:raise ValueError('Unsupported image format '+str(kind))
   dest=out/(filename+suffix);dest.write_bytes(data)
   return url,'/images/blog-wordpress/'+dest.name,None
  except Exception as exc:errors.append(str(exc))
 return url,None,'; '.join(errors)

print(f'Import: {len(posts)} published posts, {len(asset_urls)} image references',flush=True)
assets={};failures=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for count,(url,local,error) in enumerate(pool.map(fetch,sorted(asset_urls)),1):
  if local:assets[url]=local
  else:failures.append({'url':url,'error':error})
  if count%20==0 or count==len(asset_urls):print(f'Images {count}/{len(asset_urls)}; failed {len(failures)}',flush=True)
Path('/tmp/wp-image-results.json').write_text(json.dumps({'assets':assets,'failures':failures},ensure_ascii=False,indent=2))
# Do not publish a partial import silently. Missing files remain explicit in the report.

def category(item,title):
 cats=[html.unescape(c.text or '') for c in item.findall('category') if c.get('domain')=='category'];text=(' '.join(cats)+' '+title).lower()
 if any(w in text for w in ['khuyến mãi','sale ','ưu đãi']):return 'tin-khuyen-mai','Tin khuyến mãi',cats
 if any(w in title.lower() for w in ['báo giá','bảng giá']):return 'bao-gia','Báo giá',cats
 if any(w in text for w in ['mẫu thiết kế','ý tưởng','mẫu decal','mẫu phim']):return 'mau-thiet-ke','Mẫu thiết kế',cats
 if any(w in text for w in ['vật liệu','review sản phẩm','so sánh','phân biệt','thông số','loại nào','là gì']):return 'so-sanh-vat-lieu','So sánh vật liệu',cats
 return 'huong-dan','Hướng dẫn',cats

def link_target(value):
 parts=urlsplit(value)
 if parts.netloc not in ('','idecal.vn','www.idecal.vn'):return value
 slug=unquote(parts.path).strip('/')
 if slug in slugs:return '/blog/'+slug+('?' + parts.query if parts.query else '')+('#'+parts.fragment if parts.fragment else '')
 if value.startswith('#'):return value
 if parts.path.startswith(('/blog/','/dich-vu/','/danh-muc-san-pham/','/san-pham/','/du-an/','/khu-vuc/','/lien-he-idecal')):
  # WordPress URL layouts can differ: keep unresolved legacy paths on their original host.
  return value if parts.netloc else 'https://idecal.vn'+value
 return value if parts.netloc else 'https://idecal.vn/'+value.lstrip('/')

records=[];missing_by_post=[]
for item in posts:
 slug=field(item,'w:post_name');soup=soups[slug];title=html.unescape(field(item,'title'));missing=[]
 for tag in soup.find_all(['script','style','iframe','object','embed','form','input','button','meta','svg','nav']):tag.decompose()
 for comment in soup.find_all(string=lambda value:isinstance(value,Comment)):comment.extract()
 for heading in soup.find_all('h1'):heading.name='h2'
 for heading in list(soup.find_all(re.compile('^h[2-6]$'))):
  if not heading.get_text(strip=True):heading.decompose()
 # Gutenberg attributes/styles and administration elements are not content.
 for tag in soup.find_all(True):
  for key in list(tag.attrs):
   if key.lower().startswith('on') or key in ['style','class','srcset','sizes','data-srcset','data-sizes']:del tag[key]
 for im in list(soup.find_all('img')):
  src=im.get('src','');local=assets.get(src)
  if local:
   im['src']=local;im['alt']=im.get('alt','').strip() or title
  else:
   missing.append(src);a=soup.new_tag('a',href=src or field(item,'link'));a.string=im.get('alt') or 'Xem ảnh trong bài gốc';im.replace_with(a)
 for anchor in soup.find_all('a'):
  href=anchor.get('href','')
  if href in ('','#'):
   anchor.unwrap();continue
  if href.lower().startswith(('javascript:','data:')):anchor.unwrap();continue
  anchor['href']=assets.get(href) or link_target(href)
 if slug=='99-mau-decal-dan-kinh-van-phong-dep-2026':
  aliases=['mau-decal-mo-tron','2-mau-decal-mo-hoa-tiet-them-net-doc-dao-cho-van-phong','3-mau-decal-mo-ket-hop-su-pha-tron-day-tinh-te','12a-30-mẫu-decal-dán-kính-văn-phòng-sáng-tạo---phong-cách']
  prefixes=['20+ Mẫu','39+ Mẫu','19+ Mẫu','30+ mẫu']
  for alias,prefix in zip(aliases,prefixes):
   h=next((h for h in soup.find_all(re.compile('^h[2-6]$')) if h.get_text(' ',strip=True).startswith(prefix)),None)
   if h:h.insert_before(soup.new_tag('span',id=alias))
 # Keep original heading IDs so historical in-page links still work after Markdown conversion.
 heading_ids=[]
 for heading in soup.find_all(re.compile('^h[2-6]$')):
  old_id=heading.get('id')
  if old_id:
   marker=soup.new_tag('span',id=old_id);heading.insert_before(marker);heading_ids.append(old_id)
 body=ContentConverter(heading_style='ATX',bullets='-',escape_underscores=False).convert(str(soup))
 body=re.sub(r'\n{3,}','\n\n',body).strip()
 # An original pasted [null] token is not an editor shortcode.
 body=body.replace('[null]','')
 text=BeautifulSoup(field(item,'e:encoded') or meta(item,'rank_math_description') or str(soup),'html.parser').get_text(' ',strip=True)
 description=html.unescape(re.sub(r'\s+',' ',text)).strip()
 if len(description)>170:description=description[:167].rsplit(' ',1)[0]+'…'
 cat_slug,cat_name,original_categories=category(item,title)
 image=assets.get(featured.get(slug,'')) or next((im.get('src') for im in soup.find_all('img') if im.get('src','').startswith('/images/')), '/images/idecal-logo.png')
 date=field(item,'w:post_date').replace(' ','T')+'+07:00'
 front={'title':title,'description':description or title,'category':cat_name,'categorySlug':cat_slug,'categories':original_categories,'pubDate':date,'author':'iDecal','image':image,'wordpressId':int(field(item,'w:post_id')),'originalUrl':field(item,'link')}
 dest=Path('src/content/blog')/(slug+'.md');existed=dest.exists() and 'wordpressId:' not in dest.read_text()
 dest.write_text('---\n'+'\n'.join(f'{key}: {json.dumps(value,ensure_ascii=False)}' for key,value in front.items())+'\n---\n\n'+body+'\n')
 records.append({'slug':slug,'id':front['wordpressId'],'title':title,'category':cat_slug,'originalCategories':original_categories,'date':date,'replaced':existed,'images':len(soup.find_all('img')),'originalUrl':field(item,'link')})
 if missing:missing_by_post.append({'slug':slug,'urls':missing})
report={'source':Path(args.xml).name,'publishedPosts':len(posts),'excludedTrash':sum(field(i,'w:status')=='trash' and field(i,'w:post_type')=='post' for i in items),'downloadedImages':len(assets),'imageFailures':failures,'missingImagesByPost':missing_by_post,'posts':records,'assets':assets}
Path('docs/wordpress-blog-import.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
# Add legacy post redirects without overriding existing product/service routes.
p=Path('public/_redirects');existing=p.read_text();sources={line.split()[0] for line in existing.splitlines() if line.strip() and not line.startswith('#')};new=[]
for slug in slugs:
 for source in ('/'+slug,'/'+slug+'/'):
  if source not in sources:new.append(f'{source} /blog/{slug}/ 301')
if new:p.write_text(existing.rstrip()+'\n\n# Imported WordPress blog URLs\n'+'\n'.join(new)+'\n')
print(f'Imported {len(records)} posts; {len(assets)} images downloaded; {len(failures)} failed. Report: docs/wordpress-blog-import.json',flush=True)
