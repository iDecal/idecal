import { parse, type DefaultTreeAdapterMap } from 'parse5';
import imageData from './image-seo.json' with { type: 'json' };

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
export interface ImageSeo { src: string; alt: string; title: string; }
export function imageKey(source: string): string {
  let key = source;
  try { key = decodeURIComponent(key); } catch { /* Keep malformed URLs unchanged. */ }
  return key.replace(/^https:\/\/idecal\.vn(?=\/images\/)/, '');
}
const metadata = new Map(imageData.map(image => [imageKey(image.src), image]));
export function getImageSeo(source: string, fallbackAlt: string): ImageSeo {
  return metadata.get(imageKey(source)) ?? { src: source, alt: fallbackAlt, title: fallbackAlt };
}
const escapeAttribute = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Replace only attribute ranges: imported article text, scripts and markup remain byte-for-byte intact.
export function applyImageSeo(html: string): string {
  const document = parse(html, { sourceCodeLocationInfo: true });
  const patches: { start: number; end: number; text: string }[] = [];
  function patch(element: Element, values: Record<string, string>) {
    const location = element.sourceCodeLocation?.startTag;
    if (!location) return;
    const additions: string[] = [];
    for (const [name, value] of Object.entries(values)) {
      const attribute = element.sourceCodeLocation?.attrs?.[name];
      const text = `${name}="${escapeAttribute(value)}"`;
      if (attribute) patches.push({ start: attribute.startOffset, end: attribute.endOffset, text });
      else additions.push(text);
    }
    if (additions.length) {
      let at = location.endOffset - 1;
      if (html[at - 1] === '/') at--;
      patches.push({ start: at, end: at, text: ' ' + additions.join(' ') });
    }
  }
  function visit(node: Node) {
    if ('tagName' in node) {
      const attrs = Object.fromEntries(node.attrs.map(attribute => [attribute.name, attribute.value]));
      if (node.tagName === 'img') {
        // Decorative images must remain silent for screen readers.
        const decorative = attrs.role === 'presentation' || attrs['aria-hidden'] === 'true' || attrs.alt === '';
        if (!decorative) {
          const seo = getImageSeo(attrs.src ?? '', attrs.alt || 'Ảnh minh họa decal và film dán kính');
          patch(node, { alt: seo.alt, title: seo.title });
        }
      } else if (node.tagName === 'button' && attrs['data-gallery-source']) {
        const seo = getImageSeo(attrs['data-gallery-source'], attrs['data-gallery-label'] || 'Ảnh sản phẩm');
        patch(node, { 'data-gallery-label': seo.alt, 'data-gallery-title': seo.title });
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  }
  visit(document);
  return patches.sort((a, b) => b.start - a.start).reduce((output, patch) => output.slice(0, patch.start) + patch.text + output.slice(patch.end), html);
}
