// Portable Rank Math defaults. No WordPress plugin code or account credentials.
export const seoDefaults = {
  siteName: 'iDecal',
  separator: '|',
  robots: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
  twitterCard: 'summary_large_image',
};
export function brandedTitle(title:string) {
  return /idecal/i.test(title) ? title : `${title.trim()} ${seoDefaults.separator} ${seoDefaults.siteName}`;
}
export function expandSeoTemplate(template:string, values:{title:string;description:string}) {
  const replacements:Record<string,string> = {title:values.title,excerpt:values.description,seo_title:values.title,seo_description:values.description,sitename:seoDefaults.siteName,sep:seoDefaults.separator,page:''};
  return template.replace(/%([a-z_]+)%/gi,(match,key)=>replacements[key.toLowerCase()] ?? match).replace(/\s+/g,' ').trim();
}
