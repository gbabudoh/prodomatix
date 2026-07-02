import { useEffect } from 'react';

const SITE_URL = 'https://prodomatix.com';
const SITE_NAME = 'Prodomatix';
const DEFAULT_IMAGE = `${SITE_URL}/pwa-512x512.png`;

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets per-page title, meta description, canonical URL, Open Graph / Twitter
 * tags, and optional JSON-LD — for the public marketing pages only (this is
 * a plain client-rendered SPA, so these tags help crawlers that do execute
 * JS and keep tab titles / social previews correct; they are not a
 * substitute for prerendering).
 */
export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, jsonLd }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — B2B Data Marketplace`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setLink('canonical', url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', image);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    const jsonLdId = 'seo-jsonld-page';
    if (jsonLd) {
      setJsonLd(jsonLdId, jsonLd);
    } else {
      document.getElementById(jsonLdId)?.remove();
    }

    return () => { document.getElementById(jsonLdId)?.remove(); };
  }, [title, description, path, image, jsonLd]);

  return null;
}

export { SITE_URL, SITE_NAME };
