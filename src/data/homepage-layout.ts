import { parseFragment } from 'parse5';

/** Split at an element boundary without depending on attribute order or quoting. */
export function splitHomepageAtSection(html: string, id: string) {
  const root = parseFragment(html, { sourceCodeLocationInfo: true });
  const offsets: number[] = [];
  const visit = (node: (typeof root.childNodes)[number]) => {
    if ('tagName' in node && node.tagName === 'section' && node.attrs.some(attr => attr.name === 'id' && attr.value === id)) {
      if (node.sourceCodeLocation) offsets.push(node.sourceCodeLocation.startOffset);
    }
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
  };
  for (const node of root.childNodes) visit(node);
  if (offsets.length !== 1) throw new Error(`Expected exactly one homepage section #${id}; found ${offsets.length}.`);
  return { before: html.slice(0, offsets[0]), after: html.slice(offsets[0]) };
}
