// Secondary public pages. Keep offer translations in content/site.cjs.
const fs = require('node:fs');
const path = require('node:path');
const content = require('../content/site.cjs');
const { site } = content;
const { symbol, wordmark, image: logoImage, iconLinks } = require('./brand.cjs');
const origin = site.url.replace(/\/$/, '');
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
function head({ lang, title, description, route, alternates = false, noindex = false, styles = [] }) {
  return `<!doctype html>\n<html lang="${lang}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="theme-color" content="#240007">${iconLinks()}\n<title>${escape(title)}</title>\n<meta name="description" content="${escape(description)}">\n${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${origin}${route}">`}\n${alternates ? `<link rel="alternate" hreflang="de" href="${origin}/affiliates/">\n<link rel="alternate" hreflang="en" href="${origin}/en/affiliates/">\n<link rel="alternate" hreflang="x-default" href="${origin}/affiliates/">` : ''}\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Jason Shadow">\n<meta property="og:locale" content="${lang === 'de' ? 'de_DE' : 'en_GB'}">\n<meta property="og:title" content="${escape(title)}">\n<meta property="og:description" content="${escape(description)}">\n<meta property="og:url" content="${origin}${route}">\n<meta property="og:image" content="${origin}/media/social.jpg">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="${lang === 'de' ? 'Porträt von Jason Shadow' : 'Portrait of Jason Shadow'}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escape(title)}">\n<meta name="twitter:description" content="${escape(description)}">\n<meta name="twitter:image" content="${origin}/media/social.jpg">\n<link rel="stylesheet" href="/assets/css/site.css">\n${[...styles, '/assets/css/brand.css'].map(href => `<link rel="stylesheet" href="${href}">`).join("\n")}\n</head>`;
}
function header(lang, alternate) {
  const en = lang === 'en'; const home = en ? '/en/' : '/';
  return `<a class="skip-link" href="#main">${en ? 'Skip to content' : 'Zum Inhalt'}</a>\n<header class="site-header"><div class="header-inner"><a class="brand" href="${home}">${symbol()}<span>Jason Shadow</span></a><nav class="header-actions" aria-label="${en ? 'Page navigation' : 'Seitennavigation'}"><a href="${home}">${en ? 'Home' : 'Startseite'}</a><a class="button button-primary" href="${home}#kontakt">${en ? 'Enquire' : 'Anfragen'}</a>${alternate ? `<div class="language-links" aria-label="${en ? 'Language' : 'Sprache'}"><a href="/affiliates/" lang="de" hreflang="de"${en ? '' : ' aria-current="page"'}>DE</a><a href="/en/affiliates/" lang="en" hreflang="en"${en ? ' aria-current="page"' : ''}>EN</a></div>` : ''}</nav></div></header>`;
}
function footer(lang) {
  const en = lang === 'en';
  return `<footer class="site-footer"><div class="footer-inner">${wordmark(en ? '/en/' : '/')}<nav class="footer-links" aria-label="${en ? 'Footer' : 'Weitere Seiten'}"><a href="${en ? '/en/affiliates/' : '/affiliates/'}">${en ? 'Affiliate links' : 'Affiliate-Links'}</a><a href="/impressum/" lang="de">${en ? 'Legal notice (German)' : 'Impressum'}</a><a href="/datenschutz/" lang="de">${en ? 'Privacy notice (German)' : 'Datenschutz'}</a></nav><p class="footer-bottom">© ${new Date().getUTCFullYear()} Jason Shadow</p></div></footer>`;
}
// The original uploaded partner previews are intentionally kept uncropped.
const partners = [
  { id: 'corissia', name: 'Corissia Hotels', href: 'https://corissia.com/hotels/en/', image: '/affiliates/uploads/corissia.webp', width: 1230, height: 820, de: 'Eine Auszeit auf Kreta', en: 'Your next escape to Crete', altDe: 'Strand und Sonnenuntergang als Vorschau auf Corissia Hotels', altEn: 'Beach and sunset preview for Corissia Hotels' },
  { id: 'waterdrop', name: 'Waterdrop®', href: 'https://www.waterdrop.de/collections/all?ll_ref_id=jDkbNYnSg', image: '/affiliates/uploads/waterdrop.webp', width: 4000, height: 1200, de: 'Entdecken Sie die Waterdrop-Welt', en: 'Explore the world of Waterdrop', altDe: 'Waterdrop-Produkte mit Grapefruit, Orange und Zitrone', altEn: 'Waterdrop products in grapefruit, orange and lemon varieties' },
];
const icon = (name, className = '') => {
  const shapes = {
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
    paypal: '<path d="M8 3h7c4 0 5 2 4 5s-3 5-7 5H9l-1 7H4L7 4Z" fill="currentColor" stroke="none"/><path d="m11 8-2 14h4l1-5h2c4 0 6-3 6-6 0-2-1-3-3-3" fill="currentColor" fill-opacity=".55" stroke="none"/>',
  };
  return `<svg class="linkhub-icon ${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]}</svg>`;
};
function write(route, text) { const file = path.join(__dirname, '..', route); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); }
for (const lang of ['de', 'en']) {
  const en = lang === 'en'; const route = en ? '/en/affiliates/' : '/affiliates/'; const home = en ? '/en/' : '/';
  const title = en ? 'Jason Shadow | Links, partners & support' : 'Jason Shadow | Links, Partner & Unterstützung';
  const description = en ? 'All Jason Shadow links in one place: Corissia Hotels, Waterdrop, Instagram, the official website and support via PayPal. Clearly labelled affiliate offers.' : 'Alle Links von Jason Shadow an einem Ort: Corissia Hotels, Waterdrop, Instagram, die offizielle Website und Unterstützung über PayPal. Affiliate-Angebote sind gekennzeichnet.';
  const socialLinks = [
    { icon: 'instagram', label: 'Instagram', detail: '@jason.shadow_official', href: 'https://www.instagram.com/jason.shadow_official/', external: true },
    { icon: 'website', label: en ? 'My website' : 'Meine Website', detail: en ? 'Live singing, voice & event enquiries' : 'Live-Gesang, Stimme & Auftrittsanfragen', href: home, external: false },
    { icon: 'paypal', label: en ? 'Support via PayPal' : 'Über PayPal unterstützen', detail: en ? 'Support my work' : 'Meine Arbeit unterstützen', href: 'https://www.paypal.com/donate/?hosted_button_id=TBJRBRR6DPW22', external: true },
  ];
  const body = `${head({ lang, title, description, route, alternates: true, styles: ['/assets/css/linkhub.css'] })}
<body class="linkhub-page">
<a class="skip-link" href="#main">${en ? 'Skip to links' : 'Zu den Links'}</a>
<header class="linkhub-topbar"><a class="linkhub-back" href="${home}">${icon('website')}<span>${en ? 'Website' : 'Zur Website'}</span></a><nav class="language-links" aria-label="${en ? 'Choose language' : 'Sprache wählen'}"><a href="/affiliates/" lang="de" hreflang="de"${en ? '' : ' aria-current="page"'}>DE</a><span aria-hidden="true">/</span><a href="/en/affiliates/" lang="en" hreflang="en"${en ? ' aria-current="page"' : ''}>EN</a></nav></header>
<main id="main" class="linkhub-shell">
<section class="linkhub-profile" aria-labelledby="linkhub-name"><div class="linkhub-cover linkhub-cover--logo">${logoImage('Jason Shadow — The Healing Shadow')}</div><div class="linkhub-profile-copy"><img class="linkhub-avatar" src="/media/portrait-400.webp" width="400" height="601" alt="${en ? 'Portrait of Jason Shadow' : 'Porträt von Jason Shadow'}" fetchpriority="high"><p class="linkhub-eyebrow">${en ? 'My links. All in one place.' : 'Meine Links. Alles an einem Ort.'}</p><h1 id="linkhub-name">Jason Shadow</h1><p class="linkhub-occupation">${escape(content[lang].occupation)}</p><p class="linkhub-intro">${en ? 'Discover my partners, stay in touch or support my work.' : 'Entdecken Sie meine Partner, bleiben Sie in Kontakt oder unterstützen Sie meine Arbeit.'}</p></div></section>
<section class="linkhub-partners" aria-labelledby="partner-heading"><div class="linkhub-section-label"><h2 id="partner-heading">${en ? 'Discover & explore' : 'Entdecken & inspirieren lassen'}</h2><span class="linkhub-ad-label">${en ? 'Ad · Affiliate' : 'Werbung · Affiliate'}</span></div><div class="linkhub-partner-list">${partners.map(p => `<a class="affiliate-card linkhub-partner linkhub-partner--${p.id}" href="${escape(p.href)}" target="_blank" rel="noopener noreferrer sponsored" data-reveal><span class="linkhub-preview"><img src="${p.image}" alt="${en ? p.altEn : p.altDe}" width="${p.width}" height="${p.height}" loading="lazy"></span><span class="linkhub-partner-copy"><span class="linkhub-partner-name">${p.name}</span><span class="linkhub-partner-detail">${en ? p.en : p.de}</span><span class="linkhub-partner-action">${en ? 'Explore offer' : 'Angebot entdecken'} ${icon('arrow')}</span></span></a>`).join('\n')}</div></section>
<nav class="linkhub-social-links" aria-label="${en ? 'Stay connected' : 'In Verbindung bleiben'}">${socialLinks.map(link => `<a class="linkhub-button linkhub-button--${link.icon}" href="${link.href}"${link.icon === 'paypal' ? ' data-paypal-donate' : link.external ? ' target="_blank" rel="noopener noreferrer"' : ''} data-reveal><span class="linkhub-button-icon">${icon(link.icon)}</span><span class="linkhub-button-copy"><strong>${link.label}</strong><small>${link.detail}</small></span>${icon('arrow', 'linkhub-link-arrow')}</a>`).join('\n')}</nav>
<div class="linkhub-donation-feedback" hidden><p role="status" data-paypal-status></p><a href="${socialLinks.find(link => link.icon === 'paypal').href}" data-paypal-fallback hidden>${en ? 'Open PayPal directly' : 'PayPal direkt öffnen'}</a></div>
<p class="linkhub-disclosure">${en ? 'Affiliate disclosure: I may receive a commission on purchases through the partner links. These offers are not client references.' : 'Affiliate-Hinweis: Bei Käufen über die Partnerlinks kann ich eine Provision erhalten. Diese Angebote sind keine Kundenreferenzen.'}</p>
</main><footer class="linkhub-footer"><nav aria-label="${en ? 'Legal information' : 'Rechtliche Informationen'}"><a href="/impressum/" hreflang="de">${en ? 'Legal notice (German)' : 'Impressum'}</a><a href="/datenschutz/" hreflang="de">${en ? 'Privacy (German)' : 'Datenschutz'}</a></nav><p>© ${new Date().getUTCFullYear()} Jason Shadow</p></footer>
<script type="module" src="/src/motion.js"></script>
<script type="module" src="/src/paypal-donation.js"></script>
</body></html>\n`;
  write(`${en ? 'en/' : ''}affiliates/index.html`, body);
}
write('404.html', `${head({lang:'de',title:'Seite nicht gefunden | Jason Shadow',description:'Diese Seite ist nicht verfügbar. Zur deutschen oder englischen Website von Jason Shadow.',route:'/404.html',noindex:true})}\n<body class="secondary-page">${header('de', false)}<main id="main" class="content-page section-shell"><p class="eyebrow">404</p><h1>Diese Seite gibt es nicht.</h1><div class="prose"><p>Vielleicht wurde der Link geändert. Auf der Startseite finden Sie Leistungen, einen Live-Eindruck und die Kontaktmöglichkeiten.</p><p lang="en">This page could not be found. Please visit the English homepage for services, a live performance and contact details.</p><p><a class="button button-primary" href="/">Zur Startseite</a> <a class="button button-secondary" href="/en/" lang="en">English homepage</a></p></div></main>${footer('de')}</body></html>\n`);
module.exports = { head, header, footer };
